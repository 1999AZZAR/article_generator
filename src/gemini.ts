import type { GenerateRequest, ArticleResponse, NovelResponse } from './handler';

// Gemini API endpoints - use Flash for testing (faster/cheaper), Pro for content generation
const GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

export async function generateArticle(request: GenerateRequest, apiKey: string): Promise<ArticleResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';

  const prompt = `You are a professional writer. Create a comprehensive, in-depth article of at least 1500-2000 words in ${language} about "${request.topic}" in the writing style of ${request.authorStyle}.

${request.tags ? `Include these themes and tags: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Incorporate these keywords naturally throughout: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Build upon this main idea/concept: ${request.mainIdea}` : ''}

Make the article thorough and detailed with:
- Comprehensive introduction with historical/technical background
- Multiple detailed main sections (at least 4-5 sections)
- In-depth analysis with examples and case studies
- Practical applications and real-world implications
- Research-based insights and data where applicable
- Detailed conclusion with future outlook and recommendations
- Extensive coverage of subtopics and related concepts

The article should be academic/research-quality with substantial depth and comprehensive coverage of the topic.

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):

{
  "refinedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "titleSelection": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "subtitleSelection": ["Subtitle Option 1", "Subtitle Option 2", "Subtitle Option 3"],
  "content": "Write the complete 1500-2000 word article here with extensive sections, detailed analysis, comprehensive coverage, and academic depth."
}

CRITICAL REQUIREMENTS:
- Return ONLY the JSON object, nothing else
- Do not wrap in markdown code blocks (no \`\`\`json or \`\`\`)
- Do not add any explanatory text before or after
- Ensure all strings are properly quoted with double quotes
- Do not use trailing commas
- Make sure the JSON is valid and parseable`;

  try {
    const response = await callGeminiProAPI(prompt, apiKey);
    console.log('Gemini API response for article (first 500 chars):', response.substring(0, 500));

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
}, apiKey: string): Promise<string> {
  const prompt = `Write a detailed chapter for the novel "${chapter.novelTitle}".

Novel Synopsis: ${chapter.novelSynopsis}

Chapter ${chapter.chapterNumber}: "${chapter.chapterTitle}"
Chapter Description: ${chapter.chapterSubtitle}

Write a comprehensive chapter of 2000-3000 words that:
- Advances the plot in a meaningful way
- Develops characters and relationships
- Includes vivid descriptions and dialogue
- Maintains consistency with the novel's tone and style
- Builds tension or provides important revelations
- Ends in a way that leads naturally to the next chapter

Focus on this specific chapter's events, character development, and plot progression. Make it engaging and well-written.

Return only the chapter content without any JSON formatting or additional text.`;

  try {
    const response = await callGeminiProAPI(prompt, apiKey);

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
  const mainIdeaText = request.mainIdea ? `\n\nBuild upon this main idea/concept: ${request.mainIdea}` : '';

  const prompt = `You are a masterful storyteller. Create a complete short story in ${language} about "${request.topic}" in the writing style of ${request.authorStyle}.${request.tags ? `\n\nIncorporate these themes: ${request.tags.join(', ')}` : ''}${request.keywords ? `\n\nInclude these elements: ${request.keywords.join(', ')}` : ''}${mainIdeaText}

Write a comprehensive short story of at least 2250-3000 words that includes:
- A compelling beginning that hooks the reader
- Well-developed characters with depth and motivation
- Rich setting descriptions that enhance the atmosphere
- A clear conflict that drives the narrative
- Rising action with increasing tension
- A satisfying climax and resolution
- Meaningful themes and character development
- Natural dialogue that reveals character and advances plot
- Sensory details that bring the story to life

The story should have a complete narrative arc with a beginning, middle, and end. Focus on emotional impact and character transformation.

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):

{
  "refinedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "titleSelection": ["First Story Title", "Second Story Title", "Third Story Title"],
  "subtitleSelection": ["Subtitle Option 1", "Subtitle Option 2", "Subtitle Option 3"],
  "content": "Write the complete 2250-3000 word short story here with rich descriptions, character development, and emotional depth."
}

CRITICAL REQUIREMENTS:
- Return ONLY the JSON object, nothing else
- Do not wrap in markdown code blocks (no \`\`\`json or \`\`\`)
- Do not add any explanatory text before or after
- Ensure all strings are properly quoted with double quotes
- Do not use trailing commas
- Make sure the JSON is valid and parseable`;

  try {
    const response = await callGeminiProAPI(prompt, apiKey);
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

export async function generateNovelOutline(request: GenerateRequest, apiKey: string): Promise<NovelResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';
  const chapterCount = request.chapterCount || 10;

  const prompt = `You are a creative novelist. Create a novel outline in ${language} about "${request.topic}" in the style of ${request.authorStyle}.

${request.tags ? `Include these themes: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Incorporate these elements: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Build upon this main idea/concept: ${request.mainIdea}` : ''}

Create an outline for exactly ${chapterCount} chapters.

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):

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

CRITICAL REQUIREMENTS:
- Return ONLY the JSON object, nothing else
- Do not wrap in markdown code blocks (no \`\`\`json or \`\`\`)
- Do not add any explanatory text before or after
- Ensure all strings are properly quoted with double quotes
- Do not use trailing commas
- Ensure the outline array has exactly ${chapterCount} chapters
- Make sure the JSON is valid and parseable`;

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

// Utility function for delays
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Core Gemini API call with retry logic
async function callGeminiAPIWithRetry(prompt: string, apiKey: string, retryCount = 0): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response: Response;

    try {
      // Method 1: Header authentication (preferred)
      response = await fetch(GEMINI_FLASH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384, // Increased for longer content generation,
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
        }),
        signal: controller.signal
      });
    } catch {
      // Method 2: Query parameter authentication (fallback)
      response = await fetch(`${GEMINI_FLASH_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384, // Increased for longer content generation,
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
        }),
        signal: controller.signal
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      if (response.status === 429) {
        throw new Error(`API quota exceeded. You've reached your free tier limit. Please upgrade your plan or wait for quota reset.`);
      }
      if (response.status === 403) {
        throw new Error(`API access denied. Please check that your API key has Gemini API enabled.`);
      }
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for API errors
    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message || 'Unknown API error'}`);
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

    return candidate.content.parts[0].text;

  } catch (error) {
    console.error(`Gemini API call attempt ${retryCount + 1} failed:`, error);

    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return callGeminiAPIWithRetry(prompt, apiKey, retryCount + 1);
    }

    throw error;
  }
}

// Parse JSON response with better error handling
function parseGeminiResponse(text: string): any {
  // Ensure text is actually a string
  if (typeof text !== 'string') {
    throw new Error('Invalid response type from Gemini API');
  }

  // Clean the text first - remove markdown and extract JSON
  let cleanedText = text
    .trim()
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/gi, '')
    .replace(/^[\s\S]*?(\{)/, '$1')  // Remove everything before first {
    .replace(/\}[\s\S]*$/, '}');     // Remove everything after last }

  try {
    // Try to parse the cleaned text
    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error('Initial JSON parse error:', parseError);

    // Try more aggressive cleaning approaches
    const attempts = [
      // Remove markdown code blocks completely
      text.replace(/```[\s\S]*?```/g, '').trim(),
      // Extract between first { and last }
      text.replace(/^[^{]*/, '').replace(/[^}]*$/, ''),
      // Look for JSON-like patterns with better regex
      text.match(/\{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*\}/)?.[0],
    ];

    for (const attempt of attempts) {
      if (attempt) {
        try {
          // Clean up common JSON issues
          let fixedAttempt = attempt
            // Fix trailing commas in arrays
            .replace(/,(\s*[}\]])/g, '$1')
            // Fix trailing commas in objects
            .replace(/,(\s*})/g, '$1')
            // Fix unquoted keys (basic fix)
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            // Fix single quotes to double quotes
            .replace(/'/g, '"')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            .trim();

          console.log('Trying alternative parse:', fixedAttempt.substring(0, 200));
          return JSON.parse(fixedAttempt);
        } catch (attemptError) {
          console.log('Attempt failed:', (attemptError as Error).message);
          continue;
        }
      }
    }

    // Try to extract and fix JSON manually
    try {
      const manualFix = fixMalformedJSON(text);
      if (manualFix) {
        console.log('Using manual JSON fix');
        return JSON.parse(manualFix);
      }
    } catch (manualError) {
      console.log('Manual fix failed:', (manualError as Error).message);
    }

    // If all attempts fail, return a basic fallback structure
    console.error('All JSON parsing attempts failed, returning fallback');
    throw new Error(`Unable to parse Gemini response as JSON. Original error: ${(parseError as Error).message}. Response start: ${text.substring(0, 500)}...`);
  }
}

// Helper function to fix common JSON malformations
function fixMalformedJSON(text: string): string | null {
  try {
    // Remove everything outside JSON boundaries
    const startIndex = text.indexOf('{');
    const lastEndIndex = text.lastIndexOf('}');

    if (startIndex === -1 || lastEndIndex === -1 || startIndex >= lastEndIndex) {
      return null;
    }

    let jsonText = text.substring(startIndex, lastEndIndex + 1);

    // Fix common issues step by step
    jsonText = jsonText
      // Fix trailing commas before closing brackets
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix trailing commas before closing braces
      .replace(/,(\s*})/g, '$1')
      // Fix unquoted object keys (simple cases)
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Convert single quotes to double quotes (carefully)
      .replace(/'([^']*)'/g, '"$1"')
      // Fix missing quotes around string values
      .replace(/:\s*([a-zA-Z][^,}\]]*)/g, ': "$1"')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Validate basic structure
    const openBraces = (jsonText.match(/\{/g) || []).length;
    const closeBraces = (jsonText.match(/\}/g) || []).length;
    const openBrackets = (jsonText.match(/\[/g) || []).length;
    const closeBrackets = (jsonText.match(/\]/g) || []).length;

    if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
      console.log('JSON structure validation failed - mismatched brackets');
      return null;
    }

    return jsonText;
  } catch (error) {
    console.log('JSON fixing failed:', error);
    return null;
  }
}

// Call Gemini Pro for content generation (higher quality)
async function callGeminiProAPI(prompt: string, apiKey: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout for Pro (longer content)

    let response: Response;

    try {
      // Method 1: Header authentication (preferred)
      response = await fetch(GEMINI_PRO_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384, // Increased for longer content generation
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
        }),
        signal: controller.signal
      });
    } catch {
      // Method 2: Query parameter authentication (fallback)
      response = await fetch(`${GEMINI_PRO_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384, // Increased for longer content generation,
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
        }),
        signal: controller.signal
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      if (response.status === 429) {
        throw new Error(`API quota exceeded. You've reached your free tier limit. Please upgrade your plan or wait for quota reset.`);
      }
      if (response.status === 403) {
        throw new Error(`API access denied. Please check that your API key has Gemini API enabled.`);
      }
      throw new Error(`Gemini Pro API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for API errors
    if (data.error) {
      throw new Error(`Gemini Pro API error: ${data.error.message || 'Unknown API error'}`);
    }

    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini Pro API');
    }

    const candidate = data.candidates[0];

    // Check if the response was blocked or incomplete
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      throw new Error('Response was blocked by safety filters. Please try a different prompt.');
    }

    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0] || !candidate.content.parts[0].text) {
      throw new Error('Empty response from Gemini Pro API');
    }

    return candidate.content.parts[0].text;

  } catch (error) {
    console.error('Gemini Pro API call failed:', error);
    // If Pro fails, try Flash as fallback
    try {
      console.log('Falling back to Gemini Flash...');
      return await callGeminiAPIWithRetry(prompt, apiKey);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error; // Throw original error
    }
  }
}

export async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const rawResponse = await callGeminiAPIWithRetry(prompt, apiKey);
  return parseGeminiResponse(rawResponse);
}
