import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/LocalizedPages";

export const metadata: Metadata = {
  title: "Personvern",
  description:
    "Personvern på yosmel.no: oversikt over hva som behandles i 3D chatten, og hvorfor verken samtalelogg, lydopptak eller sporingsdata lagres.",
  alternates: { canonical: "/personvern" },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
