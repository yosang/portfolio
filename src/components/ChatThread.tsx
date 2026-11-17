"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Download, FileText, Loader2, Mic, Square } from "lucide-react";
import { useCompanion, type ChatTurn } from "@/components/CompanionContext";
import { useLocalizedData } from "@/lib/i18n";

function pickFollowUp(
  messages: ChatTurn[],
  items: Array<{ title: string }>,
  tourPrompt: string,
  followUpPrompts: Array<{ text: string; match?: RegExp }>
): string | null {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant" || !last.content.trim()) return null;

  const hasSeenTour = messages.some(
    (m) =>
      (m.role === "user" &&
        /rundt i prosjekt|vis.*prosjektene|prosjektene dine|around.*projects|show.*projects|your projects|tour.*projects/i.test(
          m.content
        )) ||
      (m.role === "assistant" &&
        items.filter((item) => m.content.includes(item.title)).length >= 2)
  );
  if (!hasSeenTour) return tourPrompt;

  const asked = new Set(
    messages
      .filter((m) => m.role === "user")
      .map((m) => m.content.trim().toLowerCase())
  );
  const hasCv = messages.some((m) => Boolean(m.attachment));
  const assistantCount = messages.filter((m) => m.role === "assistant").length;
  const prevUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const contextText = `${prevUser} ${last.content}`;

  const pool = followUpPrompts.filter((p) => {
    if (p.text === tourPrompt) return false;
    if (asked.has(p.text.toLowerCase())) return false;
    if (p.text.includes("CV") && hasCv) return false;
    return true;
  });

  if (assistantCount >= 2 && !hasCv) {
    const cvItem = pool.find((p) => p.text.includes("CV"));
    if (cvItem) return cvItem.text;
  }

  const topicMatch = pool.find((p) => p.match?.test(contextText));
  if (topicMatch) return topicMatch.text;

  const fallback = pool.find((p) => !p.text.includes("CV") || assistantCount >= 2);
  return fallback?.text ?? null;
}

export function ChatThread({
  className = "",
  tone = "default",
  compact = false,
}: {
  className?: string;
  tone?: "default" | "dark";
  compact?: boolean;
}) {
  const { messages, isStreaming, sendMessage } = useCompanion();
  const { ui, projects: items, tourPrompt, useCasePrompt, followUpPrompts } =
    useLocalizedData();
  const t = ui.chat;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const followUp = !isStreaming
    ? pickFollowUp(messages, items, tourPrompt, followUpPrompts)
    : null;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  const isDark = tone === "dark";

  return (
    <div ref={scrollRef} className={`overflow-y-auto ${className}`} aria-live="polite">
      {messages.length === 0 ? (
        <div className="space-y-3">
          {!compact && (
            <p className={`text-[15px] leading-relaxed ${isDark ? "text-zinc-300" : "text-ink-soft"}`}>
              {t.intro}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {[tourPrompt, useCasePrompt].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className={`rounded-full px-3 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                  isDark
                    ? "border border-white/12 bg-white/[0.06] text-zinc-200 hover:border-white/30 hover:bg-white/[0.12]"
                    : "border border-line bg-paper-raised text-ink hover:border-ink"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {messages.map((m) =>
            m.role === "user" ? (
              <li key={m.id} className="flex justify-end">
                <p
                  className={`max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm leading-snug ${
                    isDark ? "bg-white text-zinc-950 font-medium" : "bg-ink text-paper"
                  }`}
                >
                  {m.content}
                </p>
              </li>
            ) : (
              <li key={m.id} className="flex flex-col items-start gap-1.5">
                {m.content ? (
                  (m.bubbles?.length ? m.bubbles : [m.content]).map((bubble, i) => (
                    <p
                      key={i}
                      className={`max-w-[92%] rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm leading-relaxed ${
                        isDark
                          ? "border border-white/10 bg-white/[0.08] text-zinc-100"
                          : "border border-line bg-paper-raised text-ink"
                      }`}
                    >
                      {bubble}
                    </p>
                  ))
                ) : (
                  isStreaming && (
                    <p
                      className={`px-1 font-mono text-xs ${
                        isDark ? "text-zinc-400" : "text-ink-soft"
                      }`}
                    >
                      {t.thinking}
                    </p>
                  )
                )}
                {m.attachment && Boolean(m.content) && (
                  <a
                    href={m.attachment.href}
                    download={m.attachment.filename}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-0.5 inline-flex max-w-[92%] items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                      isDark
                        ? "border border-white/15 bg-white/[0.08] text-zinc-100 hover:border-[#fbc017]/60 hover:bg-white/[0.14]"
                        : "border border-line bg-paper-raised text-ink hover:border-ink"
                    }`}
                  >
                    <FileText
                      className={`h-4 w-4 shrink-0 ${
                        isDark ? "text-[#fbc017]" : "text-ink"
                      }`}
                    />
                    <span className="truncate">{m.attachment.label}</span>
                    <span
                      className={`ml-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] ${
                        isDark
                          ? "bg-[#fbc017] text-zinc-950 font-semibold"
                          : "bg-ink text-paper"
                      }`}
                    >
                      <Download className="h-3 w-3" />
                      {t.cvDownload}
                    </span>
                  </a>
                )}
              </li>
            )
          )}
        </ol>
      )}
      {followUp && (
        <div className="mt-2.5">
          <button
            type="button"
            onClick={() => sendMessage(followUp)}
            className={`rounded-full px-3 py-1 text-left text-xs transition-colors cursor-pointer ${
              isDark
                ? "border border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:bg-white/[0.11] hover:text-white"
                : "border border-line bg-paper text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {followUp}
          </button>
        </div>
      )}
    </div>
  );
}

export function Composer({
  autoFocus = false,
  tone = "default",
  inputId = "chat-input",
}: {
  autoFocus?: boolean;
  tone?: "default" | "dark";
  inputId?: string;
}) {
  const { isStreaming, sendMessage } = useCompanion();
  const { ui } = useLocalizedData();
  const t = ui.chat;
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = tone === "dark";

  const cleanupMedia = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      cleanupMedia();
    };
  }, [cleanupMedia]);

  useEffect(() => {
    if (!autoFocus) return;
    if (window.matchMedia("(min-width: 640px) and (pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const stopRecording = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    if (isTranscribing) return;
    if (isRecording) {
      stopRecording();
      return;
    }
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
      ];
      const chosenMime =
        typeof MediaRecorder !== "undefined" &&
        typeof MediaRecorder.isTypeSupported === "function"
          ? candidates.find((m) => MediaRecorder.isTypeSupported(m)) || ""
          : "";

      const recorder = chosenMime
        ? new MediaRecorder(stream, { mimeType: chosenMime })
        : new MediaRecorder(stream);

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        const actualMime = recorder.mimeType || chosenMime || "audio/webm";
        cleanupMedia();
        setIsRecording(false);

        const blob = new Blob(chunks, { type: actualMime });
        if (blob.size < 400) return;

        setIsTranscribing(true);
        try {
          const buf = await blob.arrayBuffer();
          const bytes = new Uint8Array(buf);
          let binary = "";
          const chunkSize = 0x8000;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
          }
          const base64 = btoa(binary);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Portfolio-Client": "yosmel-web",
            },
            body: JSON.stringify({ audio: base64, mimeType: actualMime }),
          });
          if (res.ok) {
            const data = (await res.json()) as { text?: string };
            const spoken = data.text?.trim() || "";
            if (spoken) {
              setText((prev) =>
                prev.trim() ? `${prev.trim()} ${spoken}` : spoken
              );
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }
          }
        } catch {
          // ignore network errors on voice transcription
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      stopTimerRef.current = setTimeout(() => {
        stopRecording();
      }, 20_000);
    } catch {
      cleanupMedia();
      setIsRecording(false);
    }
  }, [cleanupMedia, isRecording, isTranscribing, stopRecording]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
      return;
    }
    if (!text.trim() || isTranscribing) return;
    sendMessage(text);
    setText("");
  };

  const activePlaceholder = isRecording
    ? t.micListening
    : isTranscribing
      ? t.micTranscribing
      : t.placeholder;

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <label className="sr-only" htmlFor={inputId}>
        {t.placeholder}
      </label>
      <div className="relative flex min-w-0 flex-1 items-center">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={activePlaceholder}
          autoComplete="off"
          className={`min-w-0 w-full rounded-full py-2 pl-4 pr-10 text-base sm:text-sm outline-none transition-colors focus-visible:outline-none ${
            isDark
              ? "border border-white/14 bg-white/[0.07] text-white placeholder:text-zinc-400 focus:border-white/40"
              : "border border-line bg-paper-raised text-ink placeholder:text-ink-soft focus:border-ink"
          }`}
        />
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isTranscribing}
          title={isRecording ? t.micStop : t.micStart}
          aria-label={isRecording ? t.micStop : t.micStart}
          aria-pressed={isRecording}
          className={`absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors cursor-pointer disabled:cursor-default ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : isDark
                ? "text-zinc-400 hover:bg-white/10 hover:text-white"
                : "text-ink-soft hover:bg-ink/8 hover:text-ink"
          }`}
        >
          {isTranscribing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isRecording ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <button
        type="submit"
        disabled={isStreaming || isTranscribing || isRecording || !text.trim()}
        aria-label={t.send}
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-35 cursor-pointer disabled:cursor-default ${
          isDark
            ? "bg-white text-zinc-950 hover:opacity-90"
            : "bg-ink text-paper hover:opacity-90"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </form>
  );
}
