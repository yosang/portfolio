"use client";

import React from "react";
import { AvatarStage } from "@/components/AvatarStage";
import { ChatThread, Composer } from "@/components/ChatThread";
import { useCompanion } from "@/components/CompanionContext";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

export default function ChatPage() {
  const { messages, mood, isStreaming, voiceEnabled, setVoiceEnabled, voiceCapped, resetChat } =
    useCompanion();
  const t = UI.chat;

  return (
    <div
      data-viewport-section="Chat"
      className="page-enter mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 md:h-[calc(100dvh-5.25rem)] md:grid-cols-[340px_1fr] md:py-8"
    >
      <aside className="flex flex-col overflow-hidden rounded-[22px] border border-white/12 bg-[#212325] text-white shadow-[0_24px_54px_-18px_rgba(16,17,18,0.36)]">
        <div className="relative h-64 md:h-auto md:flex-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,231,201,0.16),transparent_68%)]"
          />
          <div className="absolute inset-0">
            <AvatarStage mood={mood} variant="hero" className="h-full w-full" />
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 bg-[#181a1c] p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{PROFILE.name}</span>
            <span className="text-zinc-400">
              {isStreaming ? t.thinking : UI.moods[mood]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="accent-[#fbc017]"
              />
              {t.sound}
            </label>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={resetChat}
                className="underline underline-offset-4 hover:text-white cursor-pointer"
              >
                {t.clear}
              </button>
            )}
          </div>

          <p className="leading-relaxed text-zinc-400">
            {t.disclaimerPrefix}
            <a
              href={`mailto:${PROFILE.email}`}
              className="font-medium text-zinc-200 underline decoration-white/35 underline-offset-3 hover:text-white"
            >
              {t.disclaimerLink}
            </a>
            {t.disclaimerSuffix}
          </p>
        </div>
      </aside>

      <section className="surface-card flex min-h-[55vh] flex-col gap-4 rounded-[22px] p-5 sm:p-7 md:min-h-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{t.title}</h1>
        {voiceCapped && voiceEnabled && (
          <p className="text-xs text-ink-soft">{t.capped}</p>
        )}
        <ChatThread className="flex-1 border-t border-line pt-4" />
        <Composer autoFocus inputId="studio-chat-input" />
      </section>
    </div>
  );
}
