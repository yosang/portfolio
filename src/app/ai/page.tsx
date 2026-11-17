import type { Metadata } from "next";
import { AI_PAGE } from "@/data/ai";
import { AiPageContent } from "@/components/LocalizedPages";

export const metadata: Metadata = {
  title: AI_PAGE.title,
  description:
    "Hvordan Yosmel Chiang bruker AI i programvareutvikling med faste rammer i AGENTS.md, Spike and Stabilize, vern mot prompt injection, små commits og testing.",
  alternates: { canonical: "/ai" },
};

export default function AiTransparencyPage() {
  return <AiPageContent />;
}
