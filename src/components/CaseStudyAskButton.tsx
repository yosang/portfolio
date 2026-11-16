"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { useCompanionPortfolio } from "@/components/CompanionContext";
import { UI } from "@/data/ui";

export function CaseStudyAskButton({ title }: { title: string }) {
  const { setIsOpen, sendMessage } = useCompanionPortfolio();
  const t = UI.home;

  return (
    <button
      type="button"
      onClick={() => {
        setIsOpen(true);
        sendMessage(t.askAboutPrompt(title));
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/35 cursor-pointer"
    >
      <MessageSquare className="h-3.5 w-3.5 text-ink-soft" />
      <span>Spør AI Yosmel om prosjektet</span>
    </button>
  );
}
