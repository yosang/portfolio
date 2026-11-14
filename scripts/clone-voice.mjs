import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

/**
 * Helper CLI to create a persistent Gemini 3.8 Replicated Voice ID from two WAV files:
 *   1. reference.wav (10–30s of you speaking naturally, 24kHz mono 16-bit WAV recommended)
 *   2. consent.wav   (You saying: "I am the owner of this voice and I consent to Google using this voice to create a synthetic voice model.")
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/clone-voice.mjs ./reference.wav ./consent.wav
 */
async function main() {
  const [, , refPath, consentPath] = process.argv;
  if (!refPath || !consentPath) {
    console.error(
      "Usage: node scripts/clone-voice.mjs <reference.wav> <consent.wav>"
    );
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: Set GEMINI_API_KEY in your environment first.");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });
  const sourceB64 = fs.readFileSync(path.resolve(refPath)).toString("base64");
  const consentB64 = fs
    .readFileSync(path.resolve(consentPath))
    .toString("base64");

  console.log("Uploading voice sample & consent to Gemini 3.8 TTS...");
  const replicatedVoice = await ai.voices.create({
    store: true,
    voice: {
      model: "gemini-3.8-flash-tts",
      type: "replicated",
      display_name: "Portfolio AI Twin Voice",
      replicated: {
        source_audio: {
          mime_type: "audio/wav",
          data: sourceB64,
        },
        consent_audio: {
          mime_type: "audio/wav",
          data: consentB64,
        },
      },
    },
  });

  console.log("\nSuccess! Add this line to portfolio/.env.local:\n");
  console.log(`GEMINI_VOICE_ID=${replicatedVoice.id}\n`);
}

main().catch((err) => {
  console.error("Voice replication failed:", err);
  process.exit(1);
});
