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
| `npm run i18n` | Sync English translations (`src/data/en.generated.json`) and English tour clips |
| `npm run build` | Sync i18n (`prebuild`) and run production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | TypeScript typecheck |

## Adding a New Project

All projects are defined in a single source of truth in `src/data/projects.ts` and rendered through `src/components/ProjectCard.tsx` and `/prosjekter/[slug]`. Adding an entry to `PROJECT_DEFINITIONS` in `src/data/projects.ts` automatically updates:

- Project cards, category filters (`independent` first, followed by `school`), and `/prosjekter/[slug]` case study pages
- AI Yosmel's system knowledge, `[GO:/prosjekter/<slug>]` whitelist, and guided project tour (`[TOUR:<slug>]`)
- Search keyword matching and follow-up prompts in chat
- English translations (`npm run i18n`), structured metadata (`JSON-LD` in `src/app/layout.tsx`), `sitemap.xml`, and `/llms.txt`

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
  caseStudy: {
    role: "Design and full-stack development",
    status: "In production",
    intro: "Two-sentence overview displayed at the top of /prosjekter/new-project.",
    sections: [
      {
        title: "Architecture",
        paragraphs: ["Detailed breakdown of technical decisions."],
        bullets: ["Key highlight: Specific engineering detail."],
      },
    ],
  },
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

- **Shared 3D Avatar Web Worker (`src/workers/avatar.worker.ts`):** One shared Three.js `OffscreenCanvas` worker instance is portaled across the home hero, floating dock, and `/chat` so the 3D model loads once in memory while keeping scrolling at 60 fps. Do not import DOM-dependent modules inside `avatarEngine.ts` or `avatar.worker.ts`.
- **Prompt Injection & Stateless Privacy (`src/lib/apiGuard.ts`):** Visitor messages and viewport state are stripped of control tags and fenced inside `<untrusted_visitor_input>` and `<viewport_state>`, UI action tags (`[GO:...]`, `[TOUR:...]`, `[FILE:cv]`) are enforced against deterministic whitelists on both server and client, and all Gemini API calls run with `store: false`.
- **Pre-generated Project Tour Voice Clips (`public/audio/tour/`):** The guided project tour (`PROJECT_TOUR_STEPS`) plays pre-generated MP3 clips for zero-latency playback without consuming the daily live TTS quota (`DAILY_VOICE_CAP`). All other questions stream live from Gemini with text bubbles revealed synchronously as each TTS audio segment starts playing.
- **Canonical URLs & Indexing:** Every route sets its own canonical URL against `SITE_URL` (`https://yosmel.no`).
