import type { Metadata } from "next";
import { UI } from "@/data/ui";
import { AboutPageContent } from "@/components/LocalizedPages";

export const metadata: Metadata = {
  title: UI.about.heading,
  description:
    "Om Yosmel Chiang: fullstackutvikler utdannet i backend og frontend ved Noroff, medbygger av Ember Booking og oversikt over teknisk verktøykasse.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
