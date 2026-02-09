import { generateArticle, generateNovelOutline, generateShortStory, generateNews, generateShortNews, callGeminiAPI, testGeminiAPIKey, generateChapterContent } from './gemini';
import { generateMainPageHTML, generateSettingsPageHTML } from './ui';

export interface GenerateRequest {
  topic: string;
  tags?: string[];
  keywords?: string[];
  authorStyle: string;
  type: 'article' | 'shortstory' | 'novel' | 'news' | 'shortnews';
  newspaperStyle?: string;
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
        previousChapters?: Array<{
          chapterNumber: number;
          title: string;
          content: string;
          keyEvents?: string[];
        }>;
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
        novelSynopsis: body.novelSynopsis,
        previousChapters: body.previousChapters
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

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/export-chapter-rtf') {
    try {
      const body: {
        chapterNumber: number;
        chapterTitle: string;
        chapterSubtitle: string;
        content: string;
      } = await request.json();

      if (!body.chapterTitle || !body.content) {
        return new Response(JSON.stringify({ error: 'Chapter title and content are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const rtfContent = generateChapterRTF(body.chapterNumber, body.chapterTitle, body.chapterSubtitle, body.content);

      const filename = `${body.chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chapter_${body.chapterNumber}.rtf`;

      return new Response(rtfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Chapter RTF export error:', error);
      return new Response(JSON.stringify({ error: 'Chapter RTF export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/export-rtf') {
    try {
      const body: {
        title: string;
        subtitle?: string;
        content: string;
      } = await request.json();

      if (!body.title || !body.content) {
        return new Response(JSON.stringify({ error: 'Title and content are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const rtfContent = generateRTF(body.title, body.subtitle || '', body.content);

      return new Response(rtfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${body.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.rtf"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('RTF export error:', error);
      return new Response(JSON.stringify({ error: 'RTF export failed' }), {
        status: 500,
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
      } else if (body.type === 'shortnews') {
        result = await generateShortNews(body, apiKey);
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

function generateChapterRTF(chapterNumber: number, chapterTitle: string, chapterSubtitle: string, content: string): string {
  // RTF header with basic formatting
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red128\\green128\\blue128;}
\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs24
`;

  // Add chapter header (large, bold, centered)
  rtf += `\\qc\\b\\fs36 Chapter ${chapterNumber}: ${escapeRTF(chapterTitle)}\\par\\par
`;

  // Add chapter subtitle if provided (smaller, italic, centered)
  if (chapterSubtitle) {
    rtf += `\\qc\\i\\fs28 ${escapeRTF(chapterSubtitle)}\\par\\par
`;
  }

  // Add separator line
  rtf += `\\qc\\fs24 * * *\\par\\par
`;

  // Reset formatting and add content
  rtf += `\\pard\\b0\\i0\\fs24
`;

  // Process content line by line
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      rtf += '\\par\n';
      continue;
    }

    // Handle markdown-style headers
    if (line.startsWith('# ')) {
      rtf += `\\b\\fs32 ${escapeRTF(line.substring(2))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('## ')) {
      rtf += `\\b\\fs28 ${escapeRTF(line.substring(3))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('### ')) {
      rtf += `\\b\\fs26 ${escapeRTF(line.substring(4))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Handle bullet points
      rtf += `\\bullet ${escapeRTF(line.substring(2))}\\par
`;
    } else if (/^\d+\./.test(line)) {
      // Handle numbered lists
      const match = line.match(/^(\d+)\.\s*(.*)$/);
      if (match) {
        rtf += `${match[1]}. ${escapeRTF(match[2])}\\par
`;
      } else {
        rtf += `${escapeRTF(line)}\\par
`;
      }
    } else {
      // Regular paragraph
      rtf += `${escapeRTF(line)}\\par
`;
    }
  }

  // Add page break and chapter end marker
  rtf += `\\par\\page
\\qc\\fs20 Chapter ${chapterNumber} - End\\par
`;

  // Close RTF document
  rtf += '}';

  return rtf;
}

function generateRTF(title: string, subtitle: string, content: string): string {
  // RTF header with basic formatting
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red128\\green128\\blue128;}
\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs24
`;

  // Add title (large, bold, centered)
  rtf += `\\qc\\b\\fs36 ${escapeRTF(title)}\\par\\par
`;

  // Add subtitle if provided (smaller, italic, centered)
  if (subtitle) {
    rtf += `\\qc\\i\\fs28 ${escapeRTF(subtitle)}\\par\\par
`;
  }

  // Reset formatting and add content
  rtf += `\\pard\\b0\\i0\\fs24
`;

  // Process content line by line
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      rtf += '\\par\n';
      continue;
    }

    // Handle markdown-style headers
    if (line.startsWith('# ')) {
      rtf += `\\b\\fs32 ${escapeRTF(line.substring(2))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('## ')) {
      rtf += `\\b\\fs28 ${escapeRTF(line.substring(3))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('### ')) {
      rtf += `\\b\\fs26 ${escapeRTF(line.substring(4))}\\par
\\b0\\fs24\\par
`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Handle bullet points
      rtf += `\\bullet ${escapeRTF(line.substring(2))}\\par
`;
    } else if (/^\d+\./.test(line)) {
      // Handle numbered lists
      const match = line.match(/^(\d+)\.\s*(.*)$/);
      if (match) {
        rtf += `${match[1]}. ${escapeRTF(match[2])}\\par
`;
      } else {
        rtf += `${escapeRTF(line)}\\par
`;
      }
    } else {
      // Regular paragraph
      rtf += `${escapeRTF(line)}\\par
`;
    }
  }

  // Close RTF document
  rtf += '}';

  return rtf;
}

function escapeRTF(text: string): string {
  // Escape RTF special characters
  return text
    .replace(/\\/g, '\\\\')     // Backslash
    .replace(/\{/g, '\\{')      // Left brace
    .replace(/\}/g, '\\}')      // Right brace
    .replace(/\n/g, '\\par ')   // Newlines
    .replace(/\t/g, '\\tab ')   // Tabs
    .replace(/\u00A0/g, ' ')    // Non-breaking space
    .replace(/\u2013/g, '-')    // En dash
    .replace(/\u2014/g, '--')   // Em dash
    .replace(/\u2018/g, "'")    // Left single quote
    .replace(/\u2019/g, "'")    // Right single quote
    .replace(/\u201C/g, '"')    // Left double quote
    .replace(/\u201D/g, '"')    // Right double quote
    .replace(/\u2026/g, '...'); // Ellipsis
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
