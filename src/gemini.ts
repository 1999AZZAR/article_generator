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

Return ONLY a valid JSON object in this exact format:
{
  "refinedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "titleSelection": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "subtitleSelection": ["Subtitle Option 1", "Subtitle Option 2", "Subtitle Option 3"],
  "content": "Write the complete 1500-2000 word article here with extensive sections, detailed analysis, comprehensive coverage, and academic depth."
}

IMPORTANT: Return only the JSON object, no additional text or formatting. The content must be substantial, detailed, and comprehensive.`;

  try {
    const response = await callGeminiProAPI(prompt, apiKey);
    const parsed = parseGeminiResponse(response) as ArticleResponse;

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

export async function generateNovelOutline(request: GenerateRequest, apiKey: string): Promise<NovelResponse> {
  const language = request.language === 'indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';
  const chapterCount = request.chapterCount || 10;

  const prompt = `You are a creative novelist. Create a novel outline in ${language} about "${request.topic}" in the style of ${request.authorStyle}.

${request.tags ? `Include these themes: ${request.tags.join(', ')}` : ''}
${request.keywords ? `Incorporate these elements: ${request.keywords.join(', ')}` : ''}
${request.mainIdea ? `Build upon this main idea/concept: ${request.mainIdea}` : ''}

Create an outline for exactly ${chapterCount} chapters.

Return ONLY a valid JSON object in this exact format:
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

IMPORTANT: Return only the JSON object, no additional text or formatting. Ensure the outline has exactly ${chapterCount} chapters.`;

  try {
    const response = await callGeminiProAPI(prompt, apiKey);
    const parsed = parseGeminiResponse(response) as NovelResponse;

    // Validate the response structure
    if (!parsed.titleSelection || !parsed.synopsis || !parsed.outline || !Array.isArray(parsed.outline)) {
      console.warn('Invalid response structure from Gemini Pro, using fallback');
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

  // Clean the text first
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
    console.error('JSON parse error:', parseError);

    // Try alternative cleaning approaches
    const attempts = [
      // Remove markdown code blocks completely
      text.replace(/```[\s\S]*?```/g, '').trim(),
      // Extract between first { and last }
      text.replace(/^[^{]*/, '').replace(/[^}]*$/, ''),
      // Look for JSON-like patterns
      text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)?.[0],
    ];

    for (const attempt of attempts) {
      if (attempt) {
        try {
          console.log('Trying alternative parse:', attempt.substring(0, 100));
          return JSON.parse(attempt);
        } catch {
          continue;
        }
      }
    }

    // If all attempts fail, return a basic fallback structure
    console.error('All JSON parsing attempts failed, returning fallback');
    throw new Error(`Unable to parse Gemini response as JSON. Response: ${text.substring(0, 300)}...`);
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
