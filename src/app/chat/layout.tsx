import type { Metadata } from "next";
import React from "react";
import { UI } from "@/data/ui";

export const metadata: Metadata = {
  title: UI.chat.title,
  description:
    "Snakk med 3D KI versjonen av Yosmel Chiang i sanntid med stemme og tale til tekst om prosjekter, arkitektur, utdanning ved Noroff og arbeidsmetodikk.",
  alternates: { canonical: "/chat" },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
