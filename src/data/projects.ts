export type ItemCategory = "independent" | "school";

export interface ProjectItem {
  slug: string;
  title: string;
  year: string;
  category: ItemCategory;
  accent: string;
  ground: string;
  media: {
    poster: string;
    video?: string;
    alt: string;
  };
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  aiNote?: string;
  /**
   * 1-setnings intro som AI Yosmel bruker under prosjektomvisningen ("Vis meg rundt i prosjektene").
   * `audioSrc` er valgfri: hvis et nytt prosjekt ikke har en ferdiginnspilt MP3 ennå,
   * vises og fremheves kortet automatisk i riktig rytme uten feil.
   */
  tour: {
    bubble: string;
    audioSrc?: string;
  };
  /**
   * Ekstra kontekst og grenser som injiseres i AI Yosmel sin systeminstruks for dette prosjektet.
   */
  aiContext?: string[];
}

export type IndexItem = ProjectItem;

/**
 * Legg til nye prosjekter her.
 * Alt annet på siden (kortvisning, kategorifilter, AI Yosmel sin kunnskap,
 * prosjektomvisning, SEO/JSON-LD og /llms.txt) oppdateres automatisk.
 */
const PROJECT_DEFINITIONS: ProjectItem[] = [
  {
    slug: "vgs-bordtennis",
    title: "VGS Bordtennis",
    year: "Pågår",
    category: "independent",
    accent: "#e05633",
    ground: "#1d1a18",
    media: {
      poster: "/projects/vgs-bordtennis-poster.jpg?v=flat",
      video: "/projects/vgs-bordtennis.mp4?v=flat",
      alt: "Storskjerm med poengtavle og mobilvisning i VGS Bordtennis.",
    },
    tags: ["Node.js", "node:sqlite", "Socket.IO", "Pågår"],
    liveUrl: "https://vgsbordtennis.no/kiosk/demo",
    subtitle:
      "Sanntids turneringer og kantineskjerm for videregående skoler.",
    summary:
      "Pågående prosjekt ved Nord-Gudbrandsdal VGS som får elevene opp fra mobilen i friminuttet, med QR kode ved bordet og live storskjerm i kantina.",
    highlights: [
      "Enkel flyt ved bordet med QR kode der begge spillerne bekrefter resultatet, med sjekk mot juks og automatisk frigjøring av glemte bord.",
      "Live storskjerm i kantina via Socket.IO, tilpasset Infoskjermen.no på eldre TV skjermer med animert WebP og ES5 støtte.",
      "Flere skoler på samme instans i Node.js og innebygd SQLite (5 npm pakker), stresstestet med 100 samtidige spillere.",
    ],
    aiNote:
      "Første versjon gikk fra plan til drift på en uke med Spike and Stabilize.",
    tour: {
      audioSrc: "/audio/tour/0.mp3",
      bubble:
        "Vi starter med VGS Bordtennis, et hobbyprosjekt på fritiden med QR kode ved bordet og live storskjerm i kantina.",
    },
    aiContext: [
      "Pågående hobbyprosjekt jeg bygger på fritiden for å få elevene opp fra mobilen og til å spille bordtennis i friminuttet. Flere skoler kan bruke samme løsning med hvert sitt adskilte område (`/?school=<code>` og `/kiosk/<slug>`).",
      "Viktig grense hvis noen spør 'Laget du dette på jobb?' eller 'Betalte skolen for dette?': svar rolig og rett frem at nei, jobben min på skolen er kun IKT drift og support, og VGS Bordtennis er et rent hobbyprosjekt jeg har laget på egen fritid, ulønnet og på eget domene og server. Ikke nevn dette uoppfordret når folk bare spør vanlig om funksjonene i appen.",
      "Slik fungerer kampene ved bordet: spillerne skanner en QR kode ved bordet, legger vekk mobilen mens de spiller, og begge bekrefter poengsummen etterpå (med automatisk godkjenning etter 90 sekunder og sperre mot unaturlig korte sett). Hvis noen glemmer å fullføre et bord, frigjøres det automatisk etter 12 minutter slik at neste par kan spille videre.",
      "Turneringer og racketer: støtter Kongen på haugen, sluttspill og Sveitserstil (med Buchholz), i tillegg til statistikk på hvilke racketer som vinner mest gjennom sesongen.",
      "Teknisk oppsett og storskjermen i kantina (`/kiosk`): bygget i Node.js med innebygd `node:sqlite` (i `WAL` modus) og kun 5 npm pakker, kjørende i Docker på Fly.io. Storskjermen i kantina oppdateres live over Socket.IO og er tilpasset Infoskjermen.no på eldre Samsung TV-er (bruker animert WebP i stedet for `<video>` fordi TV-nettleseren fryser videoer på første bilde, samt ES5 støtte, lokale fonter og nattmodus). Stresstestet med 100 samtidige spillere uten feil.",
      "Personvern (nevn kun kort hvis det er naturlig eller noen spør): midlertidig navn og epost slettes (`NULL`) så snart en arrangør har godkjent eleven, slik at kun en enveis `HMAC-SHA256` hash lagres, og det finnes ingen fritekst-chat.",
    ],
  },
  {
    slug: "ember-booking",
    title: "Ember Booking",
    year: "2026",
    category: "independent",
    accent: "#e05633",
    ground: "#1d1a18",
    media: {
      poster: "/projects/ember-poster.jpg?v=flat",
      alt: "Forsiden og funksjonsoversikten på emberbooking.no.",
    },
    tags: ["Next.js 16", "Frontend", "UX / Design", "Merkevare"],
    liveUrl: "https://emberbooking.no",
    subtitle:
      "Design, frontend, merkevare og brukeropplevelse for norsk bookingsystem.",
    summary:
      "Bookingsystem jeg driver sammen med Kim, med ansvar for design, frontend, markedsføringssider og brukeropplevelse.",
    highlights: [
      "Vedlikeholder og videreutvikler frontenden og markedsføringssidene på emberbooking.no.",
      "Ansvar for visuell identitet, merkevare og designsystemet med fokus på lesbarhet og hierarki.",
      "Jobber løpende med brukeropplevelse og tydelig flyt på tvers av plattformen.",
    ],
    tour: {
      audioSrc: "/audio/tour/1.mp3",
      bubble:
        "Videre har vi Ember Booking, et norsk bookingsystem jeg driver sammen med Kim der jeg har ansvaret for design og frontend.",
    },
    aiContext: [
      "Ember Booking er et norsk bookingsystem jeg driver sammen med Kim.",
      "Min rolle er å vedlikeholde og videreutvikle designet, frontenden, merkevaren og markedsføringssidene på `emberbooking.no` (bygget i Next.js 16), og sørge for at brukeropplevelsen er enkel og ryddig. Ikke si at jeg har bygget selve backend-motoren, smartlås-styringen eller regnskapsintegrasjonene; hold svarene om Ember fokusert på mitt arbeid med design, frontend, merkevare, landingssider, designsystem og brukeropplevelse.",
    ],
  },
  {
    slug: "interaktiv-portefolje",
    title: "Interaktiv Portefølje",
    year: "2026",
    category: "independent",
    accent: "#e05633",
    ground: "#1d1a18",
    media: {
      poster: "/projects/portfolio-poster.jpg?v=flat",
      alt: "Fullskjerms 3D studio og AI-metodikk i Interaktiv Portefølje.",
    },
    tags: ["Next.js 16", "Three.js Worker", "Gemini TTS", "AI-assistert"],
    repoUrl: "https://github.com/yosang/portfolio",
    subtitle:
      "Samtalestyrt grensesnitt med 3D-skannet avatar, stemmekloning og visuell navigasjon.",
    summary:
      "Laget for at du kan snakke med en AI versjon av meg i en vanlig samtale mens den viser deg rundt på siden. Samtidig er oppsettet en praktisk demonstrasjon av hvordan sanntids tale, visuell styring og forankring i egne fagdata kan løse reelle oppgaver innen helse, utdanning og kundeservice.",
    highlights: [
      "Laget for å hjelpe besøkende gjennom innholdet med mindre klikking: AI Yosmel tar deg gjennom en visuell tour av prosjekter, detaljer, svarer på spørsmål og henter frem CV.",
      "Overførbart til helse, skole og handel: samme teknologi kan gi eldre og pårørende muntlig veiledning i helsetjenester, brukes til muntlig trening i skolen, eller fungere som visuell kundeservice i en nettbutikk.",
      "3D-skannet T2-modell med ansikts-blendshapes i en egen OffscreenCanvas Web Worker på 60 fps og klonet stemme, bygget høsten 2026 med faste rammer i AGENTS.md og yosmel-skills.",
    ],
    aiNote:
      "Bygget høsten 2026 med faste rammer i AGENTS.md og yosmel-skills.",
    tour: {
      audioSrc: "/audio/tour/portfolio.mp3",
      bubble:
        "Her er selve porteføljen du er på nå, laget for at du kan snakke med en AI versjon av meg som viser deg rundt.",
    },
    aiContext: [
      "Denne porteføljen (`yosmel.no`, kildekode på `github.com/yosang/portfolio`) utforsker hvordan AI kan gjøre et grensesnitt enklere å bruke: man snakker med AI Yosmel i en vanlig samtale, mens den tar leseren gjennom en visuell tour av prosjekter, åpner detaljer, svarer på spørsmål og henter frem CV uten at man må klikke og lete rundt selv.",
      "Hva teknologien kan brukes til utenfor en portefølje: tanken er å komme nærmere en vanlig samtale der den prater med stemme, henter opp riktig sted på skjermen så du slipper å lete selv, og holder seg kun til godkjente fakta. En nettbutikk kan bruke det i kundeservice eller på telefon for å hjelpe kunder, skoler kan bruke det til muntlig trening, og i helsevesenet kan det gi eldre og pasienter enkel veiledning.",
      "Samtidig var dette prosjektet der jeg høsten 2026 for alvor utfordret meg selv på strukturert AI-assistert utvikling, med egne regler i `AGENTS.md` og `yosmel-skills` (`norsk-tone`, `rolig-design` og `slank-kode`).",
      "Teknisk kjører 3D-skanningen (T2-modell med blendshapes for munnsynk, blunking og uttrykk) på Three.js i en egen `OffscreenCanvas` Web Worker på 60 fps, mens svar og klonet stemme (fra 17 sekunder opptak) strømmes fra Gemini over SSE.",
    ],
  },
  {
    slug: "medcare-clinical",
    title: "MedCare Clinical",
    year: "2026",
    category: "school",
    accent: "#e05633",
    ground: "#1d1a18",
    media: {
      poster: "/projects/medcare-poster.jpg?v=flat",
      alt: "Timebestilling, kalender og egne avtaler i MedCare Clinical.",
    },
    tags: ["C#", ".NET 9", "EF Core", "MySQL", "React"],
    repoUrl: "https://github.com/yosang/medcare-clinical",
    subtitle:
      "Timebestilling på tvers av klinikker og spesialiteter. Eksamensprosjekt i Backend 2026 hos Noroff.",
    summary:
      "Fullstack timebestillingssystem for klinikker levert som eksamensprosjekt i Backend 2026 på Noroff, der pasienter kan søke opp leger og bestille time både som gjest og innlogget bruker.",
    highlights: [
      "REST API i C# og .NET 9 med Entity Framework Core mot MySQL, soft delete ved avbestilling og Swagger.",
      "JWT innlogging med refresh token i cookie, gjestebooking, pasientprofil og eget adminpanel med full CRUD.",
      "React frontend med TanStack Query, Zustand og Zod, satt opp på Vercel mot Azure Web App og Railway.",
    ],
    tour: {
      audioSrc: "/audio/tour/2.mp3",
      bubble:
        "Under skoleprosjekter ligger MedCare Clinical, eksamensprosjektet mitt i backend hos Noroff med legetimer i C# og .NET 9.",
    },
    aiContext: [
      "Levert som eksamensprosjektet mitt i Backend 2026 hos Noroff.",
      "Fullstack timebestillingssystem for klinikker der pasienter kan søke opp leger på tvers av klinikker, byer og spesialiteter, og bestille, endre eller avbestille timer (med soft delete) både som gjest uten bruker og som innlogget pasient. Administratorer har et eget adminpanel med full CRUD for leger, klinikker, spesialiteter og timeavtaler.",
      "Backend er skrevet i C# og `.NET 9` med ASP.NET Core, `Entity Framework Core` mot `MySQL`, JWT innlogging med refresh token i cookie (`POST api/Auth/refresh`) og Swagger dokumentasjon.",
      "Frontenden er bygget i React med `@tanstack/react-query`, `Zustand`, `Zod` og `React Router`, og satt opp på Vercel mot Azure Web App og Railway.",
    ],
  },
  {
    slug: "cinemorra",
    title: "Cinemorra",
    year: "2026",
    category: "school",
    accent: "#e05633",
    ground: "#1d1a18",
    media: {
      poster: "/projects/cinemorra-poster.jpg?v=flat",
      alt: "Filmkatalog med søk, anmeldelser og detaljvisning i Cinemorra.",
    },
    tags: ["Next.js", "TypeScript", "Zustand", "Jest"],
    liveUrl: "https://cinemorra.vercel.app",
    repoUrl: "https://github.com/yosang/cinemorra",
    subtitle:
      "Filmkatalog med utlån, søk og eget adminpanel i Next.js. Skoleprosjekt hos Noroff.",
    summary:
      "Nettside bygget som skoleoppgave i frontend på Noroff der brukere kan bla gjennom og låne filmer, med eget adminpanel for å legge til og redigere filmer.",
    highlights: [
      "Delt opp i Next.js App Router mellom åpne sider og eget adminpanel med middleware, loading og error states.",
      "Server Actions for innlogging og håndtering av filmer, sammen med søk, mørk modus og state i Zustand.",
      "Komponenttester med Jest og React Testing Library, pluss sjekk av accessibility med eslint-plugin-jsx-a11y.",
    ],
    tour: {
      audioSrc: "/audio/tour/3.mp3",
      bubble:
        "Til slutt finner du Cinemorra, en filmkatalog med utlån og eget adminpanel bygget i Next.js og TypeScript.",
    },
    aiContext: [
      "Skoleprosjekt i frontendutvikling hos Noroff bygget i Next.js og TypeScript for å bla gjennom og låne filmer, med et eget adminpanel for å legge til og redigere filmer.",
      "Bruker Next.js App Router med egne rutegrupper for åpne sider og adminpanel (`(home)` og `(dashboard)/admin`), `middleware.ts`, Server Actions for innlogging og håndtering av filmer, `Zustand` for state, mørk modus og komponenttester med `Jest`, `React Testing Library` og `eslint-plugin-jsx-a11y`.",
    ],
  },
];

export const INDEPENDENT_PROJECTS: ProjectItem[] = PROJECT_DEFINITIONS.filter(
  (p) => p.category === "independent"
);

export const SCHOOL_PROJECTS: ProjectItem[] = PROJECT_DEFINITIONS.filter(
  (p) => p.category === "school"
);

/**
 * Alltid sortert i nøyaktig samme rekkefølge som kortene vises på forsiden
 * (Egne først, deretter Skoleprosjekter).
 */
export const PROJECTS: ProjectItem[] = [
  ...INDEPENDENT_PROJECTS,
  ...SCHOOL_PROJECTS,
];

export const ITEMS: IndexItem[] = PROJECTS;

export const PROJECT_TOUR_STEPS: Array<{
  slug: string;
  audioSrc?: string;
  bubble: string;
}> = PROJECTS.map((project) => ({
  slug: project.slug,
  audioSrc: project.tour.audioSrc,
  bubble: project.tour.bubble,
}));

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const projectKeywordTokens = Array.from(
  new Set(
    PROJECTS.flatMap((p) => [
      p.slug,
      ...p.slug.split("-"),
      ...p.title.toLowerCase().split(/\s+/),
    ]).filter((token) => token.length >= 4 && token !== "vgs")
  )
).map(escapeRegExp);

export const SPECIFIC_TOUR_TARGET_RE = new RegExp(
  `\\b(${[...projectKeywordTokens, "cv", "skoleprosjekt"].join("|")})`,
  "i"
);
