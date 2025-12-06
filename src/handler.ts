import { generateArticle, generateNovelOutline, generateShortStory, generateNews, callGeminiAPI, testGeminiAPIKey, generateChapterContent } from './gemini';
import { generateMainPageHTML, generateSettingsPageHTML } from './ui';

export interface GenerateRequest {
  topic: string;
  tags?: string[];
  keywords?: string[];
  authorStyle: string;
  type: 'article' | 'shortstory' | 'novel' | 'news';
  chapterCount?: number;
  language: 'english' | 'indonesian';
  mainIdea?: string;
  apiKey?: string;
}

export interface ArticleResponse {
  refinedTags: string[];
  titleSelection: string[];
  subtitleSelection: string[];
  content: string;
}

export interface NovelResponse {
  titleSelection: string[];
  synopsis: string;
  outline: Array<{
    chapterNumber: number;
    title: string;
    subtitle: string;
  }>;
}


export async function handleRequest(request: Request, env: { GEMINI_API_KEY: string }): Promise<Response> {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Serve static files
  if (request.method === 'GET' && new URL(request.url).pathname !== '/api/generate') {
    return serveStatic(request);
  }

  // Handle API requests
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/generate-chapter') {
    try {
      const body: {
        chapterNumber: number;
        chapterTitle: string;
        chapterSubtitle: string;
        novelTitle: string;
        novelSynopsis: string;
        apiKey?: string;
      } = await request.json();

      const apiKey = body.apiKey || env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const chapterContent = await generateChapterContent({
        chapterNumber: body.chapterNumber,
        chapterTitle: body.chapterTitle,
        chapterSubtitle: body.chapterSubtitle,
        novelTitle: body.novelTitle,
        novelSynopsis: body.novelSynopsis
      }, apiKey);

      return new Response(JSON.stringify({ content: chapterContent }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (error) {
      console.error('Chapter generation error:', error);
      return new Response(JSON.stringify({
        error: 'Chapter generation failed',
        details: (error as Error).message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }



  if (request.method === 'POST' && new URL(request.url).pathname === '/api/test-key') {
    try {
      const body: { apiKey: string } = await request.json();

      if (!body.apiKey) {
        return new Response(JSON.stringify({ error: 'API key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Test the API key with a simple request
      try {
        const isValid = await testGeminiAPIKey(body.apiKey);

        if (!isValid) {
          return new Response(JSON.stringify({
            error: 'Invalid API key or API access denied',
            details: 'Please check that your API key is correct and has access to Gemini API'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      } catch (testError) {
        return new Response(JSON.stringify({
          error: 'API key test failed',
          details: (testError as Error).message
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'API key is valid' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (error) {
      console.error('API key test error:', error);
      return new Response(JSON.stringify({
        error: (error as Error).message || 'Invalid API key',
        details: 'Check that your API key is valid and has the correct permissions for Gemini API'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/generate') {
    try {
      const body: GenerateRequest = await request.json();

      // Validate required fields
      if (!body.topic || !body.authorStyle || !body.type || !body.language) {
        return new Response(JSON.stringify({ error: 'Missing required fields: topic, authorStyle, type, language' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      if (body.type === 'novel' && !body.chapterCount) {
        return new Response(JSON.stringify({ error: 'chapterCount is required for novel type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const apiKey = body.apiKey || env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API key is required. Please set it in settings or environment.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      let result;
      if (body.type === 'article') {
        result = await generateArticle(body, apiKey);
      } else if (body.type === 'shortstory') {
        result = await generateShortStory(body, apiKey);
      } else if (body.type === 'news') {
        result = await generateNews(body, apiKey);
      } else {
        result = await generateNovelOutline(body, apiKey);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}

async function serveStatic(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    const htmlContent = generateMainPageHTML();
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (pathname === '/settings') {
    const htmlContent = generateSettingsPageHTML();
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response('File not found', { status: 404 });
}
