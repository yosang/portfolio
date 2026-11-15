# Yosmel Chiang · Portfolio

Personal portfolio built with Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript, and Three.js. Includes project case studies, AI engineering methodology (`/ai`), privacy overview (`/personvern`), and an interactive 3D avatar running inside an `OffscreenCanvas` Web Worker at 60 fps with real-time streamed responses, cloned voice, and AI speech-to-text via Gemini.

## Local Development

Create `.env.local`:

```env
GEMINI_API_KEY=your_api_key
GEMINI_PRESET_VOICE=Puck
DAILY_VOICE_CAP=25
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local development server on `http://localhost:3000` |
| `npm run build` | Production build |
| `npx tsc --noEmit` | TypeScript typecheck |

## Adding a New Project

All projects are defined in a single source of truth in `src/data/projects.ts` and rendered through the reusable `src/components/ProjectCard.tsx` component. Adding an entry to `PROJECT_DEFINITIONS` in `src/data/projects.ts` automatically updates:

- Project cards and category filters on the home page (`independent` rendered first, followed by `school`)
- AI Yosmel's system knowledge and guided project tour (`[TOUR:<slug>]`)
- Search keyword matching and follow-up prompts in chat
- Structured metadata (`JSON-LD` in `src/app/layout.tsx`) and `/llms.txt`

### Step by Step

1. Place the preview poster image in `public/projects/` (for example `public/projects/new-project-poster.jpg` at a `4:3` aspect ratio such as `1200x900`).
2. Add a new object to `PROJECT_DEFINITIONS` in `src/data/projects.ts`:

```ts
{
  slug: "new-project",
  title: "New Project",
  year: "2026",
  category: "independent", // "independent" or "school"
  accent: "#1b6b57",
  ground: "#17211e",
  media: {
    poster: "/projects/new-project-poster.jpg",
    video: "/projects/new-project.mp4", // optional hover preview video
    alt: "Preview of New Project.",
  },
  tags: ["Next.js", "TypeScript"],
  liveUrl: "https://example.com", // optional
  repoUrl: "https://github.com/yosang/new-project", // optional
  subtitle: "Short one-line subtitle displayed below the card.",
  summary: "Concise summary shown when expanding project details.",
  highlights: [
    "Architecture: First architectural or product highlight.",
    "Details: Second highlight.",
    "Outcome: Third highlight.",
  ],
  repoNote: "Optional note explaining private repository status.",
  aiNote: "Optional note on how AI was used, linked to /ai.",
  tour: {
    bubble:
      "Short 1-sentence spoken intro used during the guided project tour.",
    audioSrc: "/audio/tour/new-project.mp3", // optional pre-generated voice clip
  },
  aiContext: [
    "Detailed technical context and boundaries injected into the AI persona for this project.",
  ],
}
```

## Gotchas

- **3D Avatar Web Worker (`src/workers/avatar.worker.ts`):** The Three.js scene runs inside an `OffscreenCanvas` worker so scrolling and UI interactions stay at 60 fps on the main thread. Do not import DOM-dependent modules inside `avatarEngine.ts` or `avatar.worker.ts`.
- **Pre-generated Project Tour Voice Clips (`public/audio/tour/`):** The guided project tour (`PROJECT_TOUR_STEPS`) plays pre-generated MP3 clips for zero-latency playback without consuming the daily live TTS quota (`DAILY_VOICE_CAP`). All other questions stream live from Gemini with text bubbles revealed synchronously as each TTS audio segment starts playing.
- **Canonical URLs & Indexing:** Every route sets its own canonical URL against `SITE_URL` (`https://yosmel.no`).
