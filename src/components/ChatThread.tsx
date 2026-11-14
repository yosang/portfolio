"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Download, FileText } from "lucide-react";
import { useCompanion, type ChatTurn } from "@/components/CompanionContext";
import { FOLLOW_UP_PROMPTS, PROMPTS } from "@/data/portfolio";
import { UI } from "@/data/ui";

function pickFollowUps(messages: ChatTurn[]): string[] {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant" || !last.content.trim()) return [];

  const asked = new Set(
    messages
      .filter((m) => m.role === "user")
      .map((m) => m.content.trim().toLowerCase())
  );
  const hasCv = messages.some((m) => Boolean(m.attachment));
  const assistantCount = messages.filter((m) => m.role === "assistant").length;
  const prevUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const contextText = `${prevUser} ${last.content}`;

  const pool = FOLLOW_UP_PROMPTS.filter((p) => {
    if (asked.has(p.text.toLowerCase())) return false;
    if (p.text.includes("CV") && hasCv) return false;
    return true;
  });

  const picked: string[] = [];
  const topicMatch = pool.find((p) => p.match?.test(contextText));
  if (topicMatch) picked.push(topicMatch.text);

  if (assistantCount >= 2 && !hasCv) {
    const cvItem = pool.find((p) => p.text.includes("CV") && !picked.includes(p.text));
    if (cvItem && picked.length < 2) picked.push(cvItem.text);
  }

  for (const item of pool) {
    if (picked.length >= 2) break;
    if (!picked.includes(item.text) && (!item.text.includes("CV") || assistantCount >= 2)) {
      picked.push(item.text);
    }
  }
  return picked;
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
  const t = UI.chat;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prompts = PROMPTS;
  const followUps = !isStreaming ? pickFollowUps(messages) : [];

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
          <ul className="flex flex-wrap gap-1.5">
            {(compact ? prompts.slice(0, 2) : prompts).map((prompt) => (
              <li key={prompt}>
                <button
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
              </li>
            ))}
          </ul>
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
      {followUps.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {followUps.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => sendMessage(q)}
                className={`rounded-full px-3 py-1 text-left text-xs transition-colors cursor-pointer ${
                  isDark
                    ? "border border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:bg-white/[0.11] hover:text-white"
                    : "border border-line bg-paper text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
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
  const t = UI.chat;
  const prompts = PROMPTS;
  const [text, setText] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const isDark = tone === "dark";

  useEffect(() => {
    if (text) return;
    const id = setInterval(() => {
      setPromptIdx((i) => (i + 1) % prompts.length);
    }, 4500);
    return () => clearInterval(id);
  }, [text, prompts.length]);

  const activePrompt = prompts[promptIdx % prompts.length] ?? t.placeholder;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !text.trim() && activePrompt) {
      e.preventDefault();
      setText(activePrompt);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <label className="sr-only" htmlFor={inputId}>
        {t.placeholder}
      </label>
      <div className="relative flex min-w-0 flex-1 items-center">
        <input
          id={inputId}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={activePrompt}
          autoFocus={autoFocus}
          autoComplete="off"
          className={`min-w-0 w-full rounded-full py-2 pl-4 pr-13 text-sm outline-none transition-colors focus-visible:outline-none ${
            isDark
              ? "border border-white/14 bg-white/[0.07] text-white placeholder:text-zinc-400 focus:border-white/40"
              : "border border-line bg-paper-raised text-ink placeholder:text-ink-soft focus:border-ink"
          }`}
        />
        {!text && (
          <button
            type="button"
            onClick={() => setText(activePrompt)}
            title={t.tabHint}
            className={`absolute right-2.5 rounded px-1.5 py-0.5 font-mono text-[10px] transition cursor-pointer ${
              isDark
                ? "bg-white/10 text-zinc-300 hover:bg-white/20"
                : "bg-paper-subtle text-ink-soft hover:text-ink"
            }`}
          >
            Tab
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isStreaming || !text.trim()}
        aria-label={t.send}
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-35 cursor-pointer disabled:cursor-default ${
          isDark
            ? "bg-[#fbc017] text-zinc-950 hover:opacity-90"
            : "bg-ink text-paper hover:opacity-90"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </form>
  );
}
