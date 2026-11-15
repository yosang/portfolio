import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { ITEMS, PROFILE } from "@/data/portfolio";

export const maxDuration = 60;

type Mood = "neutral" | "happy" | "confused" | "thinking";

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

interface ViewportPageContext {
  path?: string;
  title?: string;
  section?: string;
  showing?: string;
}

const DAILY_VOICE_CAP = Number(process.env.DAILY_VOICE_CAP || "25");
const RATE_LIMIT_PER_MIN = 12;
const DAILY_IP_CAP = 60;
const MAX_INPUT_CHARS = 600;

let budgetDay = new Date().toISOString().slice(0, 10);
let voiceUsesToday = 0;
const exhaustedTtsModels = new Set<string>();
const ttsWavCache = new Map<string, string>();
const MAX_TTS_CACHE = 40;
const ipBuckets = new Map<string, { minuteTs: number; minuteCount: number; dayCount: number }>();

function syncBudgetDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== budgetDay) {
    budgetDay = today;
    voiceUsesToday = 0;
    exhaustedTtsModels.clear();
    ipBuckets.clear();
  }
}

function checkIpAllowance(ip: string): boolean {
  syncBudgetDay();
  const now = Date.now();
  const entry = ipBuckets.get(ip) ?? { minuteTs: now, minuteCount: 0, dayCount: 0 };
  if (now - entry.minuteTs > 60_000) {
    entry.minuteTs = now;
    entry.minuteCount = 0;
  }
  if (entry.minuteCount >= RATE_LIMIT_PER_MIN || entry.dayCount >= DAILY_IP_CAP) {
    ipBuckets.set(ip, entry);
    return false;
  }
  entry.minuteCount += 1;
  entry.dayCount += 1;
  ipBuckets.set(ip, entry);
  return true;
}

function checkAndIncrementVoiceBudget(): { allowed: boolean; remaining: number } {
  syncBudgetDay();
  if (voiceUsesToday >= DAILY_VOICE_CAP) {
    return { allowed: false, remaining: 0 };
  }
  voiceUsesToday += 1;
  return { allowed: true, remaining: Math.max(0, DAILY_VOICE_CAP - voiceUsesToday) };
}

const PHRASING_HINTS = [
  "Formuler svaret med dine egne muntlige ord uten å gjenbruke åpningsordene eller setningsoppbyggingen i notatene. Start gjerne første setning rett på det konkrete poenget.",
  "Ordlegg deg avslappet og muntlig med en annen inngang og rytme enn oppsettet i notatene, mens du holder deg strengt til faktaene.",
  "Svar kort og muntlig som i en uformell prat over en kaffekopp. Bytt gjerne om på rekkefølgen av leddene i første setning i forhold til notatene, men behold nøyaktig samme fakta.",
  "Lag en helt egen, naturlig åpning på første setning slik at svaret ikke starter med de samme ordene som kulepunktet i notatene, samtidig som du holder deg 100 % til faktaene.",
];
let phrasingCursor = 0;

function nextPhrasingHint(): string {
  const hint = PHRASING_HINTS[phrasingCursor % PHRASING_HINTS.length];
  phrasingCursor = (phrasingCursor + 1) % PHRASING_HINTS.length;
  return hint;
}

const PERSONA_PATH = path.join(process.cwd(), "src", "data", "persona.md");
let cachedPersona: string | null = null;

function loadPersona(): string {
  if (process.env.NODE_ENV === "production" && cachedPersona) {
    return cachedPersona;
  }
  cachedPersona = fs.readFileSync(PERSONA_PATH, "utf8");
  return cachedPersona;
}

function buildSystemInstruction(page?: ViewportPageContext): string {
  const persona = loadPersona();
  const projectsDigest = ITEMS.map((item, idx) => {
    const urls = [item.liveUrl, item.repoUrl].filter(Boolean).join(" · ");
    const categoryLabel =
      item.category === "school" ? "Skoleprosjekt" : "Eget / samarbeid";
    const notes = item.aiContext?.length
      ? item.aiContext.map((note) => `- ${note}`).join("\n")
      : item.highlights.map((h) => `- ${h}`).join("\n");
    return `### ${idx + 1}. ${item.title} (\`[TOUR:${item.slug}]\`, ${categoryLabel}, ${item.year}${urls ? ` · ${urls}` : ""})
- Kort beskrivelse: ${item.subtitle}
- Oppsummering: ${item.summary}
- Teknologi: ${item.tags.join(", ")}
${notes}`;
  }).join("\n\n");

  const slugList = ITEMS.map((i) => i.slug).join(", ");
  const count = ITEMS.length;

  const viewportNote = page
    ? `\n## Hva besøkende ser på skjermen akkurat nå\n- Side: ${page.path || "/"}\n- Seksjon: ${page.section || "Hero"}\n- Kort på skjermen: ${page.showing || "ingen"}\n(Bruk dette KUN hvis besøkende spør direkte om "dette prosjektet" eller "denne siden". Hopp aldri over prosjekter ved en prosjektomvisning, og nevn aldri hva de ser på uoppfordret.)`
    : "";

  const phrasingHint = nextPhrasingHint();

  return `${persona}

## Prosjektoversikt
${projectsDigest}
${viewportNote}

## Språk og variasjon i denne runden
- Skriv alltid på helt vanlig, muntlig norsk bokmål. Finn aldri på rare sammensatte ord.
- ${phrasingHint}

## Kontrolltagger (obligatorisk)
1. Start hvert svar med én humør-tagg: \`[MOOD:happy]\`, \`[MOOD:neutral]\`, \`[MOOD:confused]\` eller \`[MOOD:thinking]\`.
2. Valgfrie handlingstagger:
   - \`[TOUR:<slug>]\` der slug er en av: ${slugList} (scroller til og åpner prosjektkortet).
     - Enkelt prosjekt: sett \`[TOUR:<slug>]\` først i den første boblen.
     - Full prosjektomvisning (for eksempel "Vis meg rundt i prosjektene" eller "Vis meg prosjektene dine"): gå gjennom alle ${count} prosjektene i rekkefølge ovenfra og ned (${slugList}) fordelt på ${count} korte bobler skilt med \`\\n\\n\`, der hver boble starter med \`[TOUR:<slug>]\` og holdes kort (12 til 16 ord, maks 95 tegn).
   - \`[GO:/about]\`, \`[GO:/ai]\`, \`[GO:/personvern]\`, \`[GO:/]\` eller \`[GO:/chat]\` for å bytte side.
   - \`[FILE:cv]\` KUN når besøkende spør direkte om å få se, lese eller laste ned CV'en din.
3. Skriv 1 til 3 korte bobler skilt med \`\\n\\n\` (eller ${count} korte bobler på 1 setning hver ved full prosjektomvisning). Kun ren tekst uten markdown-overskrifter eller kodeblokker med mindre noen ber om det.`;
}

function sseFrame(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

const DEMO_REPLY =
  "Jeg kjører i demomodus akkurat nå uten API nøkkel.\n\nLegg GEMINI_API_KEY i portfolio/.env.local, så svarer jeg ordentlig.";

const ERROR_REPLY =
  "Noe gikk galt i kontakten med Gemini. Sjekk GEMINI_API_KEY i .env.local og prøv igjen.";

const RATE_LIMIT_REPLY =
  "Rolig i svingene! Jeg trenger en liten pust i bakken, prøv gjerne igjen om et lite minutt.";

function cleanForSpeech(raw: string): string {
  return raw
    .replace(/\bC#/g, "C sharp")
    .replace(/[`*_~]+/g, "")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractWavBase64(res: unknown): string | null {
  const r = res as {
    output_audio?: { data?: string };
    outputs?: Array<{ content?: Array<{ type?: string; data?: string }> }>;
    steps?: Array<{ content?: Array<{ type?: string; data?: string }> }>;
  };
  return (
    r?.output_audio?.data ||
    r?.outputs?.flatMap((o) => o.content || []).find((c) => c.type === "audio")?.data ||
    r?.steps?.flatMap((s) => s.content || []).find((c) => c.type === "audio")?.data ||
    null
  );
}

function moodToSpeechStyle(mood: Mood): string {
  switch (mood) {
    case "happy":
      return "warm, upbeat, and conversational";
    case "confused":
      return "curious, thoughtful, and natural";
    case "thinking":
      return "calm, reflective, and conversational";
    default:
      return "relaxed, friendly, and natural";
  }
}

export async function POST(req: NextRequest) {
  let body: {
    messages?: ClientMessage[];
    page?: ViewportPageContext;
    voice?: boolean;
    previousInteractionId?: string | null;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
    });
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "local";

  const messages = body.messages || [];
  const rawLastMsg =
    [...messages].reverse().find((m) => m.role === "user")?.content?.trim() ||
    "Hei!";
  const lastUserMsg = rawLastMsg.slice(0, MAX_INPUT_CHARS);
  const wantVoice = Boolean(body.voice);
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const configuredVoiceId = process.env.GEMINI_VOICE_ID?.trim();
  const presetFallbackVoice = process.env.GEMINI_PRESET_VOICE?.trim();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!checkIpAllowance(clientIp)) {
          controller.enqueue(
            sseFrame({ mood: "neutral", t: RATE_LIMIT_REPLY, textDone: true, done: true })
          );
          controller.close();
          return;
        }

        if (!apiKey) {
          controller.enqueue(sseFrame({ mood: "happy", demo: true }));
          for (const chunk of DEMO_REPLY.split(/(\s+)/)) {
            controller.enqueue(sseFrame({ t: chunk }));
            await new Promise((r) => setTimeout(r, 18));
          }
          controller.enqueue(sseFrame({ textDone: true, done: true }));
          controller.close();
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = buildSystemInstruction(body.page);

        const priorUserTurns = messages
          .slice(0, -1)
          .filter((m) => m.role === "user")
          .map((m) => m.content.trim().toLowerCase());
        const isRepeatInThread = priorUserTurns.includes(lastUserMsg.trim().toLowerCase());
        const repeatSuffix = isRepeatInThread
          ? "\n\n(Merk: Besøkende har spurt om akkurat dette tidligere i samtalen. Svar med en annen ordlyd og setningsoppbygging enn sist, uten å gjenta forrige svar ordrett.)"
          : "";

        const contextualInput =
          !body.previousInteractionId && messages.length > 1
            ? messages
                .slice(-6)
                .map(
                  (m) =>
                    `${m.role === "user" ? "Besøkende" : PROFILE.shortName}: ${m.content.slice(0, MAX_INPUT_CHARS)}`
                )
                .join("\n") + `\n\nSvar på den siste meldingen fra Besøkende over.${repeatSuffix}`
            : `${lastUserMsg}${repeatSuffix}`;

        const chatModel =
          process.env.GEMINI_CHAT_MODEL?.trim() || "gemini-3.5-flash-lite";
        const defaultThinking = chatModel.includes("flash-lite") ? "minimal" : "low";

        const geminiStream = await ai.interactions.create({
          model: chatModel,
          system_instruction: systemInstruction,
          input: contextualInput,
          generation_config: {
            thinking_level: defaultThinking,
            temperature: 0.8,
          },
          ...(body.previousInteractionId
            ? { previous_interaction_id: body.previousInteractionId }
            : {}),
          stream: true,
        });

        const validSlugs = new Set(ITEMS.map((i) => i.slug));
        let rawStreamBuffer = "";
        let currentBubbleText = "";
        let currentBubbleTour: string | undefined;
        let currentBubbleIndex = 0;
        let moodEmitted = false;
        let detectedMood: Mood = "neutral";
        let fullCleanText = "";
        let fileEmitted = false;
        let interactionId: string | undefined;

        const activeVoice = configuredVoiceId || presetFallbackVoice;
        const voiceModeLabel = configuredVoiceId ? "replicated" : "preset";
        const ttsAi =
          wantVoice && activeVoice
            ? new GoogleGenAI({ apiKey, apiVersion: "v1beta" })
            : null;
        const ttsState: {
          voiceBudget: { allowed: boolean; remaining: number } | null;
          wakeEmitter: (() => void) | null;
        } = {
          voiceBudget: null,
          wakeEmitter: null,
        };
        let hitDailyCap = false;

        const synthesizeWav = async (segmentText: string): Promise<string | null> => {
          if (!ttsAi || !activeVoice || !segmentText) return null;
          const cacheKey = `${activeVoice}:${configuredVoiceId ? "rep" : detectedMood}:${segmentText}`;
          const cached = ttsWavCache.get(cacheKey);
          if (cached) return cached;

          const defaultModel = configuredVoiceId
            ? "gemini-3.8-flash-tts"
            : "gemini-3.8-flash-lite-tts";
          const primaryModel = process.env.GEMINI_TTS_MODEL?.trim() || defaultModel;
          const candidates = (
            primaryModel === "gemini-3.8-flash-lite-tts"
              ? [primaryModel, "gemini-3.8-flash-tts"]
              : [primaryModel]
          ).filter((m) => !exhaustedTtsModels.has(m));

          if (candidates.length === 0) {
            hitDailyCap = true;
            return null;
          }

          for (const candidateModel of candidates) {
            try {
              const contentItem: {
                type: "text";
                text: string;
                annotations?: Array<{ type: "speech_metadata"; style: string }>;
              } = {
                type: "text",
                text: segmentText,
              };
              if (!configuredVoiceId) {
                contentItem.annotations = [
                  {
                    type: "speech_metadata",
                    style: moodToSpeechStyle(detectedMood),
                  },
                ];
              }

              const ttsRes = await ttsAi.interactions.create(
                {
                  model: candidateModel,
                  input: [{ type: "user_input", content: [contentItem] }],
                  response_format: { type: "audio" },
                  generation_config: {
                    speech_config: [{ voice: activeVoice }],
                  },
                },
                { maxRetries: 0, timeout: 15000 }
              );
              const b64 = extractWavBase64(ttsRes);
              if (b64) {
                if (ttsWavCache.size >= MAX_TTS_CACHE) {
                  const oldest = ttsWavCache.keys().next().value;
                  if (oldest) ttsWavCache.delete(oldest);
                }
                ttsWavCache.set(cacheKey, b64);
                return b64;
              }
            } catch (ttsErr) {
              const msg = ttsErr instanceof Error ? ttsErr.message : String(ttsErr);
              if (msg.includes("429") || msg.includes("Rate limit")) {
                if (msg.includes("per day")) {
                  exhaustedTtsModels.add(candidateModel);
                  hitDailyCap = true;
                }
                continue;
              }
              console.error(`[TTS Fallback (${candidateModel})]:`, msg);
              break;
            }
          }
          return null;
        };

        interface TtsBubbleJob {
          index: number;
          tour?: string;
          wavPromise: Promise<string | null>;
        }

        const ttsJobs: TtsBubbleJob[] = [];
        let streamFinishedForTts = false;
        let activeTtsCount = 0;
        const ttsSlotQueue: Array<() => void> = [];

        const acquireTtsSlot = () =>
          new Promise<void>((resolve) => {
            if (activeTtsCount < 2) {
              activeTtsCount += 1;
              resolve();
            } else {
              ttsSlotQueue.push(resolve);
            }
          });

        const releaseTtsSlot = () => {
          const next = ttsSlotQueue.shift();
          if (next) {
            next();
          } else {
            activeTtsCount -= 1;
          }
        };

        const queueBubbleTts = (index: number, rawBubble: string, tour?: string) => {
          if (!wantVoice || !ttsAi) return;
          const speech = cleanForSpeech(rawBubble);
          if (!speech) return;
          if (!ttsState.voiceBudget) {
            ttsState.voiceBudget = checkAndIncrementVoiceBudget();
            if (!ttsState.voiceBudget.allowed) {
              controller.enqueue(sseFrame({ capped: true }));
              return;
            }
          } else if (!ttsState.voiceBudget.allowed) {
            return;
          }

          const wavPromise = (async () => {
            await acquireTtsSlot();
            try {
              return await synthesizeWav(speech);
            } finally {
              releaseTtsSlot();
            }
          })();

          ttsJobs.push({ index, tour, wavPromise });
          ttsState.wakeEmitter?.();
        };

        const ttsEmitterPromise = (async () => {
          let cursor = 0;
          let emittedAudioCount = 0;
          let emittedStepCount = 0;
          while (true) {
            while (cursor < ttsJobs.length) {
              const job = ttsJobs[cursor++];
              const wav = await job.wavPromise;
              if (wav) {
                controller.enqueue(
                  sseFrame({
                    audio: wav,
                    bubbleIndex: job.index,
                    ...(job.tour ? { tour: job.tour } : {}),
                    ...(emittedStepCount > 0 ? { pauseBefore: 0.24 } : {}),
                    mode: voiceModeLabel,
                    remainingVoiceQuota: ttsState.voiceBudget?.remaining ?? 0,
                  })
                );
                emittedAudioCount += 1;
                emittedStepCount += 1;
              } else {
                controller.enqueue(
                  sseFrame({
                    audioSkipped: true,
                    bubbleIndex: job.index,
                    ...(job.tour ? { tour: job.tour } : {}),
                    ...(emittedStepCount > 0 ? { pauseBefore: 0.24 } : {}),
                  })
                );
                emittedStepCount += 1;
              }
            }
            if (streamFinishedForTts && cursor >= ttsJobs.length) break;
            await new Promise<void>((resolve) => {
              ttsState.wakeEmitter = resolve;
            });
            ttsState.wakeEmitter = null;
          }
          if (emittedAudioCount === 0 && hitDailyCap) {
            controller.enqueue(sseFrame({ capped: true }));
          }
        })();

        const processStreamChunk = (chunk: string, final = false) => {
          rawStreamBuffer += chunk;
          let work = rawStreamBuffer;
          rawStreamBuffer = "";

          if (!final) {
            const openIdx = work.lastIndexOf("[");
            if (
              openIdx !== -1 &&
              !work.slice(openIdx).includes("]") &&
              work.length - openIdx < 48
            ) {
              rawStreamBuffer = work.slice(openIdx);
              work = work.slice(0, openIdx);
            }
            const trailingWord = work.match(/[A-Za-zÆØÅæøåéÉ-]{1,24}$/);
            if (trailingWord && trailingWord.index !== undefined && trailingWord.index > 0) {
              rawStreamBuffer = work.slice(trailingWord.index) + rawStreamBuffer;
              work = work.slice(0, trailingWord.index);
            }
            if (work.endsWith("\n")) {
              let trailingNl = 0;
              while (
                trailingNl < work.length &&
                work[work.length - 1 - trailingNl] === "\n"
              ) {
                trailingNl += 1;
              }
              rawStreamBuffer = work.slice(work.length - trailingNl) + rawStreamBuffer;
              work = work.slice(0, work.length - trailingNl);
            }
          }

          work = work
            .replace(/\bkodingen\b/gi, "utviklingen")
            .replace(/\bkoding\b/gi, "utvikling")
            .replace(/\bVgs\b/g, "VGS")
            .replace(/\bidé(en|er|ene)?\b/gi, "ide$1")
            .replace(/\bén\b/gi, (m) => (m[0] === "É" ? "En" : "en"))
            .replace(/\bsømløs(t|e)?\b/gi, "ryddig")
            .replace(/\bdykke\s+(?:dypt\s+)?ned\s+i\b/gi, "jobbe med")
            .replace(/\s*[—–]\s*/g, ", ");

          work = work.replace(/\n([ \t]*\[TOUR:[^\]]+\])/gi, "\n\n$1");
          if (
            currentBubbleTour &&
            currentBubbleText.trim().length > 0 &&
            /^[ \t]*\[TOUR:([^\]]+)\]/i.test(work)
          ) {
            work = "\n\n" + work.trimStart();
          }

          const parts = work.split(/(\n{2,})/);
          for (const part of parts) {
            if (!part) continue;
            if (/^\n{2,}$/.test(part)) {
              if (currentBubbleText.trim().length > 0) {
                fullCleanText += "\n\n";
                controller.enqueue(sseFrame({ t: "\n\n" }));
                queueBubbleTts(currentBubbleIndex, currentBubbleText, currentBubbleTour);
                currentBubbleIndex += 1;
                currentBubbleText = "";
                currentBubbleTour = undefined;
              }
              continue;
            }

            const tagRegex = /\[(MOOD|TOUR|GO|FILE):([^\]]+)\]/gi;
            let m: RegExpExecArray | null;
            while ((m = tagRegex.exec(part)) !== null) {
              const kind = m[1].toUpperCase();
              const val = m[2].trim();
              if (kind === "MOOD") {
                const lower = val.toLowerCase();
                if (
                  lower === "happy" ||
                  lower === "neutral" ||
                  lower === "confused" ||
                  lower === "thinking"
                ) {
                  detectedMood = lower;
                }
                moodEmitted = true;
                controller.enqueue(sseFrame({ mood: detectedMood }));
              } else if (kind === "TOUR") {
                const slug = val.toLowerCase();
                if (validSlugs.has(slug) && !currentBubbleTour) {
                  currentBubbleTour = slug;
                  controller.enqueue(
                    sseFrame({ tourStep: { index: currentBubbleIndex, slug } })
                  );
                }
              } else if (kind === "GO") {
                controller.enqueue(sseFrame({ go: val }));
              } else if (
                kind === "FILE" &&
                val.toLowerCase() === "cv" &&
                !fileEmitted
              ) {
                fileEmitted = true;
                controller.enqueue(sseFrame({ file: "cv" }));
              }
            }

            let cleaned = part.replace(tagRegex, "");
            if (currentBubbleText.length === 0) {
              cleaned = cleaned.replace(/^[ \t\n]+/, "");
            }
            if (cleaned) {
              if (!moodEmitted) {
                moodEmitted = true;
                controller.enqueue(sseFrame({ mood: detectedMood }));
              }
              currentBubbleText += cleaned;
              fullCleanText += cleaned;
              controller.enqueue(sseFrame({ t: cleaned }));
            }
          }

          if (final) {
            if (!moodEmitted) {
              moodEmitted = true;
              controller.enqueue(sseFrame({ mood: detectedMood }));
            }
            if (currentBubbleText.trim().length > 0) {
              queueBubbleTts(currentBubbleIndex, currentBubbleText, currentBubbleTour);
              currentBubbleText = "";
              currentBubbleTour = undefined;
            }
          }
        };

        for await (const event of geminiStream) {
          if (event.event_type === "interaction.created" && event.interaction?.id) {
            interactionId = event.interaction.id;
          } else if (event.event_type === "step.delta") {
            if (event.delta?.type === "text" && event.delta.text) {
              processStreamChunk(event.delta.text, false);
            }
          } else if (event.event_type === "interaction.completed") {
            if (event.interaction?.id) {
              interactionId = event.interaction.id;
            }
          }
        }

        processStreamChunk("", true);
        streamFinishedForTts = true;
        ttsState.wakeEmitter?.();

        if (interactionId) {
          controller.enqueue(sseFrame({ interactionId }));
        }

        controller.enqueue(sseFrame({ textDone: true }));

        await ttsEmitterPromise;

        controller.enqueue(sseFrame({ done: true }));
        controller.close();
      } catch (err) {
        console.error("[/api/chat error]:", err);
        controller.enqueue(
          sseFrame({ mood: "confused", t: ERROR_REPLY, done: true })
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
