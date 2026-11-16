export const AI_PAGE = {
  title: "Hvordan jeg bruker AI",
  lead: [
    "Det siste året har jeg egentlig brukt AI ganske minimalt. Den har mest vært en sparringspartner når jeg har diskutert ideer og tenkt høyt rundt prosjekter, uten at jeg har tatt ut potensialet i selve utviklingen.",
    "Det var først høsten 2026 at jeg bestemte meg for å gi AI assistert programvareutvikling et ordentlig forsøk med en strukturert metodikk. Når AI tar unna mer av selve skrivingen, får jeg mer tid i begge ender av arbeidet: å legge en skikkelig plan for arkitekturen i starten, og å pusse på detaljene i brukeropplevelsen til slutt.",
  ],
  shift: {
    heading: "Hvor tiden min går",
    beforeLabel: "Før",
    withAiLabel: "Med AI",
    before: [
      { label: "Arkitektur", pct: 15, tone: "bg-zinc-600" },
      { label: "Kode og oppsett", pct: 70, tone: "bg-zinc-400" },
      { label: "UX og test", pct: 15, tone: "bg-amber-400/80" },
    ],
    withAi: [
      { label: "Arkitektur og rammer", pct: 35, tone: "bg-[#e4461f]" },
      { label: "Kode", pct: 25, tone: "bg-zinc-400" },
      { label: "Testing, UX og finpuss", pct: 40, tone: "bg-emerald-400" },
    ],
    caption:
      "Når selve kodeskrivingen går raskere, flyttes mer av arbeidet til starten og slutten. Uten tydelige rammer i forkant og grundig gjennomgang til slutt vokser kodebasen raskt i feil retning.",
  },
  principlesHeading: "Reglene mine",
  principlesIntro:
    "Dette er noe jeg fortsatt utforsker og lærer meg underveis, så tanken er på ingen måte å fremstille det som en fasit eller best practice for AI assistert utvikling. Dette er rett og slett vaner som har fungert godt for meg så langt, og som helt sikkert kommer til å endre seg etter hvert som jeg lærer mer og blir flinkere til å bruke verktøyene.",
  principles: [
    {
      title: "Rammer før kode",
      body: "Før jeg skriver kode eller åpner en agent, kartlegger jeg datamodellen og tekniske begrensninger på papir og i en egen AGENTS.md. En språkmodell kjenner verken målgruppen, sære krav i målplattformen eller hvor slank pakkelisten skal holdes, så slike valg må låses på forhånd.",
      link: {
        label: "Se skills og AGENTS.md på GitHub",
        href: "https://github.com/yosang/skills",
      },
    },
    {
      title: "Spike and Stabilize",
      body: "Etter mye egen prøving og feiling landet jeg på en rytme som viste seg å være en etablert metode kalt Spike and Stabilize, beskrevet av Dan North. Først bygger jeg en rask førsteversjon hele veien fra database til UI (Spike) for å se om ideen faktisk fungerer. Når kjernefunksjonen sitter, bytter jeg til Stabilize: rydder vekk støy, håndterer edge cases og gjør koden klar for produksjon.",
      link: {
        label: "Dan North om Spike and Stabilize",
        href: "https://dannorth.net/blog/on-craftsmanship/",
      },
    },
    {
      title: "Slank kode og en enkelt kilde",
      body: "Jo flere filer og lag en modell må hoppe mellom, desto fortere mister den oversikten. Jeg holder koden flat, samler delte data på ett sted i stedet for å spre dem over flere filer, og rydder unna strukturell støy fortløpende. Det holder konteksten nede på 100 til 200 linjer om gangen og gjør koden enkel å sette seg inn i for både teamet og mitt fremtidige jeg.",
    },
    {
      title: "Små commits og grundige tester",
      body: "Når tempoet øker, blir sikkerhetsnettet enda viktigere. Jeg jobber i små, hyppige commits og holder refaktorering adskilt fra ny funksjonalitet, slik at det alltid er trygt å rulle tilbake og lett for andre å følge historikken. Før endringer rulles ut, verifiseres de med automatiske tester og sjekk av kritiske brukerflyter.",
    },
  ],
  portfolioStance: {
    heading: "Hva som hører hjemme i porteføljen",
    paragraphs: [
      "På GitHub ligger det mange raske eksperimenter der jeg bare tester et verktøy eller en ide i fart. De fungerer fint som kladdebok. Prosjektene jeg viser frem her skal derimot tåle at man ser under panseret, der mine egne valg styrer arkitekturen, flyten og detaljene.",
      "Det samme gjelder det visuelle. Her i porteføljen viser kortene de faktiske sidene, komponentene og funksjonene jeg har laget, slik at du ser mitt arbeid. Der AI er selve poenget, som 3D versjonen av meg på forsiden, er den merket åpent.",
    ],
    referencePrefix: "Randy J. Hunt skriver godt om akkurat dette i",
    referenceLabel: "On AI-Generated Work in Design Portfolios",
    referenceHref:
      "https://www.randyjhunt.com/writing/on-ai-generated-work-in-design-portfolios",
  },
  practiceHeading: "Tre prosjekter, tre ulike strategier",
  practices: [
    {
      project: "VGS Bordtennis",
      status: "Spike and Stabilize",
      href: "https://vgsbordtennis.no/kiosk/demo",
      description:
        "Første versjon gikk fra plan til drift på en uke med en blanding av arkitekturbygging, raske iterasjoner på design og finpuss med AI. Flat kodebase, developerlog.md og AGENTS.md holder konteksten kort mens prosjektet vokser.",
    },
    {
      project: "Ember Booking",
      status: "Håndverk først, AI til slutt",
      href: "https://emberbooking.no",
      description:
        "Her var strategien helt motsatt. Jeg gjorde grunnarbeidet selv, laget assets i Figma og bygde opp designsystemet for hånd. AI brukte jeg først helt til slutt for å fange opp inkonsekvenser og syntax feil før utrulling.",
    },
    {
      project: "MedCare Clinical og skoleprosjekter",
      status: "Minimalt med AI",
      href: "https://github.com/yosang/medcare-clinical",
      description:
        "Skoleprosjektene er til for å lære. Der bruker jeg nesten ingen AI utover litt sparring underveis, slik at jeg er sikker på at grunnkonseptene sitter ordentlig på egen hånd.",
    },
  ],
  creditPrefix: "Ideen om en egen /ai side er inspirert av",
  creditName: "Charlota Blunarova",
  creditHref: "https://www.blunarova.com/ai",
  ctaTitle: "Vil du høre mer om hvordan jeg jobber?",
  ctaButton: "Spør AI versjonen",
};
