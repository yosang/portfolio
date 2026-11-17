import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { GoogleGenAI } from "@google/genai";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const OUT_JSON_PATH = path.join(ROOT, "src", "data", "en.generated.json");
const EN_AUDIO_DIR = path.join(ROOT, "public", "audio", "tour", "en");

function loadEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) return;
  const raw = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function sha256(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex").slice(0, 16);
}

const SKIP_EXACT = new Set([
  "independent",
  "school",
  "neutral",
  "happy",
  "confused",
  "thinking",
  "rest",
  "aa",
  "ee",
  "oh",
  "widget",
  "hero",
  "bust",
  "head",
  "VGS Bordtennis",
  "Ember Booking",
  "MedCare Clinical",
  "Cinemorra",
  "Agent Skills",
  "vgs-bordtennis",
  "ember-booking",
  "interaktiv-portefolje",
  "skills",
  "medcare-clinical",
  "cinemorra",
  "Yosmel Chiang",
  "Yosmel",
  "yosang",
  "Otta",
  "GitHub",
  "LinkedIn",
  "@yosang",
  "Node.js",
  "node:sqlite",
  "Socket.IO",
  "Next.js 16",
  "Next.js",
  "TypeScript",
  "Zustand",
  "Jest",
  "C#",
  ".NET 9",
  "EF Core",
  "MySQL",
  "React",
  "SKILL.md",
  "AGENTS.md",
  "Open Source",
  "Three.js Worker",
  "Gemini TTS",
  "Chat",
  "AI",
  "Status",
  "2026",
  "Charlota Blunarova",
  "On AI-Generated Work in Design Portfolios",
  "Spike and Stabilize",
]);

function shouldTranslate(s) {
  if (!s || typeof s !== "string") return false;
  const trimmed = s.trim();
  if (trimmed.length < 2) return false;
  if (SKIP_EXACT.has(trimmed)) return false;
  if (/^(https?:\/\/|mailto:|\/(?!\/)|#)/.test(trimmed)) return false;
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return false;
  if (/^bg-/.test(trimmed)) return false;
  if (/^[a-z0-9_.-]+@[a-z0-9_.-]+$/i.test(trimmed)) return false;
  if (/^@\w+$/.test(trimmed)) return false;
  return true;
}

function extractTranslatableStrings() {
  const files = [
    path.join(ROOT, "src", "data", "ui.ts"),
    path.join(ROOT, "src", "data", "portfolio.ts"),
    path.join(ROOT, "src", "data", "ai.ts"),
    path.join(ROOT, "src", "data", "projects.ts"),
  ];

  const found = new Set();
  const strRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;

  for (const fp of files) {
    let content = fs.readFileSync(fp, "utf8");
    // Strip aiContext arrays and non-UI helper exports at bottom of projects.ts
    content = content.replace(/aiContext:\s*\[[\s\S]*?\],/g, "");
    content = content.replace(/\nexport const INDEPENDENT_PROJECTS[\s\S]*$/, "");
    // Strip import/re-export module specifiers
    content = content.replace(/^import\s+.*$/gm, "");
    content = content.replace(/\bfrom\s+["'][^"']+["']/g, "");

    let m;
    while ((m = strRegex.exec(content)) !== null) {
      try {
        const raw = m[0];
        const val =
          raw[0] === '"'
            ? JSON.parse(raw)
            : JSON.parse(
                '"' +
                  raw
                    .slice(1, -1)
                    .replace(/\\'/g, "'")
                    .replace(/"/g, '\\"') +
                  '"'
              );
        if (shouldTranslate(val)) {
          found.add(val);
        }
      } catch {
        // ignore non-standard string
      }
    }
  }
  return [...found];
}

function extractTourEntries() {
  const content = fs.readFileSync(
    path.join(ROOT, "src", "data", "projects.ts"),
    "utf8"
  );
  const entries = [];
  const tourRegex =
    /slug:\s*"([^"]+)"[\s\S]*?tour:\s*\{\s*(?:audioSrc:\s*"([^"]+)",\s*)?bubble:\s*\n?\s*"([^"]+)"/g;
  let m;
  while ((m = tourRegex.exec(content)) !== null) {
    entries.push({
      slug: m[1],
      audioSrc: m[2] || "",
      noBubble: m[3],
    });
  }
  return entries;
}

function extractWavBase64(res) {
  return (
    res?.output_audio?.data ||
    res?.outputs?.flatMap((o) => o.content || []).find((c) => c.type === "audio")
      ?.data ||
    res?.steps?.flatMap((s) => s.content || []).find((c) => c.type === "audio")
      ?.data ||
    null
  );
}

async function translateBatch(ai, strings) {
  const prompt = `Translate the following Norwegian developer portfolio strings into natural, clear, conversational English.
Rules:
1. Return ONLY a valid JSON array of strings in the EXACT same order and length (${strings.length} items). No markdown code fences, just the raw JSON array.
2. Follow mimesis-principles / natural-copy strictly:
   - ZERO em dashes (—) or en dashes (–). Use commas, colons, parentheses, or periods instead.
   - No AI slop words (delve, leverage, seamless, robust, pivotal, tapestry, realm, comprehensive, cutting-edge).
   - Keep placeholder tokens like {title} intact.
   - Keep project titles ("VGS Bordtennis", "Ember Booking", "MedCare Clinical", "Cinemorra", "Agent Skills") as their exact title ("VGS Bordtennis", etc.), and translate "Interaktiv Portefølje" to "Interactive Portfolio".
   - Translate EVERY sentence of multi-sentence strings completely and faithfully; never summarize or collapse a paragraph into a short tagline.
   - Avoid trailing apostrophes on plural words (like "students'"): rephrase naturally without a dangling apostrophe (e.g., "among students" or "for students").

Input JSON array:
${JSON.stringify(strings, null, 2)}`;

  const chatModel =
    process.env.GEMINI_CHAT_MODEL?.trim() || "gemini-3.5-flash-lite";
  const res = await ai.interactions.create({
    model: chatModel,
    input: prompt,
    generation_config: {
      thinking_level: "minimal",
      temperature: 0.2,
    },
  });

  const rawText =
    res?.outputs
      ?.flatMap((o) => o.content || [])
      .find((c) => c.type === "text")?.text ||
    res?.output_text ||
    "[]";
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed) || parsed.length !== strings.length) {
    throw new Error(
      `Expected ${strings.length} translations, got ${
        Array.isArray(parsed) ? parsed.length : "non-array"
      }`
    );
  }
  return parsed.map((s) => String(s).replace(/\s*[—–]\s*/g, ", "));
}

function cleanEnglishTourForSpeech(text) {
  return text
    .replace(/\bVGS Bordtennis\b/gi, "my high school table tennis project")
    .replace(/\bC#/g, "C sharp")
    .replace(/[`*_~]+/g, "")
    .trim();
}

async function main() {
  loadEnvLocal();
  const existing = fs.existsSync(OUT_JSON_PATH)
    ? JSON.parse(fs.readFileSync(OUT_JSON_PATH, "utf8"))
    : { translations: {}, tourAudioHashes: {} };

  const translations = existing.translations || {};
  const tourAudioHashes = existing.tourAudioHashes || {};

  const allStrings = extractTranslatableStrings();
  const missing = allStrings.filter((s) => !translations[s]);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const voiceId =
    process.env.GEMINI_VOICE_ID?.trim() ||
    process.env.GEMINI_PRESET_VOICE?.trim();

  if (missing.length > 0) {
    if (!apiKey) {
      console.log(
        `[sync-i18n] ${missing.length} new strings found, but GEMINI_API_KEY is not set. Using existing cache.`
      );
    } else {
      console.log(
        `[sync-i18n] Translating ${missing.length} new/updated strings to English...`
      );
      const ai = new GoogleGenAI({ apiKey });
      const BATCH_SIZE = 40;
      for (let i = 0; i < missing.length; i += BATCH_SIZE) {
        const batch = missing.slice(i, i + BATCH_SIZE);
        try {
          const translated = await translateBatch(ai, batch);
          for (let j = 0; j < batch.length; j++) {
            translations[batch[j]] = translated[j];
          }
          console.log(
            `[sync-i18n] Translated ${Math.min(
              i + BATCH_SIZE,
              missing.length
            )}/${missing.length}`
          );
        } catch (err) {
          console.warn(
            `[sync-i18n] Batch translation warning:`,
            err?.message || err
          );
          break;
        }
      }
    }
  } else {
    console.log("[sync-i18n] All text translations up to date (0 API calls).");
  }

  // Prune stale keys that no longer exist in source files
  const activeSet = new Set(allStrings);
  const prunedTranslations = {};
  for (const k of Object.keys(translations)) {
    if (activeSet.has(k)) {
      prunedTranslations[k] = translations[k];
    }
  }

  // Check English tour audio files
  const tourEntries = extractTourEntries();
  fs.mkdirSync(EN_AUDIO_DIR, { recursive: true });

  if (apiKey && voiceId) {
    const ttsAi = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });
    for (const entry of tourEntries) {
      if (!entry.audioSrc) continue;
      const baseName = path.basename(entry.audioSrc);
      const outAudioPath = path.join(EN_AUDIO_DIR, baseName);
      const enBubble = prunedTranslations[entry.noBubble] || entry.noBubble;
      const speechText = cleanEnglishTourForSpeech(enBubble);
      const h = sha256(speechText);

      if (tourAudioHashes[baseName] === h && fs.existsSync(outAudioPath)) {
        continue;
      }

      try {
        console.log(
          `[sync-i18n] Generating English tour audio for ${entry.slug} (${baseName}): "${speechText}"`
        );
        const ttsRes = await ttsAi.interactions.create(
          {
            model: "gemini-3.8-flash-tts",
            input: [
              {
                type: "user_input",
                content: [{ type: "text", text: speechText }],
              },
            ],
            response_format: { type: "audio" },
            generation_config: {
              speech_config: [{ voice: voiceId }],
            },
          },
          { maxRetries: 0, timeout: 20000 }
        );
        const b64 = extractWavBase64(ttsRes);
        if (b64) {
          const wavBuf = Buffer.from(b64, "base64");
          const tmpWav = path.join(EN_AUDIO_DIR, `_tmp_${baseName}.wav`);
          fs.writeFileSync(tmpWav, wavBuf);
          try {
            execFileSync("ffmpeg", [
              "-y",
              "-i",
              tmpWav,
              "-codec:a",
              "libmp3lame",
              "-qscale:a",
              "4",
              outAudioPath,
            ], { stdio: "ignore" });
            fs.unlinkSync(tmpWav);
          } catch {
            // If ffmpeg is unavailable on build server, rename WAV directly (decodeAudioData handles both)
            fs.renameSync(tmpWav, outAudioPath);
          }
          tourAudioHashes[baseName] = h;
          console.log(`[sync-i18n] Saved ${outAudioPath}`);
        }
      } catch (err) {
        console.warn(
          `[sync-i18n] Could not generate tour audio for ${baseName}:`,
          err?.message || err
        );
      }
    }
  }

  fs.writeFileSync(
    OUT_JSON_PATH,
    JSON.stringify(
      {
        translations: prunedTranslations,
        tourAudioHashes,
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}

main().catch((err) => {
  console.warn("[sync-i18n] Non-fatal error:", err?.message || err);
});
