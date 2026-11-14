export const AI_PAGE = {
  title: "Hvordan jeg bruker AI",
  lead: [
    "Det siste året har jeg tatt i bruk AI for fullt i måten jeg utvikler på. Jeg lærer fortsatt nye grep hver uke, bommer innimellom når jeg gir for løse rammer, og merker samtidig stor gevinst i hvor mye jeg faktisk får bygget og ferdigstilt.",
    "Ja, AI tar unna mye av kodeskrivinga jeg før gjorde for hånd. Det gir meg mer tid i begge ender av arbeidet: å tenke skikkelig gjennom arkitekturen i starten, og å pusse på detaljene i brukeropplevelsen til slutt.",
  ],
  shift: {
    heading: "Hvor tiden min går",
    beforeLabel: "Før",
    withAiLabel: "Med AI",
    before: [
      { label: "Arkitektur", pct: 15, tone: "bg-zinc-600" },
      { label: "Programvareutvikling og oppsett", pct: 70, tone: "bg-zinc-400" },
      { label: "UX og test", pct: 15, tone: "bg-amber-400/80" },
    ],
    withAi: [
      { label: "Arkitektur og rammer", pct: 35, tone: "bg-[#e4461f]" },
      { label: "Programvareutvikling", pct: 25, tone: "bg-zinc-400" },
      { label: "Testing, UX og finpuss", pct: 40, tone: "bg-emerald-400" },
    ],
    caption:
      "Prompten er bare startskuddet. Slipper du en modell løs uten rammer, produserer den raskt dobbelt så mye kode som nødvendig. Ansvaret for at alt henger sammen er fortsatt mitt.",
  },
  principlesHeading: "Kjørereglene mine",
  principles: [
    {
      title: "Rammer før kode",
      body: "I prosjekter som VGS Bordtennis starter jeg med korte notater om arkitekturen og en egen AGENTS.md med faste regler. En språkmodell vet ikke av seg selv at en Samsung TV i skolekantina fryser <video> elementer på bilde 0 i Infoskjermen.no, eller at hele appen skal klare seg med fem npm pakker. Slike valg må jeg kartlegge og låse på forhånd.",
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
      title: "Slank kode gir kort kontekst",
      body: "Jo flere filer og lag en modell må hoppe mellom, desto fortere mister den oversikten. I VGS Bordtennis er koden bevisst holdt slank i tre flate lag med tydelige seksjoner, slik at jeg kan holde konteksten nede på 100 til 200 linjer om gangen.",
    },
    {
      title: "Strengere tester når tempoet øker",
      body: "Jo fortere koden skrives, desto viktigere blir testene. Før endringer rulles ut i VGS Bordtennis kjører automatiske tester mot en egen SQLite database, pluss en stresstest med 100 samtidige spillere fordelt på to skoler uten feil.",
    },
  ],
  portfolioStance: {
    heading: "Hva som hører hjemme i porteføljen",
    paragraphs: [
      "På GitHub ligger det mange raske eksperimenter der jeg bare tester et verktøy eller en ide i fart. De fungerer fint som kladdebok. Prosjektene jeg viser frem her skal derimot tåle at man ser under panseret, der mine egne valg styrer arkitekturen, flyten og detaljene.",
      "Det samme gjelder det visuelle. I VGS Bordtennis har vi noen genererte tullevideoer på storskjermen i kantina for å fange oppmerksomheten i friminuttet. Her i porteføljen viser kortene de faktiske sidene og funksjonene jeg har laget, slik at du ser mitt arbeid. Der AI er selve poenget, som 3D versjonen av meg på forsiden, er den merket åpent.",
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
