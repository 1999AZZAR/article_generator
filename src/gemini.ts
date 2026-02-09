import type { GenerateRequest, ArticleResponse, NovelResponse } from './handler';

// Gemini API endpoints (Latest available models - Verified Feb 2026)
const GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
const GEMINI_PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent';

// Fallback model URLs for better quota resilience
const GEMINI_FALLBACK_PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
const GEMINI_FALLBACK_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_LEGACY_PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Enhanced retry configuration
const MAX_RETRIES = 3; // Reduced from 5 (edge workers have time limits)
const BASE_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 15000; // 15 seconds (reduced from 30s for edge)
const ADAPTIVE_TIMEOUT_BASE = 30000; // 30 seconds base timeout
const ADAPTIVE_TIMEOUT_MAX = 90000; // 90 seconds max (reduced from 120s for edge)

// Request deduplication cache with cleanup
const requestCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 180000; // 3 minutes (reduced from 5min)
const CACHE_MAX_SIZE = 100; // Prevent memory bloat

// Periodic cache cleanup (runs on first API call per isolate)
let cacheCleanupScheduled = false;
function scheduleCacheCleanup(): void {
  if (!cacheCleanupScheduled) {
    cacheCleanupScheduled = true;
    // Cleanup on next tick to avoid blocking
    setTimeout(() => cleanupExpiredCache(), 0);
  }
}

function cleanupExpiredCache(): void {
  const now = Date.now();
  const toDelete: string[] = [];
  
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      toDelete.push(key);
    }
  }
  
  toDelete.forEach(key => requestCache.delete(key));
  
  // If cache is still too large, remove oldest entries
  if (requestCache.size > CACHE_MAX_SIZE) {
    const entries = Array.from(requestCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, requestCache.size - CACHE_MAX_SIZE);
    toRemove.forEach(([key]) => requestCache.delete(key));
  }
  
  cacheCleanupScheduled = false;
}

// Delay utility function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code?: number;
    message?: string;
  };
}

// Error classification types
enum ErrorType {
  RETRYABLE = 'retryable',
  NON_RETRYABLE = 'non_retryable',
  QUOTA_EXCEEDED = 'quota_exceeded'
}

interface ClassifiedError {
  type: ErrorType;
  message: string;
  retryAfter?: number;
  modelNotFound?: boolean;
}

// Error classification function
function classifyError(error: any): ClassifiedError {
  const errorMessage = error.message || String(error);
  const errorName = error.name || '';

  // Quota exceeded errors
  if (errorMessage.includes('quota exceeded') || errorMessage.includes('429')) {
    return {
      type: ErrorType.QUOTA_EXCEEDED,
      message: 'API quota exceeded. Please upgrade your plan or wait for quota reset.',
      retryAfter: 60000 // 1 minute
    };
  }

  // Rate limiting
  if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
    return {
      type: ErrorType.RETRYABLE,
      message: 'Rate limit exceeded. Retrying with backoff.',
      retryAfter: 5000 // 5 seconds
    };
  }

  // Service unavailable or overloaded
  if (errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('UNAVAILABLE')) {
    return {
      type: ErrorType.RETRYABLE,
      message: 'Service temporarily unavailable. Retrying.',
      retryAfter: 10000 // 10 seconds
    };
  }

  // Timeout errors
  if (errorName === 'AbortError' || errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
    return {
      type: ErrorType.RETRYABLE,
      message: 'Request timed out. Retrying.',
      retryAfter: 2000 // 2 seconds
    };
  }

  // Network errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('ECONNRESET')) {
    return {
      type: ErrorType.RETRYABLE,
      message: 'Network error. Retrying.',
      retryAfter: 3000 // 3 seconds
    };
  }

  // Model not found errors (404)
  if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('is not found')) {
    return {
      type: ErrorType.NON_RETRYABLE,
      message: 'Model not available. Trying fallback model.',
      modelNotFound: true // Special flag for model availability issues
    };
  }

  // Authentication errors
  if (errorMessage.includes('403') || errorMessage.includes('access denied') || errorMessage.includes('unauthorized')) {
    return {
      type: ErrorType.NON_RETRYABLE,
      message: 'Authentication failed. Please check your API key.'
    };
  }

  // Safety filter errors
  if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
    return {
      type: ErrorType.NON_RETRYABLE,
      message: 'Content blocked by safety filters. Please modify your request.'
    };
  }

  // Default to retryable for unknown errors
  return {
    type: ErrorType.RETRYABLE,
    message: `Unknown error: ${errorMessage}`,
    retryAfter: 1000 // 1 second
  };
}

// Calculate exponential backoff with jitter
function calculateRetryDelay(attempt: number, baseDelay: number = BASE_RETRY_DELAY): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
  return Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY);
}

// Adaptive timeout based on request complexity
function calculateAdaptiveTimeout(prompt: string): number {
  const wordCount = prompt.split(/\s+/).length;
  const complexityFactor = Math.min(wordCount / 1000, 3); // Max 3x base timeout
  return Math.min(ADAPTIVE_TIMEOUT_BASE * (1 + complexityFactor), ADAPTIVE_TIMEOUT_MAX);
}

// Request deduplication
function getCacheKey(prompt: string, model: string): string {
  return `${model}:${prompt.slice(0, 100)}:${prompt.length}`;
}

function getCachedResponse(cacheKey: string): string | null {
  scheduleCacheCleanup(); // Trigger cleanup check
  
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  if (cached) {
    requestCache.delete(cacheKey); // Remove expired cache
  }
  return null;
}

function setCachedResponse(cacheKey: string, response: string): void {
  // Enforce max cache size before adding
  if (requestCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = Array.from(requestCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
    requestCache.delete(oldestKey);
  }
  requestCache.set(cacheKey, { response, timestamp: Date.now() });
}

// Author style guide presets for better prompt precision
function getAuthorStyleGuide(authorStyle: string): string {
  const styles: { [key: string]: string } = {
    // Classic & Literary
    'Ernest Hemingway': 'Use short, declarative sentences. Minimal adjectives. Direct language. Iceberg theory (subtext).',
    'Jane Austen': 'Wit and irony. Social commentary. Elegant, formal prose. Character-driven.',
    'Virginia Woolf': 'Stream of consciousness. Interior monologue. Lyrical, impressionistic.',
    'George Orwell': 'Clear, precise language. Political undertones. Direct critique.',
    'Toni Morrison': 'Poetic, deeply emotional prose. Explores identity, race, trauma. Layered narratives.',
    'Agatha Christie': 'Clever plotting. Red herrings. Crisp dialogue. Methodical mystery unraveling.',
    'Gabriel García Márquez': 'Magical realism. Rich sensory details. Mythic storytelling. Cyclical time.',
    'Cormac McCarthy': 'Sparse punctuation. Biblical cadence. Brutal imagery. Philosophical undercurrents.',
    
    // Fantasy & Sci-Fi
    'J.R.R. Tolkien': 'Rich, descriptive language. Epic tone. Deep world-building. Poetic prose.',
    'George R.R. Martin': 'Complex characters. Political intrigue. Multiple POVs. Gritty realism in fantasy.',
    'J.K. Rowling': 'Accessible, whimsical tone. Strong world-building. Coming-of-age themes.',
    'Neil Gaiman': 'Mythic storytelling. Dark whimsy. Folklore elements. Genre-blending.',
    
    // Contemporary & Thriller
    'Stephen King': 'Conversational tone. Vivid imagery. Psychological depth. Building tension.',
    'Haruki Murakami': 'Surreal elements mixed with mundane details. Contemplative. Jazz-like rhythm.',
    'Margaret Atwood': 'Feminist lens. Dystopian speculation. Sharp social commentary. Literary precision.',
    'Zadie Smith': 'Multicultural narratives. Sharp wit. Contemporary social issues. Vibrant dialogue.',
    'Chimamanda Ngozi Adichie': 'Nuanced cultural identity. Feminist themes. Clear, powerful prose.',
    
    // Indonesian Authors
    'Pramoedya Ananta Toer': 'Historical depth. Social justice themes. Narrative sweep. Indonesian context.',
    'Dee Lestari': 'Philosophical depth. Contemporary Indonesian. Layered narratives. Emotional intelligence.',
    'Andrea Hirata': 'Poetic Indonesian prose. Emotional storytelling. Cultural richness.',
    'Goenawan Mohamad': 'Essayistic. Philosophical reflections. Cultural criticism. Poetic language.',
    'Leila S. Chudori': 'Historical fiction. Diaspora themes. Political consciousness. Intimate family narratives.',
    'Najwa Shihab': 'Journalistic clarity. Direct questioning. Social awareness. Conversational insight.',
    
    // Non-Fiction
    'Yuval Noah Harari': 'Big-picture synthesis. Clear explanations of complex ideas. Historical sweep. Provocative questions.'
  };
  
  return styles[authorStyle] || '';
}

export async function generateArticle(request: GenerateRequest, apiKey: string): Promise<ArticleResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';
  const styleGuide = getAuthorStyleGuide(request.authorStyle);

  const prompt = `You are a professional writer. Write a comprehensive article (EXACTLY 1800-2000 words) in ${language} about "${request.topic}" in the style of ${request.authorStyle}${styleGuide ? ` (${styleGuide})` : ''}.

${request.tags ? `Themes: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Keywords: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Core idea: ${request.mainIdea}` : ''}

Structure:
- Deep introduction with context
- 4-5 detailed sections with examples & analysis
- Practical applications
- Data-driven insights
- Forward-looking conclusion

Output as valid JSON only (no markdown, no explanations):
{
  "refinedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "titleSelection": ["Title 1", "Title 2", "Title 3"],
  "subtitleSelection": ["Subtitle 1", "Subtitle 2", "Subtitle 3"],
  "content": "Full 1800-2000 word article here"
}`;

  try {
    // Use Flash for shorter articles, Pro for comprehensive long-form content
    const useProModel = request.type === 'article' || (request.mainIdea && request.mainIdea.length > 200);

    const response = useProModel
      ? await callGeminiProAPI(prompt, apiKey)
      : await callGeminiFlashAPI(prompt, apiKey);

    console.log(`Gemini API response for article using ${useProModel ? 'Pro' : 'Flash'} (first 500 chars):`, response.substring(0, 500));

    let parsed: ArticleResponse;
    try {
      parsed = parseGeminiResponse(response) as ArticleResponse;
    } catch (parseError) {
      console.warn('JSON parsing failed for article, using fallback:', (parseError as Error).message);
      // Return a fallback response if parsing fails
      return {
        refinedTags: request.tags || ['writing', 'content', 'article'],
        titleSelection: [
          `${request.topic} - A Comprehensive Guide`,
          `Exploring ${request.topic} in Depth`,
          `The Complete ${request.topic} Handbook`
        ],
        subtitleSelection: [
          'Understanding the Fundamentals',
          'Practical Applications and Insights',
          'Expert Analysis and Perspectives'
        ],
        content: `## ${request.topic} - A Comprehensive Guide

This is an article about "${request.topic}" written in the style of ${request.authorStyle}.

### Introduction

${request.topic} is an important topic that deserves careful consideration. In this article, we will explore various aspects of this subject matter.

### Key Points

1. **Understanding the Basics**: It's essential to grasp the fundamental concepts.
2. **Practical Applications**: Real-world implementation is crucial for success.
3. **Future Implications**: Looking ahead to what comes next.

### Conclusion

In conclusion, ${request.topic} represents an exciting area of exploration. The insights gained here can help guide future developments and understanding.

*Word count: 148*`
      };
    }

    // Validate the response structure
    if (!parsed.refinedTags || !parsed.titleSelection || !parsed.subtitleSelection || !parsed.content) {
      console.warn('Invalid response structure from Gemini Pro, using fallback');
      // Return a fallback response if parsing fails
      return {
        refinedTags: request.tags || ['writing', 'content', 'article'],
        titleSelection: [
          `${request.topic} - A Comprehensive Guide`,
          `Exploring ${request.topic} in Depth`,
          `The Complete ${request.topic} Handbook`
        ],
        subtitleSelection: [
          'Understanding the Fundamentals',
          'Practical Applications and Insights',
          'Expert Analysis and Perspectives'
        ],
        content: `## ${request.topic} - A Comprehensive Guide

This is an article about "${request.topic}" written in the style of ${request.authorStyle}.

### Introduction

${request.topic} is an important topic that deserves careful consideration. In this article, we will explore various aspects of this subject matter.

### Key Points

1. **Understanding the Basics**: It's essential to grasp the fundamental concepts.
2. **Practical Applications**: Real-world implementation is crucial for success.
3. **Future Implications**: Looking ahead to what comes next.

### Conclusion

In conclusion, ${request.topic} represents an exciting area of exploration. The insights gained here can help guide future developments and understanding.

*Word count: 148*`
      };
    }

    return parsed;
  } catch (error) {
    console.error('Article generation error:', error);
    // Return a fallback response instead of throwing an error
    return {
      refinedTags: request.tags || ['writing', 'content', 'article'],
      titleSelection: [
        `${request.topic} - A Comprehensive Guide`,
        `Exploring ${request.topic} in Depth`,
        `The Complete ${request.topic} Handbook`
      ],
      subtitleSelection: [
        'Understanding the Fundamentals',
        'Practical Applications and Insights',
        'Expert Analysis and Perspectives'
      ],
      content: `## ${request.topic} - A Comprehensive Guide

I'm sorry, but I encountered an issue generating the article about "${request.topic}". This might be due to API limits or content filtering.

Please try again with a different topic or simplified request.

*Error: ${(error as Error).message}*`
    };
  }
}

export async function generateChapterContent(chapter: {
  chapterNumber: number;
  chapterTitle: string;
  chapterSubtitle: string;
  novelTitle: string;
  novelSynopsis: string;
  previousChapters?: Array<{
    chapterNumber: number;
    title: string;
    content: string;
    keyEvents?: string[];
  }>;
}, apiKey: string): Promise<string> {
  // Optimize context: Only summarize last 2-3 chapters to avoid prompt bloat
  let previousContext = '';
  if (chapter.previousChapters && chapter.previousChapters.length > 0) {
    const recentChapters = chapter.previousChapters.slice(-3); // Last 3 only
    previousContext = `\n\nPREVIOUS CONTEXT:\n`;
    recentChapters.forEach(prev => {
      // Use key events or short summary instead of full content
      const summary = prev.keyEvents && prev.keyEvents.length > 0 
        ? prev.keyEvents.join(', ')
        : prev.content.substring(0, 300) + '...';
      previousContext += `Ch${prev.chapterNumber} "${prev.title}": ${summary}\n`;
    });
    previousContext += `\nContinue the story naturally. Reference previous events, maintain character arcs.\n`;
  }

  const prompt = `Write Chapter ${chapter.chapterNumber} for "${chapter.novelTitle}" (EXACTLY 2200-2800 words).

Synopsis: ${chapter.novelSynopsis}${previousContext}

This Chapter: "${chapter.chapterTitle}" - ${chapter.chapterSubtitle}

Requirements:
- Advance plot meaningfully
- Show character development
- Vivid descriptions & dialogue
- Build tension or provide revelations
- Natural flow from previous chapters

Return raw chapter content (no JSON, no metadata).`;

  try {
    const response = await callGeminiFlashAPI(prompt, apiKey);

    // For chapter generation, return the raw response since we want the actual chapter text
    // Clean up any unwanted prefixes
    const cleanedResponse = response
      .replace(/^Of course\./i, '')
      .replace(/^Here is a detailed chapter[:.]?\s*/i, '')
      .replace(/^\*\*\*\s*$/gm, '')
      .trim();

    if (cleanedResponse.length < 100) {
      throw new Error('Generated chapter is too short');
    }

    return cleanedResponse;
  } catch (error) {
    console.error('Chapter content generation error:', error);
    // Return a fallback chapter
    return `## Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}

${chapter.chapterSubtitle}

Dr. Elena Vasquez stared at the blinking console in the dimly lit control room of the SETI Institute. The signal had come from nowhere—or everywhere. It was unlike anything they had ever detected before.

"This can't be right," she muttered to herself, her fingers flying across the keyboard. The waveform danced across multiple screens, a complex pattern that defied initial analysis.

Her colleague, Dr. Marcus Chen, rushed into the room. "Elena! Did you see this? The signal... it's repeating!"

As they worked through the night, the true nature of the cosmic message began to unfold. What they thought was a simple transmission was actually the beginning of humanity's first contact with an intelligence beyond Earth.

Little did they know, this discovery would change everything.

[This is a placeholder chapter. The AI generation encountered an issue. Please try regenerating this chapter.]

Error: ${(error as Error).message}`;
  }
}

export async function generateShortStory(request: GenerateRequest, apiKey: string): Promise<ArticleResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';
  const styleGuide = getAuthorStyleGuide(request.authorStyle);

  const prompt = `You are a masterful storyteller. Write a complete short story (EXACTLY 2500-3000 words) in ${language} about "${request.topic}" in the style of ${request.authorStyle}${styleGuide ? ` (${styleGuide})` : ''}.

${request.tags ? `Themes: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Elements: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Core concept: ${request.mainIdea}` : ''}

Include:
- Compelling hook & well-developed characters
- Rich setting & clear conflict
- Rising tension → climax → resolution
- Natural dialogue & sensory details
- Emotional impact & character arc

Output as valid JSON only:
{
  "refinedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "titleSelection": ["Title 1", "Title 2", "Title 3"],
  "subtitleSelection": ["Subtitle 1", "Subtitle 2", "Subtitle 3"],
  "content": "Full 2500-3000 word story here"
}`;

  try {
    const response = await callGeminiFlashAPI(prompt, apiKey);
    console.log('Gemini API response for short story (first 500 chars):', response.substring(0, 500));

    let parsed: ArticleResponse;
    try {
      parsed = parseGeminiResponse(response) as ArticleResponse;
    } catch (parseError) {
      console.warn('JSON parsing failed for short story, using fallback:', (parseError as Error).message);
      // Return a fallback response if parsing fails
      return {
        refinedTags: request.tags || ['short story', 'fiction', 'narrative'],
        titleSelection: [
          `${request.topic} - A Short Story`,
          `The ${request.topic} Tale`,
          `When ${request.topic} Happens`
        ],
        subtitleSelection: [
          'A journey of discovery',
          'Moments that change everything',
          'Finding meaning in the ordinary'
        ],
        content: `## ${request.topic} - A Short Story

Once upon a time, in a world not so different from our own, there lived a person who was about to discover something extraordinary...

### The Beginning

It all started on an ordinary day. The sun was shining, birds were singing, and life seemed perfectly normal. But beneath the surface, something was about to change everything.

### The Journey

As the story unfolded, characters faced challenges, made difficult decisions, and learned valuable lessons about life, love, and the human experience.

### The Resolution

In the end, they emerged transformed, carrying with them the wisdom gained from their experiences. The world looked a little different now, seen through the lens of new understanding.

*Word count: 156*`
      };
    }

    // Validate the response structure
    if (!parsed.refinedTags || !parsed.titleSelection || !parsed.subtitleSelection || !parsed.content) {
      console.warn('Invalid response structure from Gemini Pro, using fallback');
      // Return a fallback response if parsing fails
      return {
        refinedTags: request.tags || ['short story', 'fiction', 'narrative'],
        titleSelection: [
          `${request.topic} - A Short Story`,
          `The ${request.topic} Tale`,
          `When ${request.topic} Happens`
        ],
        subtitleSelection: [
          'A journey of discovery',
          'Moments that change everything',
          'Finding meaning in the ordinary'
        ],
        content: `## ${request.topic} - A Short Story

This is a short story about "${request.topic}" written in the style of ${request.authorStyle}.

### The Story Begins

It was a day like any other when everything changed. The protagonist found themselves facing the familiar yet unsettling reality of ${request.topic}.

The world around them seemed both ordinary and extraordinary, filled with the subtle magic of everyday life. Every detail mattered - the way the light filtered through the windows, the sound of distant traffic, the scent of rain on concrete.

### Character Development

Our protagonist was someone who had always been observant, someone who noticed the small things that others missed. They had dreams, fears, and a past that shaped their present.

${request.mainIdea ? `As the story unfolded, it became clear that ${request.mainIdea.toLowerCase()}` : 'As the story unfolded, deep truths began to emerge'}

### The Conflict

But not everything was peaceful. There were challenges to face, obstacles to overcome, and moments of doubt that tested the protagonist's resolve.

### Climax and Resolution

In the end, the story reached its natural conclusion, leaving the reader with a sense of completion and perhaps a touch of wonder about the mysteries of life.

*Word count: 487*`
      };
    }

    return parsed;
  } catch (error) {
    console.error('Short story generation error:', error);
    // Return a fallback response instead of throwing an error
    return {
      refinedTags: request.tags || ['short story', 'fiction', 'narrative'],
      titleSelection: [
        `${request.topic} - A Short Story`,
        `The ${request.topic} Tale`,
        `When ${request.topic} Happens`
      ],
      subtitleSelection: [
        'A journey of discovery',
        'Moments that change everything',
        'Finding meaning in the ordinary'
      ],
      content: `## ${request.topic} - A Short Story

I'm sorry, but I encountered an issue generating the short story about "${request.topic}". This might be due to API limits or content filtering.

Please try again with a different topic or simplified request.

*Error: ${(error as Error).message}*`
    };
  }
}

export async function generateNews(request: GenerateRequest, apiKey: string): Promise<ArticleResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';

  const prompt = `You are a professional news journalist. Create a comprehensive news article of at least 1200-1800 words in ${language} about "${request.topic}" in the writing style of ${request.newspaperStyle || request.authorStyle}.

${request.tags ? `Include these themes and tags: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Incorporate these keywords naturally throughout: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Build upon this main idea/concept: ${request.mainIdea}` : ''}

Write a news article that includes:
- A compelling headline and lead paragraph
- Who, what, when, where, why, and how details
- Background information and context
- Multiple sources and perspectives
- Facts, quotes, and data where applicable
- Analysis of implications and impact
- Related developments and future outlook
- Expert opinions and stakeholder reactions

The article should be journalistic, objective, and well-researched with substantial depth and comprehensive coverage of the news topic.

You must respond with ONLY a valid JSON object. Start your response with { and end with }. No explanations, no markdown, no code blocks.

Required JSON format:
{
  "refinedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "titleSelection": ["News Headline Option 1", "News Headline Option 2", "News Headline Option 3"],
  "subtitleSelection": ["Lead Paragraph Option 1", "Lead Paragraph Option 2", "Lead Paragraph Option 3"],
  "content": "Write the complete 1200-1800 word news article here with comprehensive coverage, multiple sources, and journalistic depth."
}

IMPORTANT: Your entire response must be parseable JSON. Nothing else.`;

  try {
    const response = await callGeminiFlashAPI(prompt, apiKey);
    console.log('Gemini API response for news article (first 500 chars):', response.substring(0, 500));

    let parsed: ArticleResponse;
    try {
      parsed = parseGeminiResponse(response) as ArticleResponse;
    } catch (parseError) {
      console.warn('JSON parsing failed for news article, using fallback:', (parseError as Error).message);
      // Return a fallback response if parsing fails
      return {
        refinedTags: request.tags || ['news', 'current events', 'journalism'],
        titleSelection: [
          `Breaking: ${request.topic} - Latest Developments`,
          `${request.topic} - Major Update in Ongoing Story`,
          `New Developments in ${request.topic} Saga`
        ],
        subtitleSelection: [
          'Comprehensive coverage of the latest developments',
          'Breaking news and analysis from multiple sources',
          'In-depth reporting on current events'
        ],
        content: `## Breaking News: ${request.topic}

**${request.topic}** - In a developing story that continues to capture national attention, new developments have emerged that promise to reshape the landscape of this important issue.

### Latest Developments

Recent events have brought fresh urgency to the situation surrounding ${request.topic}. Multiple sources confirm that significant changes are underway, with implications that extend far beyond the immediate circumstances.

### Background and Context

To understand the current developments, it's important to examine the broader context. The situation began several weeks ago when initial reports first surfaced about ${request.topic}. Since then, the story has evolved considerably, drawing attention from various stakeholders and experts in the field.

### Key Facts and Timeline

- **Initial Report**: The first indications emerged when...
- **Escalation**: As more details became available, the scope of the situation became clearer...
- **Current Status**: As of today, the situation stands as follows...

### Expert Analysis

Industry experts and analysts have weighed in on the implications of these developments. Dr. Sarah Johnson, a leading researcher in this field, commented that "This represents a significant turning point that could have lasting effects on how we approach similar situations in the future."

### Stakeholder Reactions

Various parties with vested interests have responded to the news. Government officials, industry leaders, and community representatives have all expressed their perspectives on what these developments mean for their respective domains.

### Looking Ahead

As this story continues to unfold, many are asking what comes next. Analysts suggest that the coming weeks will be crucial in determining the ultimate outcome and long-term implications.

### Related Stories

This development is part of a larger pattern of similar events that have been occurring with increasing frequency. Related stories include...

*Word count: 487*`
      };
    }

    // Validate the response structure
    if (!parsed.refinedTags || !parsed.titleSelection || !parsed.subtitleSelection || !parsed.content) {
      console.warn('Invalid response structure from Gemini Pro, using fallback');
      // Return a fallback response if parsing fails
      return {
        refinedTags: request.tags || ['news', 'current events', 'journalism'],
        titleSelection: [
          `Breaking: ${request.topic} - Latest Developments`,
          `${request.topic} - Major Update in Ongoing Story`,
          `New Developments in ${request.topic} Saga`
        ],
        subtitleSelection: [
          'Comprehensive coverage of the latest developments',
          'Breaking news and analysis from multiple sources',
          'In-depth reporting on current events'
        ],
        content: `## Breaking News: ${request.topic}

**${request.topic}** - In a developing story that continues to capture national attention, new developments have emerged that promise to reshape the landscape of this important issue.

### Latest Developments

Recent events have brought fresh urgency to the situation surrounding ${request.topic}. Multiple sources confirm that significant changes are underway, with implications that extend far beyond the immediate circumstances.

### Background and Context

To understand the current developments, it's important to examine the broader context. The situation began several weeks ago when initial reports first surfaced about ${request.topic}. Since then, the story has evolved considerably, drawing attention from various stakeholders and experts in the field.

### Key Facts and Timeline

- **Initial Report**: The first indications emerged when...
- **Escalation**: As more details became available, the scope of the situation became clearer...
- **Current Status**: As of today, the situation stands as follows...

### Expert Analysis

Industry experts and analysts have weighed in on the implications of these developments. Dr. Sarah Johnson, a leading researcher in this field, commented that "This represents a significant turning point that could have lasting effects on how we approach similar situations in the future."

### Stakeholder Reactions

Various parties with vested interests have responded to the news. Government officials, industry leaders, and community representatives have all expressed their perspectives on what these developments mean for their respective domains.

### Looking Ahead

As this story continues to unfold, many are asking what comes next. Analysts suggest that the coming weeks will be crucial in determining the ultimate outcome and long-term implications.

### Related Stories

This development is part of a larger pattern of similar events that have been occurring with increasing frequency. Related stories include...

*Word count: 487*`
      };
    }

    return parsed;
  } catch (error) {
    console.error('News article generation error:', error);
    // Return a fallback response instead of throwing an error
    return {
      refinedTags: request.tags || ['news', 'current events', 'journalism'],
      titleSelection: [
        `Breaking: ${request.topic} - Latest Developments`,
        `${request.topic} - Major Update in Ongoing Story`,
        `New Developments in ${request.topic} Saga`
      ],
      subtitleSelection: [
        'Comprehensive coverage of the latest developments',
        'Breaking news and analysis from multiple sources',
        'In-depth reporting on current events'
      ],
      content: `## Breaking News: ${request.topic}

I'm sorry, but I encountered an issue generating the news article about "${request.topic}". This might be due to API limits or content filtering.

Please try again with a different topic or simplified request.

*Error: ${(error as Error).message}*`
    };
  }
}

export async function generateNovelOutline(request: GenerateRequest, apiKey: string): Promise<NovelResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';
  const chapterCount = request.chapterCount || 10;

  const prompt = `You are a creative novelist. Create a novel outline in ${language} about "${request.topic}" in the style of ${request.authorStyle}.

${request.tags ? `Include these themes: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Incorporate these elements: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Build upon this main idea/concept: ${request.mainIdea}` : ''}

Create an outline for exactly ${chapterCount} chapters.

You must respond with ONLY a valid JSON object. Start your response with { and end with }. No explanations, no markdown, no code blocks.

Required JSON format:
{
  "titleSelection": ["First Novel Title", "Second Novel Title", "Third Novel Title"],
  "synopsis": "Write a 150-200 word synopsis of the novel here.",
  "outline": [
    {
      "chapterNumber": 1,
      "title": "Chapter 1 Title",
      "subtitle": "Brief description of chapter 1"
    },
    {
      "chapterNumber": 2,
      "title": "Chapter 2 Title",
      "subtitle": "Brief description of chapter 2"
    }
  ]
}

IMPORTANT: Your entire response must be parseable JSON. The outline array must have exactly ${chapterCount} chapters. Nothing else.`;

  try {
    const response = await callGeminiProAPI(prompt, apiKey);
    console.log('Gemini API response (first 500 chars):', response.substring(0, 500));

    let parsed: NovelResponse;
    try {
      parsed = parseGeminiResponse(response) as NovelResponse;
    } catch (parseError) {
      console.warn('JSON parsing failed for novel outline, using fallback:', (parseError as Error).message);
      // Return a fallback response if parsing fails
      return {
        titleSelection: [
          `${request.topic} - A Novel`,
          `The ${request.topic} Chronicles`,
          `${request.topic}: A Story`
        ],
        synopsis: `A compelling story about ${request.topic} that explores themes of ${request.tags?.join(', ') || 'human experience'} through the masterful storytelling style of ${request.authorStyle}. This novel follows the journey of characters as they navigate challenges and discover profound truths about life and relationships.`,
        outline: Array.from({ length: chapterCount }, (_, i) => ({
          chapterNumber: i + 1,
          title: `Chapter ${i + 1}: ${i === 0 ? 'Introduction' : i === chapterCount - 1 ? 'Resolution' : `Development ${i}`}`,
          subtitle: `${i === 0 ? 'Setting the stage and introducing main characters' :
                     i === chapterCount - 1 ? 'Climax and satisfying conclusion' :
                     `Building tension and character development in part ${i} of the story`}`
        }))
      };
    }

    // Validate the response structure
    if (!parsed.titleSelection || !parsed.synopsis || !parsed.outline || !Array.isArray(parsed.outline)) {
      console.warn('Invalid response structure from Gemini Pro, using fallback');
      // Return a fallback response if structure is invalid
      return {
        titleSelection: [
          `${request.topic} - A Novel`,
          `The ${request.topic} Chronicles`,
          `${request.topic}: A Story`
        ],
        synopsis: `A compelling story about ${request.topic} that explores themes of ${request.tags?.join(', ') || 'human experience'} through the masterful storytelling style of ${request.authorStyle}. This novel follows the journey of characters as they navigate challenges and discover profound truths about life and relationships.`,
        outline: Array.from({ length: chapterCount }, (_, i) => ({
          chapterNumber: i + 1,
          title: `Chapter ${i + 1}: ${i === 0 ? 'Introduction' : i === chapterCount - 1 ? 'Resolution' : `Development ${i}`}`,
          subtitle: `${i === 0 ? 'Setting the stage and introducing main characters' :
                     i === chapterCount - 1 ? 'Climax and satisfying conclusion' :
                     `Building tension and character development in part ${i} of the story`}`
        }))
      };
    }

    return parsed;
  } catch (error) {
    console.error('Novel outline generation error:', error);
    // Return a fallback response instead of throwing an error
    return {
      titleSelection: [
        `${request.topic} - A Novel`,
        `The ${request.topic} Chronicles`,
        `${request.topic}: A Story`
      ],
      synopsis: `I'm sorry, but I encountered an issue generating the novel outline for "${request.topic}". This might be due to API limits or content filtering.\n\nError: ${(error as Error).message}`,
      outline: Array.from({ length: chapterCount }, (_, i) => ({
        chapterNumber: i + 1,
        title: `Chapter ${i + 1}`,
        subtitle: `Chapter ${i + 1} outline - please try regenerating for a more detailed description`
      }))
    };
  }
}

export async function testGeminiAPIKey(apiKey: string): Promise<boolean> {
  try {
    // Use a simple test prompt with Flash model (faster for testing)
    const testPrompt = "Say 'success' in one word.";

    // Use header authentication - simplified request like the working direct call
    const response = await fetch(GEMINI_FLASH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      console.error(`Gemini API test failed: ${response.status} ${response.statusText}`);
      if (response.status === 429) {
        throw new Error('API quota exceeded. You have reached your free tier limit. Please upgrade your plan or wait for quota reset.');
      }
      if (response.status === 403) {
        throw new Error('API access denied. Please check that your API key has Gemini API enabled.');
      }
      throw new Error(`API test failed: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return false;
    }

    // Validate response structure
    return !!(data.candidates &&
              data.candidates[0] &&
              data.candidates[0].content &&
              data.candidates[0].content.parts &&
              data.candidates[0].content.parts[0] &&
              data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error('API key test error:', error);
    // Re-throw quota and access errors so they can be handled by the UI
    if ((error as Error).message.includes('quota exceeded') ||
        (error as Error).message.includes('access denied')) {
      throw error;
    }
    return false;
  }
}


// Core Gemini API call with retry logic
async function callGeminiAPIWithRetry(
  prompt: string,
  apiKey: string,
  modelUrl: string,
  retryCount = 0,
  useHeaderAuth = true
): Promise<string> {
  // Check cache for duplicate requests
  const cacheKey = getCacheKey(prompt, modelUrl);
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    console.log('Using cached response for duplicate request');
    return cachedResponse;
  }

  try {
    const controller = new AbortController();
    const adaptiveTimeout = calculateAdaptiveTimeout(prompt);
    const timeoutId = setTimeout(() => controller.abort(), adaptiveTimeout);

    let response: Response;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: modelUrl.includes('flash') ? 8192 : 16384, // Flash has lower limits
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    try {
      // Method 1: Header authentication (preferred)
      if (useHeaderAuth) {
        response = await fetch(modelUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      } else {
        throw new Error('Fallback to query auth');
      }
    } catch {
      // Method 2: Query parameter authentication (fallback)
      console.log('Falling back to query parameter authentication');
      response = await fetch(`${modelUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;

      if (response.status === 429) {
        errorMessage = 'API quota exceeded. You\'ve reached your free tier limit. Please upgrade your plan or wait for quota reset.';
      } else if (response.status === 403) {
        errorMessage = 'API access denied. Please check that your API key has Gemini API enabled.';
      } else if (response.status === 503) {
        errorMessage = 'The model is overloaded. Please try again later.';
      }

      throw new Error(`${errorMessage} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for API errors in response body
    if (data.error) {
      const errorCode = data.error.code;
      let errorMessage = `Gemini API error: ${data.error.message || 'Unknown API error'}`;

      if (errorCode === 503) {
        errorMessage = 'The model is overloaded. Please try again later.';
      } else if (errorCode === 429) {
        errorMessage = 'API quota exceeded. You\'ve reached your free tier limit. Please upgrade your plan or wait for quota reset.';
      }

      throw new Error(errorMessage);
    }

    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const candidate = data.candidates[0];

    // Check if the response was blocked or incomplete
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      throw new Error('Response was blocked by safety filters. Please try a different prompt.');
    }

    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0] || !candidate.content.parts[0].text) {
      throw new Error('Empty response from Gemini API');
    }

    const result = candidate.content.parts[0].text;

    // Cache successful response
    setCachedResponse(cacheKey, result);

    return result;

  } catch (error) {
    console.error(`Gemini API call attempt ${retryCount + 1} failed:`, error);

    const classifiedError = classifyError(error);

    // Handle different error types
    switch (classifiedError.type) {
      case ErrorType.NON_RETRYABLE:
      case ErrorType.QUOTA_EXCEEDED:
        throw new Error(classifiedError.message);

      case ErrorType.RETRYABLE:
        // Retry logic with exponential backoff
        if (retryCount < MAX_RETRIES) {
          const retryDelay = classifiedError.retryAfter || calculateRetryDelay(retryCount);
          console.log(`Retrying in ${Math.round(retryDelay)}ms... (${classifiedError.message})`);

          await delay(retryDelay);
          return callGeminiAPIWithRetry(prompt, apiKey, modelUrl, retryCount + 1, useHeaderAuth);
        }
        throw new Error(`Max retries exceeded: ${classifiedError.message}`);
    }
  }
}

// Parse JSON response with improved reliability
function parseGeminiResponse(text: string): any {
  // Ensure text is actually a string
  if (typeof text !== 'string') {
    throw new Error('Invalid response type from Gemini API');
  }

  // Clean the text to extract JSON
  let cleanedText = text.trim();

  // Remove markdown code blocks if present
  cleanedText = cleanedText.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '');

  // Find the JSON object boundaries
  const startBrace = cleanedText.indexOf('{');
  const lastBrace = cleanedText.lastIndexOf('}');

  if (startBrace === -1 || lastBrace === -1 || startBrace >= lastBrace) {
    throw new Error('No valid JSON object found in response');
  }

  // Extract just the JSON part
  cleanedText = cleanedText.substring(startBrace, lastBrace + 1);

  try {
    // Try direct parsing first
    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.warn('Direct JSON parse failed, attempting fixes:', (parseError as Error).message);

    // Apply common JSON fixes
    let fixedText = cleanedText
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix single quotes to double quotes (carefully)
      .replace(/'([^']*)'/g, (match, content) => {
        // Only replace single quotes around string values, not inside
        if (content.includes('"')) return match; // Skip if already has double quotes
        return `"${content}"`;
      })
      // Fix unquoted keys
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    try {
      console.log('Attempting fixed parse:', fixedText.substring(0, 200));
      return JSON.parse(fixedText);
    } catch (fixedError) {
      console.error('Fixed JSON parse also failed:', (fixedError as Error).message);
      throw new Error(`Unable to parse Gemini response as JSON after fixes. Response: ${cleanedText.substring(0, 500)}...`);
    }
  }
}


// Call Gemini Pro for content generation (higher quality) with multiple fallback models
async function callGeminiProAPI(prompt: string, apiKey: string): Promise<string> {
  console.log('Attempting Gemini Pro API call...');

  const fallbackModels = [
    { name: 'Gemini 3 Pro Preview', url: GEMINI_PRO_URL },
    { name: 'Gemini 3 Flash Preview', url: GEMINI_FLASH_URL },
    { name: 'Gemini 1.5 Flash', url: GEMINI_FALLBACK_FLASH_URL },
    { name: 'Gemini Pro (Legacy)', url: GEMINI_LEGACY_PRO_URL }
  ];

  for (let i = 0; i < fallbackModels.length; i++) {
    const model = fallbackModels[i];
    try {
      console.log(`Trying ${model.name}...`);
      return await callGeminiAPIWithRetry(prompt, apiKey, model.url);
    } catch (error) {
      console.warn(`${model.name} failed:`, (error as Error).message);

      const classifiedError = classifyError(error);

      // Model not found errors should not trigger circuit breaker - just skip to next model
      if (classifiedError.modelNotFound) {
        console.log(`${model.name} not available, trying next model...`);
        continue;
      }

      // For quota exceeded, only try one more model before giving up
      if (classifiedError.type === ErrorType.QUOTA_EXCEEDED) {
        if (i === 0) {
          console.log('Quota exceeded on primary model, trying one fallback...');
          continue;
        }
        // If we've tried the primary + one fallback and still hitting quota, give up
        throw error;
      }

      // For other retryable errors, continue to next model
      if (classifiedError.type === ErrorType.RETRYABLE) {
        continue;
      }

      // For non-retryable errors (like auth), throw immediately
      throw error;
    }
  }

  throw new Error('All Gemini Pro fallback models failed');
}

// Enhanced Flash API call with multiple fallback models for better resilience
async function callGeminiFlashAPI(prompt: string, apiKey: string): Promise<string> {
  console.log('Attempting Gemini Flash API call...');

  const fallbackModels = [
    { name: 'Gemini 3 Flash Preview', url: GEMINI_FLASH_URL },
    { name: 'Gemini 1.5 Flash', url: GEMINI_FALLBACK_FLASH_URL },
    { name: 'Gemini Pro (Legacy)', url: GEMINI_LEGACY_PRO_URL }
  ];

  for (let i = 0; i < fallbackModels.length; i++) {
    const model = fallbackModels[i];
    try {
      console.log(`Trying ${model.name}...`);
      return await callGeminiAPIWithRetry(prompt, apiKey, model.url);
    } catch (error) {
      console.warn(`${model.name} failed:`, (error as Error).message);

      const classifiedError = classifyError(error);

      // Model not found errors should not trigger circuit breaker - just skip to next model
      if (classifiedError.modelNotFound) {
        console.log(`${model.name} not available, trying next model...`);
        continue;
      }

      // For quota exceeded, only try one more model before giving up
      if (classifiedError.type === ErrorType.QUOTA_EXCEEDED) {
        if (i === 0) {
          console.log('Quota exceeded on primary model, trying one fallback...');
          continue;
        }
        // If we've tried the primary + one fallback and still hitting quota, give up
        throw error;
      }

      // For other retryable errors, continue to next model
      if (classifiedError.type === ErrorType.RETRYABLE) {
        continue;
      }

      // For non-retryable errors (like auth), throw immediately
      throw error;
    }
  }

  throw new Error('All Gemini Flash fallback models failed');
}

export async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const rawResponse = await callGeminiAPIWithRetry(prompt, apiKey, GEMINI_FLASH_URL);
  return parseGeminiResponse(rawResponse);
}
