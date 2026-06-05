# Quill™ - AI Writing Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.1.0-green)
![Status](https://img.shields.io/badge/status-active-success)

**Quill™** is an editorial writing instrument powered by AI. Built on Cloudflare Workers and Google Gemini models, it generates professional articles, short stories, and novel outlines with precise author-style mimicry.

**Production Origin:** [https://quill.glassgallery.my.id](https://quill.glassgallery.my.id)

---

## Features

### Content Generation
- **Articles**: Comprehensive, research-quality content.
- **Short Stories**: Narrative fiction with character arcs.
- **News Articles**: In-depth journalistic reporting and concise news briefs.
- **Novel Outlines**: Full chapter breakdown & synopsis with chapter-by-chapter continuity.
- **Chapter Generation**: Interactive chapter drafting with memory of previous plot events.

### Author Style System
Advanced style mimicry with curated prompts for 21+ specific authors:
- **Classic & Literary**: Hemingway, Austen, Orwell, Toni Morrison, etc.
- **Fantasy & Sci-Fi**: Tolkien, G.R.R. Martin, Neil Gaiman, J.K. Rowling.
- **Indonesian Authors**: Pramoedya Ananta Toer, Dee Lestari, Andrea Hirata.
- **Non-Fiction**: Yuval Noah Harari.

### Technical Architecture
- **BYOK (Bring Your Own Key)**: Users provide their own Gemini API key in Settings. The key is stored only in the browser (`localStorage`) and sent per-request via the `X-User-API-Key` header.
- **Persistence**: PostgreSQL (via Prisma) stores drafts and user data. Redis handles transient autosave buffers.
- **Stateful Edge**: Powered by Cloudflare Workers with `driverAdapters` for database connectivity.
- **AI Models**: Uses latest `gemini-2.0-flash-exp` & `gemini-1.5-pro` fallback chain.

### Swiss-Archival UI
- **International Typographic Style**: 12-column grid, hairline 1px rules, sharp 0px corners.
- **Archival Atmosphere**: Fixed paper-grain texture, blueprint construction guides, and corner crop marks.
- **Typography**: Inter Display (weights 300–900) and JetBrains Mono for metadata and indices.
- **Deterministic Ornamentation**: Generative "superformula" specimen shapes unique to each page/result block.

---

## Installation

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Google Gemini API Key

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1999AZZAR/article_generator.git
   cd article_generator
   ```

2. **Setup Environment:**
   Ensure `docker-compose.yml` environment variables align with your local setup.

3. **Launch Environment:**
   ```bash
   docker compose up -d
   ```
   This starts:
   - `quill-dev`: The Cloudflare Worker in development mode (live-reloading).
   - `quill-postgres`: Database for persistent storage.
   - `quill-redis`: Cache for autosave functionality.

4. **Sync Database:**
   ```bash
   docker compose exec quill-dev npx prisma db push
   docker compose exec quill-dev npx prisma generate
   ```

---

## Deployment

Quill is optimized for Cloudflare Workers.

1. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Configure Secrets:**
   ```bash
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put REDIS_URL
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## Project Structure

```bash
src/
├── ui/                # Swiss-Archival Frontend
│   ├── main.ts        # Generator Interface
│   ├── workspace.ts   # Draft Management & Editor
│   ├── styles.ts      # Unified Design System & Components
│   └── i18n.ts        # Multilingual Tables (EN/ID)
├── handler.ts         # API Routing & Auth logic
├── gemini.ts          # AI Orchestration & Prompt Engineering
├── db.ts              # Database/Cache Client Factories
└── auth.ts            # HttpOnly Cookie-based Session Tracking
```

---

## License

MIT License. Created by [Azzar Budiyanto](https://github.com/1999AZZAR).
