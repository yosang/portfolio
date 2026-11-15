"use client";

import React from "react";
import Link from "next/link";
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
      <aside className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#17211e] text-[#f7f8f8] shadow-[0_8px_28px_rgba(10,18,15,0.22)]">
        <div className="relative h-64 md:h-auto md:flex-1">
          <div className="absolute inset-0">
            <AvatarStage mood={mood} variant="hero" className="h-full w-full" />
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 bg-[#141d1a] p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{PROFILE.name}</span>
            <span className="text-[#9ca0a8]">
              {isStreaming ? t.thinking : UI.moods[mood]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="accent-white"
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

          <p className="leading-relaxed text-[#9ca0a8]">
            {t.disclaimerPrefix}
            <a
              href={`mailto:${PROFILE.email}`}
              className="font-medium text-[#f7f8f8] underline decoration-white/35 underline-offset-3 hover:text-white"
            >
              {t.disclaimerLink}
            </a>
            {t.disclaimerSuffix}{" "}
            <Link
              href="/personvern"
              className="font-medium text-[#f7f8f8] underline decoration-white/35 underline-offset-3 hover:text-white"
            >
              {t.privacyLinkLabel}
            </Link>
            .
          </p>
        </div>
      </aside>

      <section className="surface-card flex min-h-[55vh] flex-col gap-4 rounded-2xl p-5 sm:p-7 md:min-h-0">
        <h1 className="font-display text-2xl font-normal tracking-[-0.025em]">{t.title}</h1>
        {voiceCapped && voiceEnabled && (
          <p className="text-xs text-ink-soft">{t.capped}</p>
        )}
        <ChatThread className="flex-1 border-t border-line pt-4" />
        <Composer autoFocus inputId="studio-chat-input" />
      </section>
    </div>
  );
}
