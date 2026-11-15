import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Personvern",
  description:
    "Hva som behandles og hva som aldri lagres når du besøker yosmel.no eller snakker med AI versjonen av Yosmel.",
  alternates: { canonical: "/personvern" },
};

const PRIVACY_SECTIONS = [
  {
    title: "Ingen lagring av chathistorikk på serveren",
    body: "Meldinger du skriver til AI versjonen av meg og svarene som genereres, lagres aldri i noen database eller loggfil på serveren. Når du lukker nettleserfanen eller trykker på Tøm i chatten, er samtalen borte.",
  },
  {
    title: "Ingen lagring av lydopptak eller stemme",
    body: "Mikrofonen i chatten aktiveres kun når du selv trykker på mikrofonknappen. Så snart du stopper opptaket, skrus mikrofonen helt av i nettleseren. Lydklippet behandles kun i minnet for å gjøre tale om til tekst og slettes umiddelbart etterpå.",
  },
  {
    title: "Hva som lagres lokalt i din egen nettleser",
    body: "Nettsiden bruker ingen informasjonskapsler (cookies) for sporing, analyse eller reklame. To små verdier holdes kun lokalt på din egen enhet for at siden skal fungere praktisk mens du bruker den:",
    bullets: [
      "sessionStorage (yosmel-companion-v4): Husker pågående chat-tråd mens du klikker deg mellom undersidene i samme fane. Slettes automatisk når du lukker fanen.",
      "localStorage (theme): Husker om du har valgt lys eller mørk visning.",
    ],
  },
  {
    title: "Midlertidig kvotevern i arbeidsminnet (RAM)",
    body: "For å beskytte API-kvoten mot automatisert spam holder serveren en enkel teller per IP-adresse i arbeidsminnet (RAM) som tilbakestilles løpende. IP-adresser skrives aldri til disk eller database.",
  },
  {
    title: "Tredjepartsbehandling (Google Gemini API)",
    body: "Når du sender en melding, bruker mikrofonen eller har lyd skrudd på i chatten, sendes forespørselen kryptert (HTTPS) til Google sitt Gemini API for å generere tekstsvar, tolke tale til tekst og lage syntetisk stemme. Kallene for tale-til-tekst og stemmesyntese sendes med lagring deaktivert (store: false).",
  },
];

export default function PrivacyPage() {
  return (
    <article
      data-viewport-section="Personvern"
      className="page-enter mx-auto max-w-3xl space-y-12 px-4 py-14 sm:px-6 md:py-20"
    >
      <section className="space-y-4">
        <h1 className="font-display text-3xl font-normal tracking-[-0.03em] text-ink sm:text-4xl">
          Personvern på yosmel.no
        </h1>
        <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
          Kort fortalt: denne porteføljen har ingen brukerkontoer, ingen
          sporings-cookies og ingen database som lagrer hva du skriver eller
          sier i chatten. Her er en åpen oversikt over nøyaktig hva som skjer
          under panseret.
        </p>
      </section>

      <section className="divide-y divide-line border-y border-line">
        {PRIVACY_SECTIONS.map((sec) => (
          <div key={sec.title} className="space-y-2.5 py-6">
            <h2 className="font-display text-lg font-medium tracking-[-0.015em] text-ink">
              {sec.title}
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {sec.body}
            </p>
            {sec.bullets && (
              <ul className="space-y-1.5 pt-1 text-sm leading-relaxed text-ink-soft">
                {sec.bullets.map((b) => (
                  <li key={b} className="font-mono text-xs sm:text-[13px]">
                    · {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 pt-2 text-sm text-ink-soft">
        <p>
          Spørsmål om personvern kan rettes direkte til{" "}
          <a
            href={`mailto:${PROFILE.email}`}
            className="font-medium text-ink underline underline-offset-4 hover:opacity-75"
          >
            {PROFILE.email}
          </a>
          .
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4 hover:opacity-75"
        >
          <span>Tilbake til forsiden</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </article>
  );
}
