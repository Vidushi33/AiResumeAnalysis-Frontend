# AI Resume Analyzer — Frontend

Next.js frontend for the NestJS AI Resume Analyzer backend.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Enable CORS in your NestJS backend
In your `main.ts`, add this BEFORE `app.listen()`:

```ts
app.enableCors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
});
```

### 3. Run both servers
Terminal 1 — NestJS backend (port 3000):
```bash
cd your-nestjs-project
npm run start:dev
```

Terminal 2 — Next.js frontend (port 3001):
```bash
npm run dev
```

### 4. Open the app
Visit http://localhost:3001

## Features
- Provider selector: OpenAI · Gemini · Claude
- Text mode: paste resume → streams analysis word by word
- PDF mode: upload resume PDF → structured JSON result cards
- Skills, strengths, red flags, suggested roles displayed as cards
- Loading states and error handling throughout
