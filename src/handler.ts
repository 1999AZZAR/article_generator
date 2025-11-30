import { generateArticle, generateNovelOutline, generateShortStory, callGeminiAPI, testGeminiAPIKey, generateChapterContent } from './gemini';

export interface GenerateRequest {
  topic: string;
  tags?: string[];
  keywords?: string[];
  authorStyle: string;
  type: 'article' | 'shortstory' | 'novel';
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

// Create a simple RTF (Rich Text Format) file that can be opened by Word
function createSimpleRtf(title: string, subtitle: string, content: string): Uint8Array {
  // Escape RTF special characters
  const escapeRtf = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\n/g, '\\par ')
      .replace(/\t/g, '\\tab ');
  };

  const titleRtf = escapeRtf(title);
  const subtitleRtf = subtitle ? escapeRtf(subtitle) : '';
  const contentRtf = escapeRtf(content);

  // Create RTF content with formatting
  const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\margl1440\\margr1440\\margt1440\\margb1440
\\pard\\qc\\f0\\fs36\\b ${titleRtf}\\par
${subtitle ? `\\pard\\qc\\f0\\fs24\\i ${subtitleRtf}\\par\\par` : '\\par'}
\\pard\\f0\\fs22 ${contentRtf}
}`;

  const encoder = new TextEncoder();
  return encoder.encode(rtfContent);
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

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/export-chapter') {
    try {
      const body: {
        chapterNumber: number;
        chapterTitle: string;
        chapterSubtitle: string;
        content: string;
      } = await request.json();

      const { chapterNumber, chapterTitle, chapterSubtitle, content } = body;

      if (!chapterTitle || !content) {
        return new Response(JSON.stringify({ error: 'Chapter title and content are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Create RTF content for the chapter
      const chapterRtfContent = createSimpleRtf(
        `Chapter ${chapterNumber}: ${chapterTitle}`,
        chapterSubtitle,
        content
      );

      return new Response(chapterRtfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chapter_${chapterNumber}.rtf"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Chapter export error:', error);
      return new Response(JSON.stringify({ error: 'Chapter export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/api/export-docx') {
    try {
      const body: { title: string; subtitle?: string; content: string } = await request.json();
      const { title, subtitle, content } = body;

      if (!title || !content) {
        return new Response(JSON.stringify({ error: 'Title and content are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Create an RTF file that can be opened by Microsoft Word and other word processors
      const rtfContent = createSimpleRtf(title, subtitle || '', content);

      return new Response(rtfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.rtf"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('DOCX export error:', error);
      return new Response(JSON.stringify({ error: 'Export failed' }), {
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
    // Read the HTML file content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill - AI Writing Assistant</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 300;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.8;
        }

        /* Mobile responsiveness improvements */
        @media (max-width: 768px) {
            body {
                padding: 15px;
            }

            .header {
                margin-bottom: 30px;
            }

            .header h1 {
                font-size: 2.2rem;
            }

            .header p {
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            body {
                padding: 10px;
            }

            .header h1 {
                font-size: 1.8rem;
            }

            .header p {
                font-size: 0.9rem;
            }
        }

        .settings-link {
            position: absolute;
            top: 0;
            right: 0;
            color: #00d4ff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .settings-link:hover {
            background: rgba(0, 212, 255, 0.1);
        }

        .form-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        /* Responsive form improvements */
        @media (max-width: 768px) {
            .form-container {
                padding: 20px;
                border-radius: 15px;
            }

            .form-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }

        @media (max-width: 480px) {
            .form-container {
                padding: 15px;
                margin-bottom: 20px;
            }

            .form-grid {
                gap: 12px;
            }
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #00d4ff;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .tag-input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .tag-input {
            flex: 1;
        }

        .add-tag-btn {
            padding: 12px 16px;
            background: rgba(0, 212, 255, 0.2);
            border: 1px solid #00d4ff;
            border-radius: 8px;
            color: #00d4ff;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .add-tag-btn:hover {
            background: rgba(0, 212, 255, 0.3);
        }

        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .tag {
            background: rgba(0, 212, 255, 0.2);
            border: 1px solid #00d4ff;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tag-remove {
            cursor: pointer;
            color: #ff6b6b;
            font-weight: bold;
        }

        .generate-btn {
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #0f0f0f;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 20px;
        }

        .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
        }

        .generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        /* Mobile button improvements */
        @media (max-width: 480px) {
            .generate-btn {
                padding: 14px 24px;
                font-size: 15px;
                margin-top: 15px;
            }
        }

        .loading {
            display: none;
            text-align: center;
            margin: 20px 0;
        }

        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left: 4px solid #00d4ff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .result-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: none;
        }

        /* Mobile result container improvements */
        @media (max-width: 768px) {
            .result-container {
                padding: 20px;
                border-radius: 15px;
            }
        }

        @media (max-width: 480px) {
            .result-container {
                padding: 15px;
            }
        }

        .result-section {
            margin-bottom: 30px;
        }

        .result-section h3 {
            color: #00ff88;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .export-section {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .export-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        /* Mobile export controls improvements */
        @media (max-width: 768px) {
            .export-controls {
                grid-template-columns: 1fr;
                gap: 12px;
            }
        }

        .export-select {
            width: 100%;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 14px;
        }

        .export-select:focus {
            outline: none;
            border-color: #00d4ff;
        }

        .export-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .export-btn {
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #0f0f0f;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .export-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        .export-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .title-options, .subtitle-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        /* Mobile title/subtitle options improvements */
        @media (max-width: 768px) {
            .title-options, .subtitle-options {
                grid-template-columns: 1fr;
                gap: 12px;
            }
        }

        .option-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .option-card:hover {
            border-color: #00d4ff;
            transform: translateY(-2px);
        }

        .option-card.selected {
            border-color: #00ff88;
            background: rgba(0, 255, 136, 0.1);
        }

        .option-title {
            font-weight: 600;
            margin-bottom: 5px;
        }

        .content-display {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 20px;
            white-space: pre-wrap;
            line-height: 1.6;
            font-family: 'Georgia', serif;
        }

        .chapter-outline {
            display: grid;
            gap: 15px;
        }

        .chapter-item {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 15px;
            border-left: 4px solid #00d4ff;
        }

        .chapter-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 5px 0;
            margin-bottom: 10px;
        }

        .chapter-title-section {
            flex: 1;
        }

        .chapter-number {
            color: #00d4ff;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .chapter-toggle {
            color: #00d4ff;
            font-size: 18px;
            font-weight: bold;
            transition: transform 0.3s ease;
            margin-left: 10px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.1);
        }

        .chapter-toggle.collapsed {
            transform: rotate(0deg);
        }

        .chapter-toggle.expanded {
            transform: rotate(90deg);
        }

        .chapter-content-section {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .chapter-content-section.expanded {
            max-height: 2000px; /* Large enough for long content */
        }

        .chapter-details {
            margin-bottom: 15px;
        }

        /* Mobile chapter improvements */
        @media (max-width: 768px) {
            .chapter-item {
                padding: 12px;
            }

            .chapter-header {
                padding: 3px 0;
            }

            .chapter-toggle {
                font-size: 16px;
                width: 20px;
                height: 20px;
            }
        }

        @media (max-width: 480px) {
            .chapter-outline {
                gap: 12px;
            }

            .chapter-item {
                padding: 10px;
            }

            .chapter-header {
                padding: 2px 0;
                margin-bottom: 8px;
            }

            .chapter-toggle {
                font-size: 14px;
                width: 18px;
                height: 18px;
                margin-left: 5px;
            }
        }

        .chapter-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .generate-chapter-btn {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            color: #0f0f0f;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .generate-chapter-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        .generate-chapter-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .export-chapter-btn {
            background: linear-gradient(45deg, #ff6b6b, #ffa500);
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .export-chapter-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .chapter-loading {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            color: #00ff88;
            font-size: 12px;
        }

        .chapter-content {
            margin-top: 15px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            border-left: 3px solid #00ff88;
            white-space: pre-wrap;
            line-height: 1.6;
            font-size: 14px;
        }

        .error-message {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            border-radius: 12px;
            padding: 15px;
            color: #ff6b6b;
            display: none;
        }

        .hidden {
            display: none !important;
        }

        .chapter-count-group {
            display: none;
        }

        .chapter-count-group.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="/settings" class="settings-link">⚙️ Settings</a>
            <h1><a href="https://azzar.netlify.app" target="_blank" style="color: inherit; text-decoration: none;">Quill™</a></h1>
            <p>AI-powered writing assistant for articles and novels</p>
        </div>

        <form class="form-container" id="articleForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="topic">Topic *</label>
                    <input type="text" id="topic" name="topic" required placeholder="e.g. romance, horror, philosophy">
                </div>

                <div class="form-group">
                    <label for="authorStyle">Author Style to Copy *</label>
                    <select id="authorStyle" name="authorStyle" required>
                        <option value="">Select an author</option>
                        <option value="J.K. Rowling">J.K. Rowling</option>
                        <option value="George R.R. Martin">George R.R. Martin</option>
                        <option value="Jane Austen">Jane Austen</option>
                        <option value="Ernest Hemingway">Ernest Hemingway</option>
                        <option value="Toni Morrison">Toni Morrison</option>
                        <option value="Haruki Murakami">Haruki Murakami</option>
                        <option value="Margaret Atwood">Margaret Atwood</option>
                        <option value="Neil Gaiman">Neil Gaiman</option>
                        <option value="Chimamanda Ngozi Adichie">Chimamanda Ngozi Adichie</option>
                        <option value="Cormac McCarthy">Cormac McCarthy</option>
                        <option value="Dee Lestari">Dee Lestari</option>
                        <option value="Najwa Shihab">Najwa Shihab</option>
                        <option value="Pramoedya Ananta Toer">Pramoedya Ananta Toer</option>
                        <option value="Goenawan Mohamad">Goenawan Mohamad</option>
                        <option value="Leila S. Chudori">Leila S. Chudori</option>
                        <option value="custom">Custom (enter below)</option>
                    </select>
                    <input type="text" id="customAuthorStyle" name="customAuthorStyle" placeholder="Enter custom author style" style="margin-top: 10px; display: none;">
                </div>

                <div class="form-group">
                    <label for="type">Type *</label>
                    <select id="type" name="type" required>
                        <option value="">Select type</option>
                        <option value="article">Article/Chapter</option>
                        <option value="shortstory">Short Story/Cerpen</option>
                        <option value="novel">Novel Outline</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="language">Language *</label>
                    <select id="language" name="language" required>
                        <option value="">Select language</option>
                        <option value="english">English</option>
                        <option value="indonesian">Indonesian (Bahasa Indonesia)</option>
                    </select>
                </div>

                <div class="form-group chapter-count-group" id="chapterCountGroup">
                    <label for="chapterCount">Number of Chapters *</label>
                    <input type="number" id="chapterCount" name="chapterCount" min="1" max="50" placeholder="e.g. 10">
                </div>

                <div class="form-group">
                    <label for="tags">Tags</label>
                    <div class="tag-input-container">
                        <input type="text" id="tagInput" placeholder="Add a tag and press Enter">
                        <button type="button" class="add-tag-btn" id="addTagBtn">Add</button>
                    </div>
                    <div class="tags-container" id="tagsContainer"></div>
                </div>

                <div class="form-group">
                    <label for="keywords">Keywords</label>
                    <div class="tag-input-container">
                        <input type="text" id="keywordInput" placeholder="Add a keyword and press Enter">
                        <button type="button" class="add-tag-btn" id="addKeywordBtn">Add</button>
                    </div>
                    <div class="tags-container" id="keywordsContainer"></div>
                </div>

                <div class="form-group">
                    <label for="mainIdea">Main Idea/Plot</label>
                    <textarea id="mainIdea" name="mainIdea" rows="4" placeholder="Describe your main idea, plot, or concept that you want the AI to build upon. This will help generate content that aligns with your specific vision."></textarea>
                </div>
            </div>

            <button type="submit" class="generate-btn" id="generateBtn">
                Generate Content
            </button>
        </form>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Generating your content with AI...</p>
        </div>

        <div class="error-message" id="errorMessage"></div>

        <div class="result-container" id="resultContainer">
            <!-- Results will be dynamically inserted here -->
        </div>
    </div>

    <script>
        // Language strings
        const uiLanguages = {
            english: {
                title: 'Quill™',
                subtitle: 'AI-powered writing assistant for articles and novels',
                settings: 'Settings',
                settingsDescription: 'Configure your Quill writing assistant',
                topicLabel: 'Topic *',
                topicPlaceholder: 'e.g. romance, horror, philosophy',
                tagsLabel: 'Tags',
                tagsPlaceholder: 'Add a tag and press Enter',
                keywordsLabel: 'Keywords',
                keywordsPlaceholder: 'Add a keyword and press Enter',
                authorStyleLabel: 'Author Style *',
                selectAuthor: 'Select an author',
                customAuthorPlaceholder: 'Enter custom author name',
                selectLanguage: 'Select language',
                addButton: 'Add',
                chapterCountPlaceholder: 'e.g. 10',
                typeLabel: 'Type *',
                typeArticle: 'Article/Chapter',
                typeShortStory: 'Short Story/Cerpen',
                typeNovel: 'Novel Outline',
                chapterCountLabel: 'Number of Chapters',
                languageLabel: 'Content Language *',
                mainIdeaLabel: 'Main Idea/Plot',
                mainIdeaPlaceholder: 'Describe your main idea, plot, or concept that you want the AI to build upon. This will help generate content that aligns with your specific vision.',
                generateButton: 'Generate Content',
                generating: 'Generating your content with AI...',
                loadingFacts: [
                    'Did you know? The quill pen was invented in the 6th century...',
                    'Crafting your story with AI precision...',
                    'The first quills came from swan feathers...',
                    'AI is weaving your narrative masterpiece...',
                    'Ancient scribes used reed pens before quills...',
                    'Polishing your words with intelligent algorithms...',
                    'Quill pens can write up to 10,000 words per day...',
                    'Transforming ideas into beautiful prose...',
                    'The quill revolutionized writing in medieval Europe...',
                    'Shakespeare wrote 37 plays and 154 sonnets...',
                    'The typewriter was invented in 1868...',
                    'AI is learning from millions of literary masterpieces...',
                    'The longest novel ever written is 9,609,000 words...',
                    'Famous authors like Hemingway wrote standing up...',
                    'The first computer novel was written in 1952...',
                    'AI can analyze writing styles of any author...',
                    'The quill pen was used for over 1,000 years...',
                    'Jane Austen wrote her novels in the 19th century...',
                    'Digital writing tools have evolved rapidly...',
                    'The art of storytelling dates back to ancient caves...',
                    'AI helps writers overcome creative blocks...',
                    'The first fountain pen was invented in 1884...',
                    'Literature has shaped human culture for millennia...',
                    'Modern AI continues the tradition of great storytellers...',
                    'Writing by hand improves memory and creativity...',
                    'The ballpoint pen was invented in 1938...',
                    'AI analyzes themes, plots, and character development...',
                    'The printing press revolutionized knowledge sharing...',
                    'Every great writer started as a beginner...',
                    'AI preserves writing traditions while innovating...'
                ],
                apiKeyRequired: 'Please set your Gemini API key in Settings first.',
                missingFields: 'Missing required fields',
                tagsRequired: 'Please add at least one tag',
                exportMarkdown: 'Export as Markdown',
                exportRtf: 'Export as RTF',
                generateChapter: 'Generate Chapter Content',
                generatingChapter: 'Generating...',
                regenerateChapter: 'Regenerate Chapter',
                exportChapter: 'Export Chapter',
                selectTitle: 'Select Title',
                selectSubtitle: 'Select Subtitle',
                novelTitle: 'Novel Title',
                synopsis: 'Synopsis',
                outline: 'Outline',
                chapter: 'Chapter',
                refinedTags: 'Refined Tags',
                content: 'Content',
                backToGenerator: '← Back to Generator',
                languageSettings: 'Language Settings',
                interfaceLanguage: 'Interface Language',
                languageHelp: 'Choose the language for the user interface',
                apiConfiguration: 'Gemini AI Configuration',
                getApiKey: 'How to get your API key:',
                apiSteps: ['Go to Google AI Studio', 'Sign in with your Google account', 'Create a new API key', 'Copy the key and paste it below'],
                apiKeyLabel: 'Gemini API Key *',
                apiKeyPlaceholder: 'Enter your Gemini API key',
                saveApiKey: 'Save API Key',
                apiKeySaved: 'API key saved successfully!',
                apiKeyVerified: 'API key verified and saved successfully!',
                apiKeyVerificationFailed: 'API key saved but verification failed: ',
                apiKeySaveError: 'API key saved but could not verify: ',
                pleaseEnterApiKey: 'Please enter an API key'
            },
            indonesian: {
                title: 'Quill™',
                subtitle: 'Asisten penulisan bertenaga AI untuk artikel dan novel',
                settings: 'Pengaturan',
                settingsDescription: 'Konfigurasikan asisten penulisan Quill Anda',
                topicLabel: 'Topik *',
                topicPlaceholder: 'contoh: romansa, horor, filsafat',
                tagsLabel: 'Tag',
                tagsPlaceholder: 'Tambahkan tag dan tekan Enter',
                keywordsLabel: 'Kata Kunci',
                keywordsPlaceholder: 'Tambahkan kata kunci dan tekan Enter',
                authorStyleLabel: 'Gaya Penulis *',
                selectAuthor: 'Pilih penulis',
                customAuthorPlaceholder: 'Masukkan nama penulis kustom',
                selectLanguage: 'Pilih bahasa',
                addButton: 'Tambah',
                chapterCountPlaceholder: 'contoh: 10',
                typeLabel: 'Tipe *',
                typeArticle: 'Artikel/Bab',
                typeShortStory: 'Cerita Pendek/Cerpen',
                typeNovel: 'Outline Novel',
                chapterCountLabel: 'Jumlah Bab',
                languageLabel: 'Bahasa Konten *',
                mainIdeaLabel: 'Ide Utama/Alur',
                mainIdeaPlaceholder: 'Jelaskan ide utama, alur, atau konsep yang ingin Anda bangun oleh AI. Ini akan membantu menghasilkan konten yang selaras dengan visi spesifik Anda.',
                generateButton: 'Hasilkan Konten',
                generating: 'Menghasilkan konten Anda dengan AI...',
                loadingFacts: [
                    'Tahukah Anda? Pena quill ditemukan pada abad ke-6...',
                    'Membuat cerita Anda dengan presisi AI...',
                    'Quill pertama berasal dari bulu angsa...',
                    'AI sedang menenun masterpiece naratif Anda...',
                    'Para penulis kuno menggunakan pena reed sebelum quill...',
                    'Memoles kata-kata Anda dengan algoritma cerdas...',
                    'Pena quill dapat menulis hingga 10.000 kata per hari...',
                    'Mengubah ide menjadi prosa yang indah...',
                    'Quill merevolusi penulisan di Eropa abad pertengahan...',
                    'Shakespeare menulis 37 drama dan 154 soneta...',
                    'Mesin tik ditemukan pada tahun 1868...',
                    'AI belajar dari jutaan karya sastra masterpiece...',
                    'Novel terpanjang pernah ditulis berjumlah 9,609,000 kata...',
                    'Penulis terkenal seperti Hemingway menulis sambil berdiri...',
                    'Novel komputer pertama ditulis pada tahun 1952...',
                    'AI dapat menganalisis gaya tulisan penulis mana pun...',
                    'Pena quill digunakan selama lebih dari 1.000 tahun...',
                    'Jane Austen menulis novelnya pada abad ke-19...',
                    'Alat tulis digital berkembang dengan pesat...',
                    'Seni bercerita dimulai sejak gua-gua kuno...',
                    'AI membantu penulis mengatasi blok kreatif...',
                    'Pena fountain pertama ditemukan pada tahun 1884...',
                    'Sastra telah membentuk budaya manusia selama ribuan tahun...',
                    'AI modern melanjutkan tradisi pencerita hebat...',
                    'Menulis dengan tangan meningkatkan memori dan kreativitas...',
                    'Pena ballpoint ditemukan pada tahun 1938...',
                    'AI menganalisis tema, plot, dan perkembangan karakter...',
                    'Mesin cetak merevolusi berbagi pengetahuan...',
                    'Setiap penulis hebat pernah menjadi pemula...',
                    'AI melestarikan tradisi tulis sambil berinovasi...'
                ],
                apiKeyRequired: 'Silakan atur kunci API Gemini Anda di Pengaturan terlebih dahulu.',
                missingFields: 'Kolom yang diperlukan tidak lengkap',
                tagsRequired: 'Silakan tambahkan setidaknya satu tag',
                exportMarkdown: 'Ekspor sebagai Markdown',
                exportRtf: 'Ekspor sebagai RTF',
                generateChapter: 'Hasilkan Konten Bab',
                generatingChapter: 'Menghasilkan...',
                regenerateChapter: 'Hasilkan Ulang Bab',
                exportChapter: 'Ekspor Bab',
                selectTitle: 'Pilih Judul',
                selectSubtitle: 'Pilih Subjudul',
                novelTitle: 'Judul Novel',
                synopsis: 'Sinopsis',
                outline: 'Outline',
                chapter: 'Bab',
                refinedTags: 'Tag yang Dimurnikan',
                content: 'Konten',
                backToGenerator: '← Kembali ke Generator',
                languageSettings: 'Pengaturan Bahasa',
                interfaceLanguage: 'Bahasa Antarmuka',
                languageHelp: 'Pilih bahasa untuk antarmuka pengguna',
                apiConfiguration: 'Konfigurasi Gemini AI',
                getApiKey: 'Cara mendapatkan kunci API:',
                apiSteps: ['Kunjungi Google AI Studio', 'Masuk dengan akun Google Anda', 'Buat kunci API baru', 'Salin kunci dan tempel di bawah'],
                apiKeyLabel: 'Kunci API Gemini *',
                apiKeyPlaceholder: 'Masukkan kunci API Gemini Anda',
                saveApiKey: 'Simpan Kunci API',
                apiKeySaved: 'Kunci API berhasil disimpan!',
                apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan!',
                apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
                apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
                pleaseEnterApiKey: 'Silakan masukkan kunci API'
            }
        };

        // Form handling and UI logic
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('articleForm');
            const typeSelect = document.getElementById('type');
            const chapterCountGroup = document.getElementById('chapterCountGroup');
            const authorStyleSelect = document.getElementById('authorStyle');
            const customAuthorStyle = document.getElementById('customAuthorStyle');
            const generateBtn = document.getElementById('generateBtn');
            const loading = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            const resultContainer = document.getElementById('resultContainer');
            // Load saved language preference
            const savedLanguage = localStorage.getItem('uiLanguage') || 'english';

            // Function to update UI language
            function updateUILanguage(lang) {
                const texts = uiLanguages[lang];
                document.querySelector('h1').textContent = texts.title;
                document.querySelector('p').textContent = texts.subtitle;
                document.querySelector('.settings-link').textContent = '⚙️ ' + texts.settings;
                document.querySelector('label[for="topic"]').textContent = texts.topicLabel;
                document.querySelector('#topic').placeholder = texts.topicPlaceholder;
                document.querySelector('label[for="tags"]').textContent = texts.tagsLabel;
                document.querySelector('#tagInput').placeholder = texts.tagsPlaceholder;
                document.querySelector('#addTagBtn').textContent = texts.addButton;
                document.querySelector('label[for="keywords"]').textContent = texts.keywordsLabel;
                document.querySelector('#keywordInput').placeholder = texts.keywordsPlaceholder;
                document.querySelector('#addKeywordBtn').textContent = texts.addButton;
                document.querySelector('label[for="authorStyle"]').textContent = texts.authorStyleLabel;
                document.querySelector('#authorStyle option[value=""]').textContent = texts.selectAuthor;
                document.querySelector('#customAuthorStyle').placeholder = texts.customAuthorPlaceholder;
                document.querySelector('label[for="type"]').textContent = texts.typeLabel;
                document.querySelector('#type option[value="article"]').textContent = texts.typeArticle;
                document.querySelector('#type option[value="shortstory"]').textContent = texts.typeShortStory;
                document.querySelector('#type option[value="novel"]').textContent = texts.typeNovel;
                document.querySelector('label[for="chapterCount"]').textContent = texts.chapterCountLabel;
                document.querySelector('#chapterCount').placeholder = texts.chapterCountPlaceholder;
                document.querySelector('label[for="language"]').textContent = texts.languageLabel;
                document.querySelector('#language option[value=""]').textContent = texts.selectLanguage;
                document.querySelector('label[for="mainIdea"]').textContent = texts.mainIdeaLabel;
                document.querySelector('#mainIdea').placeholder = texts.mainIdeaPlaceholder;
                document.querySelector('#generateBtn').textContent = texts.generateButton;
                // Only update loading text if not currently cycling through facts
                if (!loadingInterval) {
                    document.querySelector('#loading p').textContent = texts.generating;
                }

                // Update chapter loading texts if they exist
                const chapterLoadingTexts = document.querySelectorAll('[id^="generating-chapter-text"]');
                chapterLoadingTexts.forEach(text => {
                    text.textContent = texts.generatingChapter;
                });

                // Store language preference
                localStorage.setItem('uiLanguage', lang);
            }

            // Loading text cycling functionality
            let loadingInterval;
            let shuffledFacts = [];
            let currentFactIndex = 0;

            function shuffleArray(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }

            function startLoadingFacts(lang) {
                const texts = uiLanguages[lang];
                const facts = texts.loadingFacts;
                if (!facts || facts.length === 0) return;

                // Shuffle facts for random order each time
                shuffledFacts = shuffleArray(facts);
                currentFactIndex = 0;
                const loadingTextElement = document.querySelector('#loading p');

                // Show first fact immediately
                loadingTextElement.textContent = shuffledFacts[0];

                // Start cycling through shuffled facts with varied timing
                loadingInterval = setInterval(() => {
                    currentFactIndex = (currentFactIndex + 1) % shuffledFacts.length;
                    loadingTextElement.textContent = shuffledFacts[currentFactIndex];
                }, 2800 + Math.random() * 800); // Random timing between 2.8-3.6 seconds
            }

            function stopLoadingFacts() {
                if (loadingInterval) {
                    clearInterval(loadingInterval);
                    loadingInterval = null;
                    // Reset to default generating text
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    const texts = uiLanguages[currentLang];
                    document.querySelector('#loading p').textContent = texts.generating;
                }
            }

            // Initialize language
            updateUILanguage(savedLanguage);

            // Tag and keyword management
            let tags = [];
            let keywords = [];

            function setupTagSystem(inputId, containerId, array, addBtnId) {
                const input = document.getElementById(inputId);
                const container = document.getElementById(containerId);
                const addBtn = document.getElementById(addBtnId);

                function addItem(value) {
                    if (value && !array.includes(value)) {
                        array.push(value);
                        renderItems();
                        input.value = '';
                    }
                }

                function removeItem(index) {
                    array.splice(index, 1);
                    renderItems();
                }

                function renderItems() {
                    container.innerHTML = '';
                    array.forEach((item, index) => {
                        const tagElement = document.createElement('div');
                        tagElement.className = 'tag';
                        tagElement.innerHTML = \`
                            \${item}
                            <span class="tag-remove" onclick="removeItem(\${index}, '\${array === tags ? 'tags' : 'keywords'}')">&times;</span>
                        \`;
                        container.appendChild(tagElement);
                    });
                }

                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem(input.value.trim());
                    }
                });

                addBtn.addEventListener('click', function() {
                    addItem(input.value.trim());
                });

                // Make removeItem available globally for onclick
                window.removeItem = function(index, type) {
                    if (type === 'tags') {
                        tags.splice(index, 1);
                        renderItems();
                    } else {
                        keywords.splice(index, 1);
                        renderItems();
                    }
                };
            }

            setupTagSystem('tagInput', 'tagsContainer', tags, 'addTagBtn');
            setupTagSystem('keywordInput', 'keywordsContainer', keywords, 'addKeywordBtn');

            // Type selection handling
            typeSelect.addEventListener('change', function() {
                if (this.value === 'novel') {
                    chapterCountGroup.classList.add('show');
                } else {
                    chapterCountGroup.classList.remove('show');
                }
            });

            // Author style handling
            authorStyleSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customAuthorStyle.style.display = 'block';
                    customAuthorStyle.required = true;
                } else {
                    customAuthorStyle.style.display = 'none';
                    customAuthorStyle.required = false;
                }
            });

            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth' });
            }

            // Form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = new FormData(form);
                const apiKey = localStorage.getItem('geminiApiKey');
                if (!apiKey) {
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    showError(uiLanguages[currentLang].apiKeyRequired);
                    return;
                }

                const data = {
                    topic: formData.get('topic'),
                    tags: tags.length > 0 ? tags : undefined,
                    keywords: keywords.length > 0 ? keywords : undefined,
                    authorStyle: authorStyleSelect.value === 'custom' ? customAuthorStyle.value : authorStyleSelect.value,
                    type: formData.get('type'),
                    chapterCount: formData.get('chapterCount') ? parseInt(formData.get('chapterCount')) : undefined,
                    language: formData.get('language'),
                    mainIdea: formData.get('mainIdea') || undefined,
                    apiKey: apiKey
                };

                // Show loading
                loading.style.display = 'block';
                generateBtn.disabled = true;
                errorMessage.style.display = 'none';
                resultContainer.style.display = 'none';

                // Start cycling loading facts
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                startLoadingFacts(currentLang);

                try {
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to generate content');
                    }

                    displayResults(result, data.type);
                } catch (error) {
                    showError(error.message);
                } finally {
                    loading.style.display = 'none';
                    generateBtn.disabled = false;
                    // Stop cycling loading facts
                    stopLoadingFacts();
                }
            });

            function displayResults(result, type) {
                resultContainer.innerHTML = '';

                if (type === 'article' || type === 'shortstory') {
                    displayArticleResults(result);
                } else {
                    displayNovelResults(result);
                }

                resultContainer.style.display = 'block';
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            }

            function displayArticleResults(result) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                let html = '';

                if (result.refinedTags && result.refinedTags.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.refinedTags}</h3>
                            <div class="tags-container">
                                \${result.refinedTags.map(tag => \`<div class="tag">\${tag}</div>\`).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.titleSelection && result.titleSelection.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.selectTitle}</h3>
                            <div class="title-options">
                                \${result.titleSelection.map((title, index) =>
                                    \`<div class="option-card" onclick="selectOption(this, 'title', \${index})">
                                        <div class="option-title">Option \${index + 1}</div>
                                        <div>\${title}</div>
                                    </div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.subtitleSelection && result.subtitleSelection.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.selectSubtitle}</h3>
                            <div class="title-options">
                                \${result.subtitleSelection.map((subtitle, index) =>
                                    \`<div class="option-card" onclick="selectOption(this, 'subtitle', \${index})">
                                        <div class="option-title">Option \${index + 1}</div>
                                        <div>\${subtitle}</div>
                                    </div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.content) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.content}</h3>
                            <div class="content-display">\${result.content}</div>
                        </div>

                        <div class="export-section">
                            <h3>Export Your Content</h3>
                            <div class="export-controls">
                                <select id="selectedTitle" class="export-select">
                                    <option value="">\${texts.selectTitle}...</option>
                                    \${result.titleSelection ? result.titleSelection.map((title, index) =>
                                        \`<option value="\${title}">\${title}</option>\`
                                    ).join('') : ''}
                                </select>
                                <select id="selectedSubtitle" class="export-select">
                                    <option value="">\${texts.selectSubtitle}...</option>
                                    \${result.subtitleSelection ? result.subtitleSelection.map((subtitle, index) =>
                                        \`<option value="\${subtitle}">\${subtitle}</option>\`
                                    ).join('') : ''}
                                </select>
                            </div>
                            <div class="export-buttons">
                                <button class="export-btn" onclick="exportAsMarkdown()">
                                    📄 \${texts.exportMarkdown}
                                </button>
                                <button class="export-btn" onclick="exportAsRtf()">
                                    📝 \${texts.exportRtf}
                                </button>
                            </div>
                        </div>
                    \`;
                }

                resultContainer.innerHTML = html;
            }

            function displayNovelResults(result) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                let html = '';

                if (result.titleSelection && result.titleSelection.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.selectTitle}</h3>
                            <div class="title-options">
                                \${result.titleSelection.map((title, index) =>
                                    \`<div class="option-card" onclick="selectOption(this, 'title', \${index})">
                                        <div class="option-title">Option \${index + 1}</div>
                                        <div>\${title}</div>
                                    </div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.synopsis) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.synopsis}</h3>
                            <div class="content-display">\${result.synopsis}</div>
                        </div>
                    \`;
                }

                if (result.outline && result.outline.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.outline}</h3>
                            <div class="chapter-outline">
                                  \${result.outline.map(chapter => \`
                                      <div class="chapter-item">
                                        <div class="chapter-header" onclick="toggleChapter(\${chapter.chapterNumber})">
                                            <div class="chapter-title-section">
                                                <div class="chapter-number">\${texts.chapter} \${chapter.chapterNumber}: \${chapter.title}</div>
                                                <div>\${chapter.subtitle}</div>
                                            </div>
                                            <div class="chapter-toggle collapsed" id="chapter-toggle-\${chapter.chapterNumber}">▶</div>
                                        </div>
                                        <div class="chapter-content-section" id="chapter-content-section-\${chapter.chapterNumber}">
                                            <div class="chapter-details">
                                                <div class="chapter-actions">
                                                    <button class="generate-chapter-btn"
                                                            data-chapter-number="\${chapter.chapterNumber}"
                                                            data-chapter-title="\${chapter.title.replace(/"/g, '&quot;')}"
                                                            data-chapter-subtitle="\${chapter.subtitle.replace(/"/g, '&quot;')}"
                                                            data-novel-title="\${result.titleSelection ? result.titleSelection[0].replace(/"/g, '&quot;') : ''}"
                                                            data-novel-synopsis="\${result.synopsis ? result.synopsis.substring(0, 100).replace(/"/g, '&quot;') : ''}"
                                                            onclick="generateChapter(this)">
                                                        \${texts.generateChapter}
                                                    </button>
                                                    <button class="export-chapter-btn"
                                                            id="export-chapter-\${chapter.chapterNumber}-btn"
                                                            data-chapter-number="\${chapter.chapterNumber}"
                                                            data-chapter-title="\${chapter.title.replace(/"/g, '&quot;')}"
                                                            data-chapter-subtitle="\${chapter.subtitle.replace(/"/g, '&quot;')}"
                                                            onclick="exportChapter(this)"
                                                            style="display: none;">
                                                        📄 \${texts.exportChapter}
                                                    </button>
                                                </div>
                                                <div class="chapter-loading" id="chapter-\${chapter.chapterNumber}-loading" style="display: none;">
                                                    <div class="spinner" style="width: 20px; height: 20px;"></div>
                                                    <span id="generating-chapter-text-\${chapter.chapterNumber}">\${texts.generatingChapter}</span>
                                                </div>
                                                <div class="chapter-content" id="chapter-\${chapter.chapterNumber}-content" style="display: none;"></div>
                                            </div>
                                        </div>
                                      </div>
                                  \`).join('')}
                            </div>
                        </div>

                        <div class="export-section">
                            <h3>Export Your Novel</h3>
                            <div class="export-controls">
                                <select id="selectedNovelTitle" class="export-select">
                                    <option value="">\${texts.selectTitle}...</option>
                                    \${result.titleSelection ? result.titleSelection.map((title, index) =>
                                        \`<option value="\${title}">\${title}</option>\`
                                    ).join('') : ''}
                                </select>
                            </div>
                            <div class="export-buttons">
                                <button class="export-btn" onclick="exportNovelAsMarkdown()">
                                    📄 \${texts.exportMarkdown}
                                </button>
                                <button class="export-btn" onclick="exportNovelAsRtf()">
                                    📝 \${texts.exportRtf}
                                </button>
                            </div>
                        </div>
                    \`;
                }

                resultContainer.innerHTML = html;
            }
        });

        function selectOption(element, type, index) {
            // Remove selected class from all options of this type
            const container = element.closest('.title-options, .subtitle-options');
            container.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selected class to clicked option
            element.classList.add('selected');
        }

        function exportAsMarkdown() {
            const selectedTitle = document.getElementById('selectedTitle').value;
            const selectedSubtitle = document.getElementById('selectedSubtitle').value;

            if (!selectedTitle) {
                alert('Please select a title first.');
                return;
            }

            // Get the content from the result
            const contentElement = document.querySelector('.content-display');
            if (!contentElement) {
                alert('No content found to export.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            // Create markdown content
            let markdown = \`# \${selectedTitle}\n\n\`;
            if (selectedSubtitle) {
                markdown += \`## \${selectedSubtitle}\n\n\`;
            }
            markdown += content;

            // Create and download file
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${selectedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        async         function exportAsRtf() {
            const selectedTitle = document.getElementById('selectedTitle').value;
            const selectedSubtitle = document.getElementById('selectedSubtitle').value;

            if (!selectedTitle) {
                alert('Please select a title first.');
                return;
            }

            // Get the content from the result
            const contentElement = document.querySelector('.content-display');
            if (!contentElement) {
                alert('No content found to export.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            try {
                // Send to backend for RTF generation
                const response = await fetch('/api/export-docx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: selectedTitle,
                        subtitle: selectedSubtitle,
                        content: content
                    })
                });

                if (!response.ok) {
                    throw new Error('Export failed');
                }

                // Download the RTF file
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`\${selectedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.rtf\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

            } catch (error) {
                alert('RTF export failed. Please try Markdown export instead.');
                console.error('RTF export error:', error);
            }
        }

        function toggleChapter(chapterNumber) {
            const contentSection = document.getElementById(\`chapter-content-section-\${chapterNumber}\`);
            const toggleButton = document.getElementById(\`chapter-toggle-\${chapterNumber}\`);

            if (contentSection.classList.contains('expanded')) {
                // Collapse
                contentSection.classList.remove('expanded');
                toggleButton.classList.remove('expanded');
                toggleButton.classList.add('collapsed');
                toggleButton.textContent = '▶';
            } else {
                // Expand
                contentSection.classList.add('expanded');
                toggleButton.classList.remove('collapsed');
                toggleButton.classList.add('expanded');
                toggleButton.textContent = '▼';
            }
        }

        async function generateChapter(button) {
            const chapterNumber = parseInt(button.getAttribute('data-chapter-number'));
            const chapterTitle = button.getAttribute('data-chapter-title');
            const chapterSubtitle = button.getAttribute('data-chapter-subtitle');
            const novelTitle = button.getAttribute('data-novel-title');
            const novelSynopsis = button.getAttribute('data-novel-synopsis');

            const loadingDiv = document.getElementById(\`chapter-\${chapterNumber}-loading\`);
            const contentDiv = document.getElementById(\`chapter-\${chapterNumber}-content\`);

            // Get the API key from localStorage
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                alert('Please set your Gemini API key in Settings first.');
                return;
            }

            // Show loading state
            button.disabled = true;
            const currentLang = localStorage.getItem('uiLanguage') || 'english';
            const texts = uiLanguages[currentLang];
            button.textContent = texts.generatingChapter;
            loadingDiv.style.display = 'flex';

            try {
                const response = await fetch('/api/generate-chapter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chapterNumber: chapterNumber,
                        chapterTitle: chapterTitle,
                        chapterSubtitle: chapterSubtitle,
                        novelTitle: novelTitle,
                        novelSynopsis: novelSynopsis,
                        apiKey: apiKey
                    })
                });

                if (!response.ok) {
                    throw new Error('Chapter generation failed');
                }

                const result = await response.json();

                // Hide loading, show content
                loadingDiv.style.display = 'none';
                contentDiv.style.display = 'block';
                contentDiv.textContent = result.content;

                // Show export button
                const exportBtn = document.getElementById(\`export-chapter-\${chapterNumber}-btn\`);
                if (exportBtn) {
                    exportBtn.style.display = 'inline-flex';
                }

                // Auto-expand the chapter to show the generated content
                const contentSection = document.getElementById(\`chapter-content-section-\${chapterNumber}\`);
                const toggleButton = document.getElementById(\`chapter-toggle-\${chapterNumber}\`);
                if (!contentSection.classList.contains('expanded')) {
                    toggleChapter(chapterNumber);
                }

                // Update button
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                button.textContent = texts.regenerateChapter;
                button.disabled = false;

            } catch (error) {
                alert('Chapter generation failed. Please try again.');
                console.error('Chapter generation error:', error);

                // Reset button and hide loading
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                button.disabled = false;
                button.textContent = texts.generateChapter;
                loadingDiv.style.display = 'none';
            }
        }

        async function exportChapter(button) {
            const chapterNumber = parseInt(button.getAttribute('data-chapter-number'));
            const chapterTitle = button.getAttribute('data-chapter-title');
            const chapterSubtitle = button.getAttribute('data-chapter-subtitle');

            const contentElement = document.getElementById(\`chapter-\${chapterNumber}-content\`);

            if (!contentElement || contentElement.style.display === 'none') {
                alert('No chapter content found to export. Please generate the chapter first.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            // Show export options dialog
            const exportChoice = confirm(\`Export Chapter \${chapterNumber} as:\n\nOK = RTF (Word compatible)\nCancel = Markdown\`);

            if (exportChoice) {
                // Export as RTF
                try {
                    const response = await fetch('/api/export-chapter', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chapterNumber: chapterNumber,
                            chapterTitle: chapterTitle,
                            chapterSubtitle: chapterSubtitle,
                            content: content
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Export failed');
                    }

                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = \`\${chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chapter_\${chapterNumber}.rtf\`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                } catch (error) {
                    alert('Chapter RTF export failed. Please try again.');
                    console.error('Chapter RTF export error:', error);
                }
            } else {
                // Export as Markdown (client-side)
                const markdown = \`# Chapter \${chapterNumber}: \${chapterTitle}\n\n## \${chapterSubtitle}\n\n\${content}\n\n---\n\`;

                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`\${chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chapter_\${chapterNumber}.md\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }

        function exportNovelAsMarkdown() {
            const selectedTitle = document.getElementById('selectedNovelTitle').value;

            if (!selectedTitle) {
                alert('Please select a novel title first.');
                return;
            }

            // Collect all chapter content
            const chapters = [];
            const chapterItems = document.querySelectorAll('.chapter-item');

            chapterItems.forEach((item, index) => {
                const chapterNumber = index + 1;
                const chapterTitle = item.querySelector('.chapter-number').textContent;
                const chapterContent = item.querySelector('.chapter-content');

                chapters.push({
                    number: chapterNumber,
                    title: chapterTitle,
                    content: chapterContent && chapterContent.style.display !== 'none' ?
                        chapterContent.textContent : '[Chapter content not generated yet]'
                });
            });

            // Create markdown content
            let markdown = \`# \${selectedTitle}\n\n\`;

            // Add synopsis if available
            const synopsisElement = document.querySelector('.content-display');
            if (synopsisElement) {
                const synopsis = synopsisElement.textContent || synopsisElement.innerText;
                markdown += \`## Synopsis\n\n\${synopsis}\n\n\`;
            }

            // Add chapters
            chapters.forEach(chapter => {
                markdown += \`## \${chapter.title}\n\n\${chapter.content}\n\n---\n\n\`;
            });

            // Create and download file
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${selectedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        async function exportNovelAsRtf() {
            const selectedTitle = document.getElementById('selectedNovelTitle').value;

            if (!selectedTitle) {
                alert('Please select a novel title first.');
                return;
            }

            // Collect all content
            const chapters = [];
            const chapterItems = document.querySelectorAll('.chapter-item');

            chapterItems.forEach((item, index) => {
                const chapterNumber = index + 1;
                const chapterTitle = item.querySelector('.chapter-number').textContent;
                const chapterContent = item.querySelector('.chapter-content');

                chapters.push({
                    number: chapterNumber,
                    title: chapterTitle,
                    content: chapterContent && chapterContent.style.display !== 'none' ?
                        chapterContent.textContent : '[Chapter content not generated yet]'
                });
            });

            // Get synopsis
            const synopsisElement = document.querySelector('.content-display');
            const synopsis = synopsisElement ?
                (synopsisElement.textContent || synopsisElement.innerText) : '';

            // Combine all content
            let fullContent = \`Synopsis:\n\n\${synopsis}\n\n\`;
            chapters.forEach(chapter => {
                fullContent += \`\${chapter.title}\n\n\${chapter.content}\n\n\`;
            });

            try {
                // Send to backend for RTF generation
                const response = await fetch('/api/export-docx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: selectedTitle,
                        subtitle: 'Novel',
                        content: fullContent
                    })
                });

                if (!response.ok) {
                    throw new Error('Export failed');
                }

                // Download the RTF file
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`\${selectedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_novel.rtf\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

            } catch (error) {
                alert('RTF export failed. Please try Markdown export instead.');
                console.error('RTF export error:', error);
            }
        }
    </script>
</body>
</html>`;

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (pathname === '/settings') {
    const settingsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill™ - Settings</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.8;
        }

        .nav {
            text-align: center;
            margin-bottom: 30px;
        }

        .nav a {
            color: #00d4ff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .nav a:hover {
            background: rgba(0, 212, 255, 0.1);
        }

        .settings-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .settings-section {
            margin-bottom: 30px;
        }

        .settings-section h3 {
            color: #00ff88;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        /* Mobile settings improvements */
        @media (max-width: 768px) {
            .settings-container {
                padding: 20px;
                border-radius: 15px;
            }

            .settings-section {
                margin-bottom: 25px;
            }

            .settings-section h3 {
                font-size: 1.2rem;
                margin-bottom: 12px;
            }
        }

        @media (max-width: 480px) {
            .settings-container {
                padding: 15px;
            }

            .settings-section h3 {
                font-size: 1.1rem;
            }
        }

        .form-group {
            margin-bottom: 20px;
        }

        .language-select {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .language-select:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #00d4ff;
        }

        input[type="password"], input[type="text"] {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }

        .save-btn {
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #0f0f0f;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 20px;
        }

        .save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
        }

        .save-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .status-message {
            margin-top: 15px;
            padding: 12px;
            border-radius: 8px;
            display: none;
        }

        .status-success {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            color: #00ff88;
        }

        .status-error {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff6b6b;
            color: #ff6b6b;
        }

        .info-box {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #00d4ff;
        }

        .info-box h4 {
            color: #00d4ff;
            margin-bottom: 10px;
        }

        .info-box p {
            opacity: 0.8;
            line-height: 1.5;
        }

        /* Mobile info-box improvements */
        @media (max-width: 768px) {
            .info-box {
                padding: 15px;
            }
        }

        @media (max-width: 480px) {
            .info-box {
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Quill™ Settings</h1>
            <p id="settingsDescription">Configure your Quill writing assistant</p>
        </div>

        <div class="nav">
            <a href="/">← Back to Generator</a>
        </div>

        <div class="settings-container">
            <div class="settings-section">
                <h3>Language Settings</h3>

                <div class="form-group">
                    <label for="uiLanguage">Interface Language</label>
                    <select id="uiLanguage" class="language-select">
                        <option value="english">English</option>
                        <option value="indonesian">Bahasa Indonesia</option>
                    </select>
                    <small style="color: #888; display: block; margin-top: 5px;">Choose the language for the user interface</small>
                </div>
            </div>

            <div class="settings-section">
                <h3>Gemini AI Configuration</h3>

                <div class="info-box">
                    <h4>How to get your API key:</h4>
                    <p>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #00d4ff;">Google AI Studio</a><br>
                    2. Sign in with your Google account<br>
                    3. Create a new API key<br>
                    4. Copy the key and paste it below</p>
                </div>

                <form id="apiKeyForm">
                    <div class="form-group">
                        <label for="apiKey">Gemini API Key *</label>
                        <input type="password" id="apiKey" placeholder="Enter your Gemini API key" required>
                    </div>

                    <button type="submit" class="save-btn" id="saveBtn">
                        Save API Key
                    </button>
                </form>

                <div class="status-message" id="statusMessage"></div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const apiKeyForm = document.getElementById('apiKeyForm');
            const apiKeyInput = document.getElementById('apiKey');
            const saveBtn = document.getElementById('saveBtn');
            const statusMessage = document.getElementById('statusMessage');
            const languageSelect = document.getElementById('uiLanguage');

            // Language strings
            const languages = {
                english: {
                    navBack: '← Back to Generator',
                    title: 'Quill™ Settings',
                    settingsDescription: 'Configure your Quill writing assistant',
                    languageTitle: 'Language Settings',
                    languageLabel: 'Interface Language',
                    languageHelp: 'Choose the language for the user interface',
                    apiTitle: 'Gemini AI Configuration',
                    apiInstructions: 'How to get your API key:',
                    apiSteps: ['<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #00d4ff; text-decoration: underline;">Go to Google AI Studio</a>', 'Sign in with your Google account', 'Create a new API key', 'Copy the key and paste it below'],
                    apiKeyLabel: 'Gemini API Key *',
                    apiKeyPlaceholder: 'Enter your Gemini API key',
                    saveButton: 'Save API Key',
                    apiKeySaved: 'API key saved successfully!',
                    apiKeyVerified: 'API key verified and saved successfully!',
                    apiKeyVerificationFailed: 'API key saved but verification failed: ',
                    apiKeySaveError: 'API key saved but could not verify: ',
                    pleaseEnterApiKey: 'Please enter an API key'
                },
                indonesian: {
                    navBack: '← Kembali ke Generator',
                    title: 'Pengaturan Quill™',
                    settingsDescription: 'Konfigurasikan asisten penulisan Quill Anda',
                    languageTitle: 'Pengaturan Bahasa',
                    languageLabel: 'Bahasa Antarmuka',
                    languageHelp: 'Pilih bahasa untuk antarmuka pengguna',
                    apiTitle: 'Konfigurasi Gemini AI',
                    apiInstructions: 'Cara mendapatkan kunci API:',
                    apiSteps: ['<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #00d4ff; text-decoration: underline;">Kunjungi Google AI Studio</a>', 'Masuk dengan akun Google Anda', 'Buat kunci API baru', 'Salin kunci dan tempel di bawah'],
                    apiKeyLabel: 'Kunci API Gemini *',
                    apiKeyPlaceholder: 'Masukkan kunci API Gemini Anda',
                    saveButton: 'Simpan Kunci API',
                    apiKeySaved: 'Kunci API berhasil disimpan!',
                    apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan!',
                    apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
                    apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
                    pleaseEnterApiKey: 'Silakan masukkan kunci API'
                }
            };

            // Load saved language preference
            const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
            languageSelect.value = savedLanguage;

            // Load saved API key
            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) {
                apiKeyInput.value = savedApiKey;
            }

            // Function to update UI language
            function updateLanguage(lang) {
                const texts = languages[lang];
                document.querySelector('.nav a').textContent = texts.navBack;
                document.querySelector('h1').textContent = texts.title;
                document.querySelector('#settingsDescription').textContent = texts.settingsDescription;
                document.querySelectorAll('.settings-section h3')[0].textContent = texts.languageTitle;
                document.querySelector('label[for="uiLanguage"]').textContent = texts.languageLabel;
                document.querySelector('.settings-section small').textContent = texts.languageHelp;
                document.querySelectorAll('.settings-section h3')[1].textContent = texts.apiTitle;
                document.querySelector('.info-box h4').textContent = texts.apiInstructions;
                const steps = document.querySelector('.info-box p');
                steps.innerHTML = texts.apiSteps.map((step, index) => (index + 1) + '. ' + step).join('<br>');
                document.querySelector('label[for="apiKey"]').textContent = texts.apiKeyLabel;
                apiKeyInput.placeholder = texts.apiKeyPlaceholder;
                saveBtn.textContent = texts.saveButton;

                // Store language preference
                localStorage.setItem('uiLanguage', lang);
            }

            // Initialize language
            updateLanguage(savedLanguage);

            // Handle language change
            languageSelect.addEventListener('change', function() {
                updateLanguage(this.value);
            });

            // Save API key
            apiKeyForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = languages[currentLang];

                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    showStatus(texts.pleaseEnterApiKey, 'error');
                    return;
                }

                // Save to localStorage
                localStorage.setItem('geminiApiKey', apiKey);
                showStatus(texts.apiKeySaved, 'success');

                // Test the API key
                try {
                    const response = await fetch('/api/test-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ apiKey })
                    });

                    if (response.ok) {
                        showStatus(texts.apiKeyVerified, 'success');
                    } else {
                        const result = await response.json();
                        showStatus(texts.apiKeyVerificationFailed + (result.error || 'Unknown error'), 'error');
                    }
                } catch (error) {
                    showStatus(texts.apiKeySaveError + error.message, 'error');
                }
            });

            function showStatus(message, type) {
                statusMessage.textContent = message;
                statusMessage.className = 'status-message status-' + type;
                statusMessage.style.display = 'block';

                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 5000);
            }
        });
    </script>
</body>
</html>`;

    return new Response(settingsHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response('File not found', { status: 404 });
}

