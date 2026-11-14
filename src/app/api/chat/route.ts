import { NextRequest } from "next/server";
import { spawn } from "node:child_process";
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

const MIMESIS_LINTER = path.join(
  process.cwd(),
  "..",
  ".agents",
  "vendor",
  "cyze-skills",
  "skills",
  "mimesis",
  "linter"
);

function lintReply(text: string) {
  try {
    const child = spawn("python", [MIMESIS_LINTER], {
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk.toString("utf8");
    });
    child.on("close", (code) => {
      if (code === 1 && out) console.warn(`[mimesis] reply flagged:\n${out}`);
    });
    child.on("error", () => {});
    child.stdin.end(text, "utf8");
  } catch {
    // ignore missing local python in dev
  }
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
  const projectsDigest = ITEMS.map(
    (item) =>
      `- [${item.slug}] ${item.title} (${item.category === "school" ? "Skoleprosjekt" : "Eget / samarbeid"}, ${item.year}): ${item.subtitle} Tags: ${item.tags.join(", ")}. Summary: ${item.summary}`
  ).join("\n");

  const viewportNote = page
    ? `\n## Visitor's live viewport\n- Path: ${page.path || "/"}\n- Visible section: ${page.section || "Hero"}\n- Card on screen: ${page.showing || "none"}\n(ONLY use this if the visitor explicitly asks about "this project", "this page", or asks for a tour. Never mention what they are looking at unprompted.)`
    : "";

  return `${persona}

## Portfolio index
${projectsDigest}
${viewportNote}

## Reply language: Norwegian Bokmål, following the 'Norwegian replies' section. Always answer in Norwegian Bokmål.

## Control tags (mandatory)
1. Start every response with one mood tag: \`[MOOD:happy]\`, \`[MOOD:neutral]\`, \`[MOOD:confused]\` or \`[MOOD:thinking]\`.
2. Optional, right after the mood tag, only when the visitor asks for a tour, a specific project, another page, or your CV:
   - \`[TOUR:<slug>]\` where slug is one of: ${ITEMS.map((i) => i.slug).join(", ")} (scrolls to and highlights that card).
   - \`[GO:/about]\`, \`[GO:/ai]\`, \`[GO:/]\` or \`[GO:/chat]\` to navigate.
   - \`[FILE:cv]\` ONLY when the visitor explicitly asks to see, read, or download your CV / resume.
3. After the tags, write 1 to 3 short bubbles separated by \`\\n\\n\`. Plain text only, no markdown headings or code blocks unless asked.`;
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
    .replace(/[`*_~]+/g, "")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function findFirstSegmentEnd(text: string): number {
  const paraIdx = text.indexOf("\n\n");
  if (paraIdx >= 25) return paraIdx;

  const re = /[.!?](?=\s+[A-ZÆØÅ])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const idx = m.index;
    if (idx < 45) continue;
    if (idx > 220) break;
    const before = text.slice(Math.max(0, idx - 8), idx).toLowerCase();
    if (/(?:\bf\.eks|\bbl\.a|\bca|\bnr|\bkl|\bmfl|\bosv)$/.test(before)) {
      continue;
    }
    return idx + 1;
  }
  return -1;
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

        const contextualInput =
          !body.previousInteractionId && messages.length > 1
            ? messages
                .slice(-6)
                .map(
                  (m) =>
                    `${m.role === "user" ? "Besøkende" : PROFILE.shortName}: ${m.content.slice(0, MAX_INPUT_CHARS)}`
                )
                .join("\n") + `\n\nSvar på den siste meldingen fra Besøkende over.`
            : lastUserMsg;

        const chatModel =
          process.env.GEMINI_CHAT_MODEL?.trim() || "gemini-3.5-flash-lite";
        const defaultThinking = chatModel.includes("flash-lite") ? "minimal" : "low";

        const geminiStream = await ai.interactions.create({
          model: chatModel,
          system_instruction: systemInstruction,
          input: contextualInput,
          generation_config: {
            thinking_level: defaultThinking,
          },
          ...(body.previousInteractionId
            ? { previous_interaction_id: body.previousInteractionId }
            : {}),
          stream: true,
        });

        let headerBuffer = "";
        let headerParsed = false;
        let detectedMood: Mood = "neutral";
        let fullCleanText = "";
        let tailBuffer = "";
        let fileEmitted = false;
        let interactionId: string | undefined;

        const activeVoice = configuredVoiceId || presetFallbackVoice;
        const voiceModeLabel = configuredVoiceId ? "replicated" : "preset";
        const ttsAi =
          wantVoice && activeVoice
            ? new GoogleGenAI({ apiKey, apiVersion: "v1beta" })
            : null;
        let voiceBudget: { allowed: boolean; remaining: number } | null = null;
        let hitDailyCap = false;
        let earlySegmentOffset = 0;
        let earlySegmentPromise: Promise<string | null> | null = null;

        const synthesizeWav = async (segmentText: string): Promise<string | null> => {
          if (!ttsAi || !activeVoice || !segmentText) return null;
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
              if (b64) return b64;
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

        const maybeStartEarlyVoice = () => {
          if (!wantVoice || !ttsAi || earlySegmentPromise || voiceBudget) return;
          const splitAt = findFirstSegmentEnd(fullCleanText);
          if (splitAt <= 0) return;
          voiceBudget = checkAndIncrementVoiceBudget();
          if (!voiceBudget.allowed) return;
          const seg1 = cleanForSpeech(fullCleanText.slice(0, splitAt));
          if (!seg1) return;
          earlySegmentOffset = splitAt;
          earlySegmentPromise = synthesizeWav(seg1);
        };

        const emitBodyChunk = (chunk: string, final = false) => {
          tailBuffer += chunk;
          let hold = "";
          if (!final) {
            const openIdx = tailBuffer.lastIndexOf("[");
            if (
              openIdx !== -1 &&
              !tailBuffer.slice(openIdx).includes("]") &&
              tailBuffer.length - openIdx < 28
            ) {
              hold = tailBuffer.slice(openIdx);
              tailBuffer = tailBuffer.slice(0, openIdx);
            }
          }
          const inlineTagRegex = /\[(MOOD|TOUR|GO|FILE):([^\]]+)\]/gi;
          let m: RegExpExecArray | null;
          while ((m = inlineTagRegex.exec(tailBuffer)) !== null) {
            if (
              m[1].toUpperCase() === "FILE" &&
              m[2].trim().toLowerCase() === "cv" &&
              !fileEmitted
            ) {
              fileEmitted = true;
              controller.enqueue(sseFrame({ file: "cv" }));
            }
          }
          const cleaned = tailBuffer.replace(inlineTagRegex, "");
          tailBuffer = hold;
          if (cleaned) {
            fullCleanText += cleaned;
            controller.enqueue(sseFrame({ t: cleaned }));
            if (!final) maybeStartEarlyVoice();
          }
        };

        const flushHeaderAndEmit = (force = false) => {
          if (headerParsed) return;
          const tagPattern = /^(?:\s*\[(MOOD|TOUR|GO|FILE):([^\]]+)\]\s*)+/i;
          const match = headerBuffer.match(tagPattern);

          if (match) {
            const matchedBlock = match[0];
            const remainder = headerBuffer.slice(matchedBlock.length);
            if (
              !force &&
              remainder.startsWith("[") &&
              !remainder.includes("]") &&
              headerBuffer.length < 110
            ) {
              return;
            }

            const singleTagRegex = /\[(MOOD|TOUR|GO|FILE):([^\]]+)\]/gi;
            let m: RegExpExecArray | null;
            while ((m = singleTagRegex.exec(matchedBlock)) !== null) {
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
                controller.enqueue(sseFrame({ mood: detectedMood }));
              } else if (kind === "TOUR") {
                controller.enqueue(sseFrame({ tour: val }));
              } else if (kind === "GO") {
                controller.enqueue(sseFrame({ go: val }));
              } else if (kind === "FILE" && val.toLowerCase() === "cv" && !fileEmitted) {
                fileEmitted = true;
                controller.enqueue(sseFrame({ file: "cv" }));
              }
            }

            headerParsed = true;
            if (remainder.length > 0) {
              emitBodyChunk(remainder, force);
            }
            headerBuffer = "";
          } else if (
            force ||
            (!headerBuffer.trimStart().startsWith("[") && headerBuffer.length > 4) ||
            headerBuffer.length > 90
          ) {
            headerParsed = true;
            controller.enqueue(sseFrame({ mood: detectedMood }));
            if (headerBuffer.length > 0) {
              emitBodyChunk(headerBuffer, force);
              headerBuffer = "";
            }
          }
        };

        for await (const event of geminiStream) {
          if (event.event_type === "interaction.created" && event.interaction?.id) {
            interactionId = event.interaction.id;
          } else if (event.event_type === "step.delta") {
            if (event.delta?.type === "text" && event.delta.text) {
              if (!headerParsed) {
                headerBuffer += event.delta.text;
                flushHeaderAndEmit(false);
              } else {
                emitBodyChunk(event.delta.text, false);
              }
            }
          } else if (event.event_type === "interaction.completed") {
            if (event.interaction?.id) {
              interactionId = event.interaction.id;
            }
          }
        }

        if (!headerParsed) {
          flushHeaderAndEmit(true);
        }
        if (tailBuffer.length > 0) {
          emitBodyChunk("", true);
        }

        if (interactionId) {
          controller.enqueue(sseFrame({ interactionId }));
        }

        controller.enqueue(sseFrame({ textDone: true }));

        const spokenText = fullCleanText.trim();
        if (process.env.NODE_ENV !== "production") lintReply(spokenText);

        if (wantVoice && spokenText.length > 0 && ttsAi) {
          if (!voiceBudget) {
            voiceBudget = checkAndIncrementVoiceBudget();
          }

          if (!voiceBudget.allowed) {
            controller.enqueue(sseFrame({ capped: true }));
          } else if (earlySegmentPromise) {
            const remainderSpeech = cleanForSpeech(
              fullCleanText.slice(earlySegmentOffset)
            );
            const seg2Promise = remainderSpeech
              ? synthesizeWav(remainderSpeech)
              : Promise.resolve(null);

            const wav1 = await earlySegmentPromise;
            let emittedAny = false;
            if (wav1) {
              emittedAny = true;
              controller.enqueue(
                sseFrame({
                  audio: wav1,
                  mode: voiceModeLabel,
                  remainingVoiceQuota: voiceBudget.remaining,
                })
              );
            }

            const wav2 = await seg2Promise;
            if (wav2) {
              emittedAny = true;
              controller.enqueue(
                sseFrame({
                  audio: wav2,
                  pauseBefore: 0.14,
                  mode: voiceModeLabel,
                  remainingVoiceQuota: voiceBudget.remaining,
                })
              );
            }

            if (!emittedAny && hitDailyCap) {
              controller.enqueue(sseFrame({ capped: true }));
            }
          } else {
            const fullSpeech = cleanForSpeech(spokenText);
            const wav = fullSpeech ? await synthesizeWav(fullSpeech) : null;
            if (wav) {
              controller.enqueue(
                sseFrame({
                  audio: wav,
                  mode: voiceModeLabel,
                  remainingVoiceQuota: voiceBudget.remaining,
                })
              );
            } else if (hitDailyCap) {
              controller.enqueue(sseFrame({ capped: true }));
            }
          }
        }

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
