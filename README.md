# AI Article Auto Writer

A web-based AI-powered article and novel outline generator built with TypeScript and Cloudflare Workers. Uses Google's Gemini AI to create professional content based on user specifications.

## Features

- **Article Generation**: Create full articles or chapters with AI assistance
- **Novel Outlines**: Generate complete novel outlines with chapter breakdowns
- **Author Style Emulation**: Choose from popular authors or specify custom styles
- **Dark Modern UI**: Professional, clean interface with dark theme
- **Flexible Input**: Support for topics, tags, keywords, and chapter counts
- **JSON API**: All responses formatted as structured JSON

## Input Form

### Required Fields
- **Topic**: Main subject (e.g., romance, horror, philosophy)
- **Author Style**: Writing style to emulate (predefined authors or custom)
- **Type**: Article/Chapter or Novel Outline
- **Language**: Content language (English or Indonesian)

### Optional Fields
- **Tags**: Additional categorization tags
- **Keywords**: Specific terms to include
- **Chapter Count**: Required for novel outlines

## Output Formats

### Article/Chapter Response
```json
{
  "refinedTags": ["refined", "tags", "array"],
  "titleSelection": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "subtitleSelection": ["Subtitle Option 1", "Subtitle Option 2", "Subtitle Option 3"],
  "content": "Full article content in specified author's style"
}
```

### Novel Outline Response
```json
{
  "titleSelection": ["Novel Title 1", "Novel Title 2", "Novel Title 3"],
  "synopsis": "Compelling novel synopsis",
  "outline": [
    {
      "chapterNumber": 1,
      "title": "Chapter 1 Title",
      "subtitle": "Chapter 1 Subtitle"
    }
  ]
}
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Gemini API**
   - Go to the Settings page (`/settings`) in the web interface
   - Enter your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - The key is stored locally in your browser

   **Alternative**: Set your Gemini API key in Cloudflare Workers environment variables:
   ```bash
   wrangler secret put GEMINI_API_KEY
   ```

3. **Development**
   ```bash
   npm run dev
   # Open http://localhost:8787 in your browser
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Cloudflare Workers Deployment

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare:**
   ```bash
   wrangler auth login
   ```

3. **Set your Gemini API key:**
   ```bash
   wrangler secret put GEMINI_API_KEY
   # Paste your API key when prompted
   ```

4. **Deploy to Cloudflare:**
   ```bash
   wrangler deploy
   ```

5. **Your app will be live at the URL provided by Wrangler**

### GitHub Repository Setup

1. **Create a new repository on GitHub**

2. **Push your code:**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Set up GitHub Secrets for Auto-deployment:**

   Go to your repository **Settings > Secrets and variables > Actions** and add:

   - **`CLOUDFLARE_API_TOKEN`**: Your Cloudflare API token
     - Get it from: https://dash.cloudflare.com/profile/api-tokens
     - Create a token with "Workers" edit permissions

   - **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare Account ID
     - Find it in: https://dash.cloudflare.com/ (right sidebar)

   - **`GEMINI_API_KEY`** (optional): Your Google Gemini API key
     - Get it from: https://aistudio.google.com/app/apikey

4. **The workflow will automatically deploy on every push to main branch**

3. **Optional: Add GitHub Actions for automated deployment**
   - Create `.github/workflows/deploy.yml` for CI/CD
   - Automatically deploy on push to main branch

## Technology Stack

- **Backend**: Cloudflare Workers (TypeScript)
- **AI**: Google Gemini Pro API
- **Frontend**: Vanilla JavaScript with modern CSS
- **Styling**: Dark theme with gradient effects and glassmorphism

## API Endpoints

### POST `/api/generate`
Generate content based on form data.

**Request Body:**
```json
{
  "topic": "string",
  "tags": ["optional", "array"],
  "keywords": ["optional", "array"],
  "authorStyle": "string",
  "type": "article" | "novel",
  "language": "english" | "indonesian",
  "chapterCount": "number (required for novels)",
  "apiKey": "string (optional, falls back to environment variable)"
}
```

## Export Features

After generating content, users can export their articles with custom titles and subtitles:

- **Markdown Export**: Client-side download of formatted Markdown files
- **RTF Export**: Server-side generation of Rich Text Format files (compatible with Microsoft Word)

### API Endpoints

### POST `/api/generate`
Generate content based on form data.

### POST `/api/test-key`
Test if a Gemini API key is valid.

### POST `/api/export-docx`
Export content as an RTF file for word processors.

**Request Body:**
```json
{
  "title": "Article Title",
  "subtitle": "Optional Subtitle",
  "content": "Full article content"
}
```

**Response:** RTF file download

**Request Body:**
```json
{
  "apiKey": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key is valid"
}
```

## Settings Page

Access the settings page at `/settings` to:

- Configure your Gemini API key
- Test API key validity
- Get instructions on how to obtain a Gemini API key from Google AI Studio

The API key is stored locally in your browser's localStorage for security.

## Supported Authors

- J.K. Rowling
- George R.R. Martin
- Jane Austen
- Ernest Hemingway
- Toni Morrison
- Haruki Murakami
- Margaret Atwood
- Neil Gaiman
- Chimamanda Ngozi Adichie
- Cormac McCarthy
- Custom (user-defined)

## Development Notes

- Built for Cloudflare Workers deployment
- TypeScript for type safety
- Modern ES modules
- Responsive design
- CORS enabled for API access

## License

ISC
