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
