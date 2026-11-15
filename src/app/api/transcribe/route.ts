import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 30;

const RATE_LIMIT_PER_MIN = 15;
const DAILY_IP_CAP = 60;
const MAX_AUDIO_BASE64_LEN = 3_000_000;

let budgetDay = new Date().toISOString().slice(0, 10);
const ipBuckets = new Map<
  string,
  { minuteTs: number; minuteCount: number; dayCount: number }
>();

function checkIpAllowance(ip: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== budgetDay) {
    budgetDay = today;
    ipBuckets.clear();
  }
  const now = Date.now();
  const entry = ipBuckets.get(ip) ?? {
    minuteTs: now,
    minuteCount: 0,
    dayCount: 0,
  };
  if (now - entry.minuteTs > 60_000) {
    entry.minuteTs = now;
    entry.minuteCount = 0;
  }
  if (
    entry.minuteCount >= RATE_LIMIT_PER_MIN ||
    entry.dayCount >= DAILY_IP_CAP
  ) {
    ipBuckets.set(ip, entry);
    return false;
  }
  entry.minuteCount += 1;
  entry.dayCount += 1;
  ipBuckets.set(ip, entry);
  return true;
}

const SYSTEM_INSTRUCTION = `Du er en presis tale-til-tekst-transkriberer for porteføljen til programvareutvikleren Yosmel Chiang (yosmel.no).
Oppgave:
- Transkriber talen i lydopptaket ordrett og naturlig til norsk bokmål (eller engelsk/spansk hvis brukeren snakker det). Ikke gjør en påstand om til et spørsmål eller omvendt.
- Rett opp utydelig uttale av fagord og sett naturlig tegnsetting.
- Kjente navn, prosjekter og engelske faguttrykk som ofte uttales midt i norske setninger: Yosmel, Ember Booking, VGS Bordtennis, MedCare Clinical, CineMorra, Agent Skills, open source, skills-repoet, repo, GitHub, AGENTS.md, SKILL.md, Noroff, Otta, Nord-Gudbrandsdal VGS, Ekornes, Kim, Ella, TypeScript, Next.js, React, Three.js, OffscreenCanvas, Web Worker, C#, .NET, ASP.NET Core, Entity Framework, SQLite, PostgreSQL, MySQL, Figma, Tailwind, CSS Modules, Spike and Stabilize, RAG, CV, frontend, backend, fullstack.
- Returner KUN selve den ferdig transkriberte teksten, uten anførselstegn, forklaringer eller kommentarer.
- Hvis opptaket kun inneholder stillhet, støy eller uforståelige lyder, returner kun en helt tom streng.`;

function normalizeMimeType(raw?: string): string {
  if (!raw) return "audio/webm";
  const base = raw.split(";")[0].trim().toLowerCase();
  if (base === "audio/mp4" || base === "video/mp4") return "audio/m4a";
  if (
    base === "audio/webm" ||
    base === "audio/ogg" ||
    base === "audio/wav" ||
    base === "audio/mp3" ||
    base === "audio/mpeg" ||
    base === "audio/m4a" ||
    base === "audio/aac" ||
    base === "audio/flac"
  ) {
    return base;
  }
  return "audio/webm";
}

function extractTextFromInteraction(res: unknown): string {
  const r = res as {
    output_text?: string;
    outputs?: Array<{
      text?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
    steps?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };
  if (typeof r?.output_text === "string" && r.output_text.trim()) {
    return r.output_text.trim();
  }
  const fromOutputs = r?.outputs
    ?.flatMap((o) =>
      typeof o.text === "string"
        ? [o.text]
        : (o.content || []).map((c) => c.text || "")
    )
    .join(" ")
    .trim();
  if (fromOutputs) return fromOutputs;

  const fromSteps = r?.steps
    ?.flatMap((s) => (s.content || []).map((c) => c.text || ""))
    .join(" ")
    .trim();
  return fromSteps || "";
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "local";

  if (!checkIpAllowance(clientIp)) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt og prøv igjen." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Mangler API-nøkkel for tale-til-tekst." },
      { status: 503 }
    );
  }

  let body: { audio?: string; mimeType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  }

  const audioBase64 = typeof body.audio === "string" ? body.audio.trim() : "";
  if (!audioBase64 || audioBase64.length > MAX_AUDIO_BASE64_LEN) {
    return NextResponse.json(
      { error: "Lydopptaket er tomt eller for langt." },
      { status: 400 }
    );
  }

  const mimeType = normalizeMimeType(body.mimeType);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model =
      process.env.GEMINI_TRANSCRIBE_MODEL?.trim() || "gemini-3.5-flash";
    const thinkingLevel = model.includes("flash-lite") ? "minimal" : "low";

    const interaction = await ai.interactions.create({
      model,
      system_instruction: SYSTEM_INSTRUCTION,
      input: [
        {
          type: "user_input",
          content: [
            {
              type: "audio",
              data: audioBase64,
              mime_type: mimeType,
            },
            {
              type: "text",
              text: "Transkriber talen i dette opptaket.",
            },
          ],
        },
      ],
      generation_config: {
        thinking_level: thinkingLevel,
        temperature: 0.1,
      },
      store: false,
    });

    const text = extractTextFromInteraction(interaction)
      .replace(/^["«»„”']+/, "")
      .replace(/["«»„”']+$/, "")
      .trim();

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[/api/transcribe error]:", err);
    return NextResponse.json(
      { error: "Klarte ikke å tolke lydopptaket akkurat nå." },
      { status: 500 }
    );
  }
}
