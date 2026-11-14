export type ItemCategory = "independent" | "school";

export type AboutSegment = string | { label: string; href: string };

export interface IndexItem {
  slug: string;
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
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  aiNote?: string;
}

export const SITE_URL = "https://yosmel.no";

export const PROFILE = {
  name: "Yosmel Chiang",
  shortName: "Yosmel",
  handle: "yosang",
  email: "yosmelchiang@gmail.com",
  location: "Otta",
  heroHeadline: "Hei, jeg er Yosmel.",
  heroBio:
    "Jeg bruker mange timer på å holde meg i forkant av ny teknologi. Ta gjerne en titt på prosjektene jeg har på gang, og slå av en prat med AI versjonen av meg for å bli kjent.",
  socials: [
    { label: "GitHub", href: "https://github.com/yosang" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/yosmel-chiang/" },
    { label: "Epost", href: "mailto:yosmelchiang@gmail.com" },
  ],
  about: {
    paragraphs: [
      [
        "Jeg heter Yosmel Gutierrez Chiang og bor på Otta. Jeg har fullført en toårig utdanning i backendutvikling hos Noroff, og tar nå frontendutvikling på deltid samme sted. På GitHub har jeg vært ",
        { label: "@yosang", href: "https://github.com/yosang" },
        " siden 2013, med rundt 2 300 bidrag det siste året.",
      ],
      [
        "Til daglig jobber jeg med IKT på Nord-Gudbrandsdal VGS, med drift og support. Ved siden av driver jeg ",
        { label: "Ember Booking", href: "https://emberbooking.no" },
        " sammen med Kim. Der har jeg ansvaret for design, frontend, merkevare, markedsføringssider og brukeropplevelse.",
      ],
    ] as AboutSegment[][],
    stackGroups: [
      {
        label: "Frontend og design",
        items: [
          "TypeScript · Next.js 16 · React 19",
          "CSS Modules · GSAP · Three.js",
          "Figma · UX · Designsystemer · Accessibility",
        ],
      },
      {
        label: "Backend",
        items: [
          "C# · .NET 9 · ASP.NET Core · EF Core",
          "Node.js · Express · Socket.IO",
          "PostgreSQL · MySQL · JWT",
        ],
      },
      {
        label: "Drift og verktøy",
        items: [
          "Docker · Fly.io",
          "Azure · Railway · Vercel",
          "GitHub Actions · Playwright · Git",
        ],
      },
    ],
  },
};

export const PROMPTS: string[] = [
  "Vis meg rundt i prosjektene",
  "Hva gjorde du før du begynte med utvikling?",
  "Hvordan er denne 3D chatten skrudd sammen?",
  "Hva slags utviklerrolle ser du etter?",
];

export const FOLLOW_UP_PROMPTS: Array<{ text: string; match?: RegExp }> = [
  { text: "Hva gjør du i Ember Booking?", match: /prosjekt|frontend|design|figma/i },
  { text: "Hvordan er MedCare Clinical bygget?", match: /ember|backend|noroff|eksamen/i },
  { text: "Hvordan bruker du AI i programvareutvikling?", match: /3d|worker|gemini|utvikling|stack/i },
  { text: "Hva gjorde du før utvikling?", match: /noroff|rolle|utdanning|medcare/i },
  { text: "Hva slags rolle ser du etter?", match: /ekornes|pt|trener|cuba|erfaring/i },
  { text: "Hva er en svakhet du har?", match: /rolle|remote|hybrid|samarbeid/i },
  { text: "Hvordan løste du storskjermen i kantina?", match: /bordtennis/i },
  { text: "Hvordan fungerer 3D chatten?" },
  { text: "Vis meg rundt i prosjektene" },
  { text: "Kan jeg få se CV'en din?" },
];

export const PROJECT_TOUR_STEPS: Array<{
  slug: string;
  audioSrc: string;
  bubble: string;
}> = [
  {
    slug: "vgs-bordtennis",
    audioSrc: "/audio/tour/0.mp3",
    bubble:
      "Vi starter med VGS Bordtennis, et hobbyprosjekt på fritiden med QR kode ved bordet og live storskjerm i kantina.",
  },
  {
    slug: "ember-booking",
    audioSrc: "/audio/tour/1.mp3",
    bubble:
      "Videre har vi Ember Booking, et norsk bookingsystem jeg driver sammen med Kim der jeg har ansvaret for design og frontend.",
  },
  {
    slug: "medcare-clinical",
    audioSrc: "/audio/tour/2.mp3",
    bubble:
      "Under skoleprosjekter ligger MedCare Clinical, eksamensprosjektet mitt i backend hos Noroff med legetimer i C# og .NET 9.",
  },
  {
    slug: "cinemorra",
    audioSrc: "/audio/tour/3.mp3",
    bubble:
      "Til slutt finner du Cinemorra, en filmkatalog med utlån og eget adminpanel bygget i Next.js og TypeScript.",
  },
];

export const ITEMS: IndexItem[] = [
  {
    slug: "vgs-bordtennis",
    year: "Pågår",
    category: "independent",
    accent: "#fbc017",
    ground: "#0e1524",
    media: {
      poster: "/projects/vgs-bordtennis-poster.jpg",
      video: "/projects/vgs-bordtennis.mp4",
      alt: "Storskjerm med poengtavle og mobilvisning i VGS Bordtennis.",
    },
    tags: ["Node.js", "node:sqlite", "Socket.IO", "Pågår"],
    liveUrl: "https://vgsbordtennis.no/kiosk/demo",
    title: "VGS Bordtennis",
    subtitle: "Sanntids turneringer, guilds og kantineskjerm for videregående skoler.",
    summary:
      "Pågående prosjekt ved Nord-Gudbrandsdal VGS som får elevene opp fra mobilen i friminuttet, med QR kode ved bordet, guilds og live storskjerm i kantina.",
    highlights: [
      "Skjermfri flyt ved bordet med QR kode, tosidig resultatbekreftelse, anti-juks og automatisk frigjøring av glemte bord.",
      "Live storskjerm i kantina via Socket.IO, tilpasset Infoskjermen.no på eldre TV skjermer med animert WebP og ES5 støtte.",
      "Flere skoler på samme instans i Node.js og innebygd SQLite (5 npm pakker), stresstestet med 100 samtidige spillere.",
    ],
    aiNote:
      "Første versjon gikk fra plan til drift på en uke med Spike and Stabilize.",
  },
  {
    slug: "ember-booking",
    year: "2026",
    category: "independent",
    accent: "#e4461f",
    ground: "#1a120f",
    media: {
      poster: "/projects/ember-poster.jpg",
      video: "/projects/ember.mp4",
      alt: "Oversikt og bestillingsstatistikk i grensesnittet til Ember Booking.",
    },
    tags: ["Next.js 16", "Frontend", "UX / Design", "Merkevare"],
    liveUrl: "https://emberbooking.no",
    title: "Ember Booking",
    subtitle: "Design, frontend, merkevare og brukeropplevelse for norsk bookingsystem.",
    summary:
      "Bookingsystem jeg driver sammen med Kim, med ansvar for design, frontend, markedsføringssider og brukeropplevelse.",
    highlights: [
      "Vedlikeholder og videreutvikler frontenden og markedsføringssidene på emberbooking.no.",
      "Ansvar for visuell identitet, merkevare og designsystemet med fokus på lesbarhet og hierarki.",
      "Jobber løpende med brukeropplevelse og tydelig flyt på tvers av plattformen.",
    ],
  },
  {
    slug: "medcare-clinical",
    year: "2026",
    category: "school",
    accent: "#14b8a6",
    ground: "#0b181f",
    media: {
      poster: "/projects/medcare-poster.jpg",
      alt: "Timebestilling, kalender og egne avtaler i MedCare Clinical.",
    },
    tags: ["C#", ".NET 9", "EF Core", "MySQL", "React"],
    repoUrl: "https://github.com/yosang/medcare-clinical",
    title: "MedCare Clinical",
    subtitle: "Timebestilling på tvers av klinikker og spesialiteter. Eksamensprosjekt i Backend 2026 hos Noroff.",
    summary:
      "Fullstack timebestillingssystem for klinikker levert som eksamensprosjekt i Backend 2026 på Noroff, der pasienter kan søke opp leger og bestille time både som gjest og innlogget bruker.",
    highlights: [
      "REST API i C# og .NET 9 med Entity Framework Core mot MySQL, soft delete ved avbestilling og Swagger.",
      "JWT innlogging med refresh token i cookie, gjestebooking, pasientprofil og eget adminpanel med full CRUD.",
      "React frontend med TanStack Query, Zustand og Zod, satt opp på Vercel mot Azure Web App og Railway.",
    ],
  },
  {
    slug: "cinemorra",
    year: "2026",
    category: "school",
    accent: "#ef4444",
    ground: "#1c0b0d",
    media: {
      poster: "/projects/cinemorra-poster.jpg",
      alt: "Filmkatalog med søk, anmeldelser og detaljvisning i Cinemorra.",
    },
    tags: ["Next.js", "TypeScript", "Zustand", "Jest"],
    liveUrl: "https://cinemorra.vercel.app",
    repoUrl: "https://github.com/yosang/cinemorra",
    title: "Cinemorra",
    subtitle: "Filmkatalog med utlån, søk og eget adminpanel i Next.js. Skoleprosjekt hos Noroff.",
    summary:
      "Nettside bygget som skoleoppgave i frontend på Noroff der brukere kan bla gjennom og låne filmer, med eget adminpanel for å legge til og redigere filmer.",
    highlights: [
      "Delt opp i Next.js App Router mellom åpne sider og skjermet adminpanel med middleware, loading og error states.",
      "Server Actions for innlogging og håndtering av filmer, sammen med søk, mørk modus og state i Zustand.",
      "Komponenttester med Jest og React Testing Library, pluss sjekk av accessibility med eslint-plugin-jsx-a11y.",
    ],
  },
];
