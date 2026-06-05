# Quill™ - AI Writing Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green)
![Status](https://img.shields.io/badge/status-active-success)

**Quill™** is an enterprise-grade AI writing assistant built on Cloudflare Workers and Google Gemini 3 models. It generates professional articles, short stories, and news briefs with precise author style mimicry.

**Live Demo:** [https://article-generator.azzar.workers.dev](https://article-generator.azzar.workers.dev)

---

## Features

### Content Generation
- **Articles**: Comprehensive, research-quality content (1800-2000 words)
- **Short Stories**: Narrative fiction with character arcs (2500-3000 words)
- **News Articles**: In-depth journalistic reporting (1200-1800 words)
- **Short News**: Concise news briefs in 5W1H format (400-600 words)
- **Novel Outlines**: Full chapter breakdown & synopsis
- **Chapter Continuity**: Intelligent story flow that maintains narrative consistency across chapters (using optimized summaries)

### Author Style System
Advanced style mimicry with curated prompts for 21+ specific authors:
- **Classic & Literary**: Hemingway, Austen, Orwell, Toni Morrison, etc.
- **Fantasy & Sci-Fi**: Tolkien, G.R.R. Martin, Neil Gaiman, J.K. Rowling
- **Contemporary**: Stephen King, Murakami, Margaret Atwood
- **Indonesian Authors**: Pramoedya Ananta Toer, Dee Lestari, Andrea Hirata
- **Non-Fiction**: Yuval Noah Harari

### Technical Highlights
- **Prompt Optimization**: Compressed prompts (60% token reduction) for faster generation
- **Smart Context**: Novel chapters use optimized summaries (last 3 chapters only) to prevent token bloat
- **Circuit Breaker**: Removed for stateless edge deployment stability
- **Gemini 3 Powered**: Uses latest `gemini-3-flash-preview` & `gemini-3-pro-preview` models

### UI/UX Design
- **Swiss Editorial System**: International Typographic Style — 12-column grid, hairline 1px rules, sharp 0px corners
- **Typography**: Inter Display at display weights (800) with tight letter-spacing; JetBrains Mono for indices and captions
- **Palette**: Black, White, Signal Red (#FF0000) on a white canvas; no gradients, no shadows, no ornament
- **Numbered Sections**: Editorial chapter numbering (№ 01, 02, 03…) used as wayfinding
- **Mobile Responsive**: Grid collapses to single column under 900px

---

## Installation

### Prerequisites
- Node.js 18+
- Cloudflare Account
- Google Gemini API Key

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1999AZZAR/article_generator.git
   cd article_generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

### Local development with the Cloudflare Tunnel

Production is served through the existing Cloudflare Tunnel at [https://quill.glassgallery.my.id](https://quill.glassgallery.my.id). To run the same origin locally so the tunnel can proxy to it:

```bash
docker build -t quill-dev .
docker run -d --name quill-dev -p 127.0.0.1:8787:8787 --restart unless-stopped \
  -v quill-data:/app/.wrangler quill-dev
# or
docker compose up -d
```

The container exposes `wrangler dev` on `0.0.0.0:8787`. If your `cloudflared` is already running on the host with the tunnel origin set to `http://localhost:8787`, requests to `https://quill.glassgallery.my.id` are forwarded straight into the container. If `cloudflared` runs in its own container, attach it to the compose-managed `tunnel` network so the origin becomes `http://quill-dev:8787`.

---

## Deployment

We use **Wrangler** for direct deployment (GitHub Actions workflow has been removed).

1. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Set API Key (Secret):**
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```

3. **Deploy:**
   ```bash
   npx wrangler deploy
   ```

---

## Project Structure

```bash
article_generator/
├── src/
│   ├── index.ts           # Worker Entry Point
│   ├── handler.ts         # API Route Handlers
│   ├── gemini.ts          # AI Logic & Prompt Engineering
│   └── ui.ts              # Frontend Components (HTML/CSS)
├── public/                # Static Assets
├── PROMPT_OPTIMIZATION.md # Prompt Engineering Documentation
├── wrangler.toml          # Worker Configuration (Ignored in Git)
└── package.json           # Project Dependencies
```

---

## Documentation

- [Prompt Optimization Guide](PROMPT_OPTIMIZATION.md) - Detailed breakdown of how we reduced tokens by 60% while improving quality.
- [Model Verification](MODEL_VERIFICATION.md) - Details on Gemini 3 model usage and validation.

---

## License

MIT License. Created by [Azzar Budiyanto](https://github.com/1999AZZAR).
