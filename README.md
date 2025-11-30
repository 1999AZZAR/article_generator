# AI Article Auto Writer

A professional content generation system built on Cloudflare Workers that creates high-quality articles and novel outlines using Google Gemini AI.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Development](#development)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Content Generation
- Article creation with comprehensive coverage (1500-2000 words)
- Novel outline generation with detailed chapter structures
- Individual chapter content generation for novels
- Multi-language support (English and Indonesian)

### Author Style Simulation
- Predefined author selection including international and Indonesian writers
- Custom author input capability
- Consistent writing style maintenance throughout content

### Export Functionality
- Markdown format export for documentation and version control
- Rich Text Format (RTF) export compatible with word processors
- Individual chapter export capability
- Complete novel compilation export

### User Interface
- Responsive design for desktop, tablet, and mobile devices
- Professional dark theme interface
- Comprehensive form validation
- Loading states and error handling

### Technical Features
- Serverless architecture using Cloudflare Workers
- TypeScript implementation for type safety
- RESTful API design
- Secure environment variable management
- Edge computing for performance

## Prerequisites

- Node.js 18.x or later
- npm package manager
- Google Gemini API key
- Cloudflare account (for deployment)

## Installation

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/article_generator.git
   cd article_generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the application in a web browser at `http://localhost:8787`

## Configuration

### Environment Variables

The application requires a Google Gemini API key for content generation:

- `GEMINI_API_KEY`: Your Google Gemini API key

### API Key Setup Options

#### Option 1: Web Interface Configuration
- Access the settings page at `/settings`
- Enter your Gemini API key in the provided field
- The key is stored locally in browser storage

#### Option 2: Cloudflare Environment Variables
```bash
npx wrangler secret put GEMINI_API_KEY
```

#### Option 3: Local Environment File
Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_api_key_here
```

## Usage

### Basic Content Generation

1. Access the application at the deployed URL or local development server
2. Select the content type (Article/Chapter or Novel Outline)
3. Complete the input form:
   - Topic or title
   - Author writing style
   - Content language
   - Optional tags and keywords
   - Optional main idea/plot description
   - Chapter count (for novels)
4. Submit the form to generate content
5. Review the generated content and export as needed

### Novel Writing Workflow

1. Generate a novel outline with desired specifications
2. Review the generated chapter structure and titles
3. Generate content for individual chapters as needed
4. Export chapters separately or compile the complete novel

### Export Options

- **Markdown**: Suitable for documentation, blogging, and version control
- **RTF**: Compatible with Microsoft Word and other word processing applications
- **File Naming**: Automatic naming based on content titles and chapter numbers

## API Reference

### POST `/api/generate`

Generates articles or novel outlines based on provided parameters.

**Request Body:**
```json
{
  "topic": "string",
  "authorStyle": "string",
  "type": "article" | "novel",
  "language": "english" | "indonesian",
  "tags": ["string"],
  "keywords": ["string"],
  "mainIdea": "string",
  "chapterCount": number,
  "apiKey": "string"
}
```

**Response (Article):**
```json
{
  "refinedTags": ["string"],
  "titleSelection": ["string"],
  "subtitleSelection": ["string"],
  "content": "string"
}
```

**Response (Novel):**
```json
{
  "titleSelection": ["string"],
  "synopsis": "string",
  "outline": [
    {
      "chapterNumber": number,
      "title": "string",
      "subtitle": "string"
    }
  ]
}
```

### POST `/api/generate-chapter`

Generates content for individual novel chapters.

**Request Body:**
```json
{
  "chapterNumber": number,
  "chapterTitle": "string",
  "chapterSubtitle": "string",
  "novelTitle": "string",
  "novelSynopsis": "string",
  "apiKey": "string"
}
```

**Response:**
```json
{
  "content": "string"
}
```

### POST `/api/test-key`

Validates the provided Gemini API key.

**Request Body:**
```json
{
  "apiKey": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

### POST `/api/export-docx`

Exports content as an RTF file.

**Request Body:**
```json
{
  "title": "string",
  "subtitle": "string",
  "content": "string"
}
```

**Response:** RTF file download

### POST `/api/export-chapter`

Exports individual chapter content as an RTF file.

**Request Body:**
```json
{
  "chapterNumber": number,
  "chapterTitle": "string",
  "chapterSubtitle": "string",
  "content": "string"
}
```

**Response:** RTF file download

## Deployment

### Cloudflare Workers Deployment

1. Install the Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   npx wrangler auth login
   ```

3. Configure account settings in `wrangler.toml` if needed:
   ```toml
   account_id = "your_account_id"
   ```

4. Set the API key as a secret:
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```

5. Deploy the application:
   ```bash
   npm run build
   npx wrangler deploy
   ```

### Automated Deployment (GitHub Actions)

The repository includes automated deployment configuration.

#### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers permissions
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account identifier
- `GEMINI_API_KEY`: Google Gemini API key

#### Deployment Triggers

- Automatic deployment on pushes to the main branch
- Manual deployment via GitHub Actions workflow dispatch

## Development

### Development Workflow

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Modify source files in the `src/` directory

4. Build and test changes:
   ```bash
   npm run build
   npm run dev
   ```

### Project Structure

```
article_generator/
├── .github/
│   └── workflows/          # CI/CD configuration
├── src/
│   ├── index.ts           # Cloudflare Worker entry point
│   ├── handler.ts         # HTTP request handling and UI
│   ├── gemini.ts          # AI integration and content generation
│   └── pages/
│       └── index.html     # HTML template
├── .gitignore             # Version control exclusions
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── wrangler.toml          # Cloudflare Workers configuration
└── README.md              # Project documentation
```

### Code Standards

- TypeScript with strict type checking
- Consistent code formatting
- Comprehensive error handling
- Modular architecture

## Project Structure

```
article_generator/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── index.ts
│   ├── handler.ts
│   ├── gemini.ts
│   └── pages/
│       └── index.html
├── .gitignore
├── LICENSE
├── package.json
├── tsconfig.json
├── wrangler.toml
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes locally
5. Commit your changes:
   ```bash
   git commit -m "feat: description of changes"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Create a pull request

### Contribution Guidelines

- Follow TypeScript best practices
- Add appropriate error handling
- Update documentation for new features
- Ensure code passes type checking
- Test changes before submission

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

### Documentation Links

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

### Troubleshooting

#### Common Issues

1. **API Key Errors**
   - Verify API key validity and permissions
   - Check API quota limits

2. **Deployment Failures**
   - Confirm Cloudflare account permissions
   - Validate API token scope

3. **Content Generation Issues**
   - Check network connectivity
   - Verify API key configuration

### Getting Help

For questions or issues, please create an issue in the GitHub repository.
