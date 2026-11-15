import type { AvatarMood } from "@/lib/avatarEngine";

export const UI = {
  nav: { home: "Hjem", projects: "Prosjekter", about: "Om", ai: "AI", chat: "Chat" },
  themeLabel: "Bytt mellom lys og mørk visning",
  moods: {
    neutral: "klar",
    happy: "blid",
    confused: "lurer",
    thinking: "tenker",
  } satisfies Record<AvatarMood, string>,
  home: {
    worksTitle: "Prosjekter",
    filterAll: "Alle",
    filterIndependent: "Egne og samarbeid",
    filterSchool: "Skoleprosjekter",
    spotlit: "Valgt av AI",
    detailsOpen: "Skjul",
    detailsClosed: "Detaljer",
    askAbout: "Spør AI",
    askAboutPrompt: (title: string) => `Fortell kort hvordan du bygde ${title}.`,
    readAiWorkflow: "Les om arbeidsflyten på /ai",
    source: "Kode",
    openLive: "Åpne live",
    openCode: "Se kode",
  },
  about: {
    heading: "Om meg",
    toolkit: "Verktøy",
    ctaTitle: "Lurer du på noe?",
    ctaButton: "Snakk med AI versjonen",
  },
  chat: {
    title: "Snakk med Yosmel",
    intro: "Spør om prosjektene mine, valg av stack eller hvordan jeg jobber.",
    placeholder: "Skriv ditt eget spørsmål…",
    send: "Send",
    you: "Du",
    me: "Yosmel",
    sound: "Lyd",
    clear: "Tøm",
    thinking: "tenker…",
    capped: "Dagens stemmekvote er brukt opp, viser kun tekst resten av dagen.",
    cvLabel: "Yosmel Chiang CV.pdf",
    cvDownload: "Last ned",
    aboutAiLabel: "Om AI versjonen",
    disclaimerPrefix:
      "Her styrer en modell klonet på 17 sekunder av stemmen min og notatene mine. Den hevder den har kontroll, men send en epost til ",
    disclaimerLink: "den ekte meg",
    disclaimerSuffix: " hvis noe faktisk er viktig.",
    howMade: "Teknisk oppsett",
    tech: [
      "3D modell i egen Web Worker",
      "Gemini strømmet svar",
      "Gemini TTS med sanntids lydstrømming",
    ],
    dock: "Spør Yosmel",
    fullView: "Fullskjerm",
    close: "Lukk",
    fullStudio: "Fullskjerm",
  },
  colophon: {
    items: [
      {
        label: "Intensjon og arkitektur",
        value: "Yosmel Chiang",
      },
      {
        label: "Ansikt",
        value: "Skannet i 3D, 2026",
      },
      {
        label: "Stemme",
        value: "Klonet fra 17 sekunder ekte opptak",
      },
      {
        label: "Svarene i chatten",
        value: "Generert der og da, uten at jeg vet hva jeg svarer deg",
      },
    ],
    copyright: "© 2026 Yosmel Chiang og modellene som snakker i mitt navn.",
  },
  networkError: "Fikk ikke svar akkurat nå. Prøv igjen.",
};
