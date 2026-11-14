import type { Metadata } from "next";
import { UI } from "@/data/ui";

export const metadata: Metadata = {
  title: UI.chat.title,
  description:
    "Slå av en prat med 3D AI versjonen av Yosmel Chiang om prosjekter, arkitektur og valg av stack.",
  alternates: { canonical: "/chat" },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
