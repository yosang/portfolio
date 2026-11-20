export const AI_PAGE = {
  title: "Hvordan jeg bruker KI",
  lead: [
    "Jeg har fulgt med på KI verktøy lenge, men valgte bevisst å holde dem utenfor gjennom hele den toårige backendutdanningen min fra 2024 til 2026. Målet var at arkitektur, feilsøking og kodekvalitet skulle sitte ordentlig i fingrene før jeg koblet på kodeagenter, så KI ble kun brukt til enkel sparring rundt ideer.",
    "Høsten 2026 bestemte jeg meg for å gi KI assistert programvareutvikling et skikkelig forsøk med tydelige rammer. Da hadde både verktøyene og arbeidsflytene modnet, og når KI tar unna mer av selve skrivingen, får jeg mer tid i begge ender av arbeidet, både til å planlegge arkitekturen godt i starten og til å pusse på detaljene i brukeropplevelsen til slutt.",
  ],
  shift: {
    heading: "Hvor tiden min går",
    beforeLabel: "Før",
    withAiLabel: "Med KI",
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
    "Dette er noe jeg fortsatt utforsker og lærer meg underveis, så tanken er på ingen måte å fremstille det som en fasit eller best practice for KI assistert utvikling. Dette er rett og slett vaner som har fungert godt for meg så langt, og som helt sikkert kommer til å endre seg etter hvert som jeg lærer mer og blir flinkere til å bruke verktøyene.",
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
      body: "Etter mye egen prøving og feiling landet jeg på en rytme som viste seg å være en etablert metode kalt Spike and Stabilize, beskrevet av Dan North. Først bygger jeg en rask førsteversjon hele veien fra database til UI (Spike) for å se om ideen faktisk fungerer. Når kjernefunksjonen sitter, bytter jeg til Stabilize der jeg rydder vekk støy, håndterer edge cases og gjør koden klar for produksjon.",
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
      body: "Når tempoet øker, blir sikkerhetsnettet enda viktigere. Jeg jobber i små, hyppige commits og holder refaktorering adskilt fra ny funksjonalitet, slik at det alltid er trygt å rulle tilbake og lett for andre å følge historikken. Før endringer går i produksjon, sjekker jeg dem med automatiske tester og gjennomgang av kritiske brukerflyter.",
    },
  ],
  security: {
    heading: "Sikkerhet og prompt injection",
    paragraphs: [
      "Å bruke KI til sparring på egen maskin er ganske rett frem. Det blir noe annet så snart du legger en åpen chat ut på nettet, lar den styre hva som skjer på skjermen og lar den svare med din egen klonede stemme. Simon Willison beskriver denne risikoen godt i The Lethal Trifecta. Datalekkasjer skjer når et KI system kombinerer tre ting samtidig, som er tilgang til private data, tekst eller lyd utenfra og mulighet til å sende data videre ut på nettet.",
      "Siden chatten her skal være åpen for alle, må de to andre delene kuttes helt bort. En språkmodell gjetter bare neste ord ut fra sannsynlighet og kan alltid bli lurt, så selve sikkerheten ligger i vanlig TypeScript kode rundt modellen. Modellen har ingen database eller verktøykall ut på nettet og ser kun de åpne tekstene om prosjektene mine. Svarene vises som ren tekst uten eksterne bilder, og nettleseren er låst til å kun snakke med mitt eget domene.",
      "Systemprompten bygges kun av faste filer på serveren, mens alt du skriver eller sier i mikrofonen renses før det sendes inn, og serveren sjekker at tidligere svar i tråden faktisk kommer herfra så ingen kan forfalske samtalen. Modellen får aldri velge frie lenker eller filer selv. Tagger som bytter side eller scroller til prosjekter sjekkes mot en fast liste på både server og klient, CV sendes kun når du faktisk spør etter den, og koden sjekker lengde og innhold før noe går til den klonede stemmen.",
      "Alle kall til Gemini kjører med lagring slått av, og serveren sjekker at forespørselen kommer fra min egen side med faste kvoter per minutt og per dag. Samme tankegang bruker jeg lokalt når jeg jobber med kodeagenter, der jeg holder uprøvde MCP verktøy unna prosjekter med produksjonsnøkler og bruker egne utviklingsnøkler med fast beløpsgrense.",
    ],
    referencePrefix: "Simon Willison skriver godt om dette i",
    referenceLabel: "The Lethal Trifecta",
    referenceHref: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
    caseLinkLabel: "Les mer i caset om Interaktiv Portefølje",
    caseLinkHref: "/prosjekter/interaktiv-portefolje",
  },
  portfolioStance: {
    heading: "Hva som hører hjemme i porteføljen",
    paragraphs: [
      "På GitHub ligger det mange raske eksperimenter der jeg bare tester et verktøy eller en ide i fart. De fungerer fint som kladdebok. Prosjektene jeg viser frem her skal derimot tåle at man ser under panseret, der mine egne valg styrer arkitekturen, flyten og detaljene.",
      "Det samme gjelder det visuelle. Her i porteføljen viser kortene de faktiske sidene, komponentene og funksjonene jeg har laget, slik at du ser mitt arbeid. Der KI er selve poenget, som 3D versjonen av meg på forsiden, er den merket åpent.",
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
      href: "/prosjekter/vgs-bordtennis",
      description:
        "Første versjon gikk fra plan til drift på en uke med en blanding av arkitekturbygging, raske iterasjoner på design og finpuss med KI. Flat kodebase, developerlog.md og AGENTS.md holder konteksten kort mens prosjektet vokser.",
    },
    {
      project: "Ember Booking",
      status: "Håndverk først, KI til slutt",
      href: "/prosjekter/ember-booking",
      description:
        "Her var strategien helt motsatt. Jeg gjorde grunnarbeidet selv, laget assets i Figma og bygde opp designsystemet for hånd. KI brukte jeg først helt til slutt for å fange opp inkonsekvenser og syntaksfeil før deploy.",
    },
    {
      project: "MedCare Clinical og skoleprosjekter",
      status: "Minimalt med KI",
      href: "/prosjekter/medcare-clinical",
      description:
        "Skoleprosjektene er til for å lære. Der bruker jeg nesten ingen KI utover litt sparring underveis, slik at jeg er sikker på at grunnkonseptene sitter ordentlig på egen hånd.",
    },
  ],
  creditPrefix: "Ideen om en egen /ai side er inspirert av",
  creditName: "Charlota Blunarova",
  creditHref: "https://www.blunarova.com/ai",
  ctaTitle: "Vil du høre mer om hvordan jeg jobber?",
  ctaButton: "Spør KI versjonen",
};
