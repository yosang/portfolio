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
    accent: "#fbc017",
    ground: "#0e1524",
    media: {
      poster: "/projects/vgs-bordtennis-poster.jpg",
      video: "/projects/vgs-bordtennis.mp4",
      alt: "Storskjerm med poengtavle og mobilvisning i VGS Bordtennis.",
    },
    tags: ["Node.js", "node:sqlite", "Socket.IO", "Pågår"],
    liveUrl: "https://vgsbordtennis.no/kiosk/demo",
    subtitle:
      "Sanntids turneringer, guilds og kantineskjerm for videregående skoler.",
    summary:
      "Pågående prosjekt ved Nord-Gudbrandsdal VGS som får elevene opp fra mobilen i friminuttet, med QR kode ved bordet, guilds og live storskjerm i kantina.",
    highlights: [
      "Skjermfri flyt ved bordet med QR kode, tosidig resultatbekreftelse, anti-juks og automatisk frigjøring av glemte bord.",
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
      "Ongoing personal hobby project (`hobbyprosjekt` på fritiden) started to get students off their phones and playing table tennis at recess. Built for upper secondary schools with strict multi-school isolation (`/?school=<code>` and `/kiosk/<slug>`).",
      "Boundary rule if asked 'Did you build this at work?' / 'Laget du dette på jobb?' / 'Betalte skolen for dette?': state calmly and matter-of-factly that no, my job at the school is purely ICT operations and support, and VGS Bordtennis is 100% a personal hobby project built in my own spare time, unpaid, on my own domain and server at my own expense. Do NOT volunteer this disclaimer unprompted when visitors simply ask about the app's features, and never use defensive phrasing or suggest any rule conflict.",
      "Screen-free flow at the table: players scan a QR code at the table, play, and both sides confirm the score (with 90s auto-approval and anti-cheat timing guards that catch unrealistically short sets). Forgotten matches automatically free up the table after 12 minutes so the next pair can scan in without the previous pair losing their score form on mobile.",
      "Tournaments, rackets, and guilds: supports `Kongen på haugen` ladder, knockout playoffs, and Swiss system (`Sveitserstil` with Buchholz), plus moderated class guilds and rackets with match stats and seasonal rotation.",
      "Single-source-of-truth architecture and canteen display (`/kiosk`): mutations commit atomically in `node:sqlite` (`WAL` mode) before broadcasting to isolated `school:<schoolId>` Socket.IO rooms. The read-only canteen display is tailored for Infoskjermen.no (animated WebP instead of `<video>` tags so TV WebViews never freeze on frame 0, ES5 fallback, local `.woff2` fonts, and scheduled sleep in `Europe/Oslo`). Runs on Node.js in Docker on Fly.io (`arn`) with only 5 npm packages and stress-tested with 100 concurrent players across 2 schools without errors.",
      "Small privacy detail (mention briefly only when relevant or asked, do not overemphasize): temporary name and email are wiped (`NULL`) once an organizer verifies a student, keeping only a one-way `HMAC-SHA256` hash and zero free-text chat.",
    ],
  },
  {
    slug: "ember-booking",
    title: "Ember Booking",
    year: "2026",
    category: "independent",
    accent: "#e4461f",
    ground: "#1a120f",
    media: {
      poster: "/projects/ember-poster.jpg",
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
      "Ember Booking is a Norwegian booking system that I run together with Kim.",
      "My role is maintaining the design, frontend, and the marketing and branding side of the company (`emberbooking.no` in Next.js 16), and making sure the user experience feels clear and intuitive. Do not claim that I built the backend booking engine, smart-lock hardware integrations, or accounting integrations; keep answers about Ember focused on my design, frontend, branding, marketing pages, design system, and UX work.",
    ],
  },
  {
    slug: "medcare-clinical",
    title: "MedCare Clinical",
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
      "Submitted as my Backend 2026 exam project at Noroff.",
      "Fullstack clinic appointment booking system where patients can search doctors across clinics, cities, and specialties, and book, update, or cancel (soft delete) appointments either as a guest without an account or as a logged-in patient. Admins have full CRUD over doctors, clinics, specialties, categories, cities, and statuses.",
      "Backend: C# on `.NET 9`, ASP.NET Core, `Entity Framework Core` + `MySQL`, `JwtBearer` authentication with refresh token cookies (`POST api/Auth/refresh`), clean separation between guest and authenticated operations, and Swagger docs.",
      "Frontend and deployment: React with `@tanstack/react-query`, `Zustand`, `Zod`, and `React Router`. Deployed across Azure Web App, Railway, and Vercel.",
    ],
  },
  {
    slug: "cinemorra",
    title: "Cinemorra",
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
    subtitle:
      "Filmkatalog med utlån, søk og eget adminpanel i Next.js. Skoleprosjekt hos Noroff.",
    summary:
      "Nettside bygget som skoleoppgave i frontend på Noroff der brukere kan bla gjennom og låne filmer, med eget adminpanel for å legge til og redigere filmer.",
    highlights: [
      "Delt opp i Next.js App Router mellom åpne sider og skjermet adminpanel med middleware, loading og error states.",
      "Server Actions for innlogging og håndtering av filmer, sammen med søk, mørk modus og state i Zustand.",
      "Komponenttester med Jest og React Testing Library, pluss sjekk av accessibility med eslint-plugin-jsx-a11y.",
    ],
    tour: {
      audioSrc: "/audio/tour/3.mp3",
      bubble:
        "Til slutt finner du Cinemorra, en filmkatalog med utlån og eget adminpanel bygget i Next.js og TypeScript.",
    },
    aiContext: [
      "Frontend assignment at Noroff built in Next.js and TypeScript for browsing and borrowing movies, paired with a dedicated admin dashboard.",
      "Uses Next.js App Router route groups (`(home)` and `(dashboard)/admin`), `middleware.ts`, Server Actions for authentication and movie CRUD, `Zustand` state, dark mode, and component testing with `Jest`, `React Testing Library`, and `eslint-plugin-jsx-a11y`.",
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
 * (Egne og samarbeid først, deretter Skoleprosjekter).
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
