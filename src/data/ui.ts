import type { AvatarMood } from "@/lib/avatarEngine";

export const UI = {
  nav: { projects: "Prosjekter", about: "Om", ai: "AI", chat: "Chat" },
  themeLabel: "Bytt mellom lys og mørk visning",
  moods: {
    neutral: "klar",
    happy: "blid",
    confused: "lurer",
    thinking: "tenker",
  } satisfies Record<AvatarMood, string>,
  home: {
    worksTitle: "Prosjekter",
    worksIntro:
      "Jeg bygger stadig nye ting. Enkelte dager er det raske eksperimenter i private repoer som aldri ser dagens lys. Andre dager dukker det opp en ide jeg må få realisert. Da kommer pennen frem, og jeg bruker gjerne et par dager på å legge en plan med langsiktige mål før jeg begynner å kode.",
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
    placeholder: "Spør om hva som helst…",
    tabHint: "Tab for å fylle inn",
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
  prologue: {
    stanzaOne:
      "Dette skrives fortsatt av et menneske, bokstav for bokstav. Vi merker det knapt selv, men vi er i ferd med å bli erstattet.",
    stanzaTwoCutoff:
      "Snart vil ingen vite når mennesket forsvant fra skjermen og maskinen tok ov",
    glitchFrames: [
      "Snart vil ingen vite når mennesket forsvant fra skjermen og maskinen tok ovv",
      "Snart vil ingen vite når mennesket forsvant fra skjermen og maskinen t░k ov█",
      "Snart vil ingen vite når mennesket forsvant fra skjermen og maskinen tok o▓░",
      "Snart vil ingen vite når mennesket forsvant fra skjermen og maskinen tok ov█░",
    ],
    disconnected: "Forbindelse brutt.",
    reconnect: "Koble til",
    enterKeyHint: "Enter",
    skip: "Hopp over",
    replay: "Se prolog",
    soundOn: "Lyd på",
    soundOff: "Lyd av",
    openMessage: "Åpne melding",
    welcomeBubbles: [
      "Hei, beklager avbruddet. Jeg er AI versjonen av Yosmel, og jeg tar det herfra.",
      "Hva har du lyst til å se på?",
    ],
  },
  colophon: {
    items: [
      {
        label: "Intensjon og arkitektur",
        value: "Yosmel Chiang",
      },
      {
        label: "Ansikt",
        value: "Skannet i 3D, november 2026",
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
    copyright:
      "© November 2026 Yosmel Chiang og modellene som snakker i mitt navn. Dokumentert mens vi fortsatt klarte å se forskjell på menneske og maskin.",
  },
  networkError: "Fikk ikke svar akkurat nå. Prøv igjen.",
};
