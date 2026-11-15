# Yosmel Chiang · Portfolio

Personlig portefølje bygget i Next.js 16, React 19 og TypeScript. Inneholder prosjektoversikt, arbeidsmetodikk med AI (`/ai`), og en interaktiv 3D versjon av meg som kjører på Three.js i en egen `OffscreenCanvas` Web Worker med strømmede tekst og lydsvar via Gemini.

## Kjøre lokalt

Legg inn `.env.local`:

```env
GEMINI_API_KEY=din_nokkel
GEMINI_PRESET_VOICE=Puck
DAILY_VOICE_CAP=25
```

Start utviklingsserveren:

```bash
npm install
npm run dev
```

## Legge til et nytt prosjekt

Alle prosjekter defineres samlet i `src/data/projects.ts` og vises gjennom den gjenbrukbare komponenten `src/components/ProjectCard.tsx`. Når du legger til et nytt prosjekt i `PROJECT_DEFINITIONS` i `src/data/projects.ts`, oppdateres alt annet automatisk:

- Prosjektkortet og kategorifilteret på forsiden (`independent` vises først, deretter `school`)
- AI Yosmel sin kunnskap og prosjektomvisning (`[TOUR:<slug>]`)
- Søkeord og oppfølgingsspørsmål i chatten
- Strukturert metadata (JSON-LD) og `/llms.txt`

### Steg for steg

1. Legg forhåndsvisningsbildet i `public/projects/` (for eksempel `public/projects/nytt-prosjekt-poster.jpg`, gjerne i `4:3` format som `1200x900`).
2. Legg til et nytt objekt i `PROJECT_DEFINITIONS` i `src/data/projects.ts`:

```ts
{
  slug: "nytt-prosjekt",
  title: "Nytt Prosjekt",
  year: "2026",
  category: "independent", // "independent" (Egne) eller "school" (Skoleprosjekter)
  accent: "#3b82f6",
  ground: "#0f172a",
  media: {
    poster: "/projects/nytt-prosjekt-poster.jpg",
    video: "/projects/nytt-prosjekt.mp4", // valgfri hover video
    alt: "Skjermbilde av Nytt Prosjekt.",
  },
  tags: ["Next.js", "TypeScript"],
  liveUrl: "https://eksempel.no", // valgfri
  repoUrl: "https://github.com/yosang/nytt-prosjekt", // valgfri
  subtitle: "Kort undertittel som vises rett under kortet.",
  summary: "Kort oppsummering som vises når man åpner Detaljer.",
  highlights: [
    "Første høydepunkt.",
    "Andre høydepunkt.",
    "Tredje høydepunkt.",
  ],
  aiNote: "Valgfri linje om hvordan AI ble brukt, med lenke til /ai.",
  tour: {
    bubble:
      "Her er Nytt Prosjekt, en kort setning som AI Yosmel viser under omvisningen.",
    audioSrc: "/audio/tour/nytt-prosjekt.mp3", // valgfri ferdiginnspilt MP3
  },
  aiContext: [
    "Tekniske detaljer, arkitekturvalg og avgrensninger som AI Yosmel skal bruke når besøkende spør om prosjektet.",
  ],
}
```
