export {
  INDEPENDENT_PROJECTS,
  ITEMS,
  PROJECTS,
  PROJECT_TOUR_STEPS,
  SCHOOL_PROJECTS,
  SPECIFIC_TOUR_TARGET_RE,
  type IndexItem,
  type ItemCategory,
  type ProjectItem,
} from "@/data/projects";

export type AboutSegment = string | { label: string; href: string };

export const SITE_URL = "https://yosmel.no";

export const PROFILE = {
  name: "Yosmel Chiang",
  shortName: "Yosmel",
  handle: "yosang",
  email: "yosmelchiang@gmail.com",
  location: "Otta",
  heroHeadline: "Hei, Yosmel her,",
  heroBio:
    "Som programvareutvikler er jeg opptatt av ryddig arkitektur, tydelig design og løsninger som faktisk blir brukt. Ta en titt på prosjektene mine, og slå gjerne av en prat med AI versjonen av meg.",
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

export const TOUR_PROMPT = "Vis meg rundt i prosjektene";
export const USE_CASE_PROMPT =
  "Hva kan denne AI teknologien brukes til i praksis?";

export const USE_CASE_STEPS: Array<{ audioSrc: string; bubble: string }> = [
  {
    audioSrc: "/audio/usecase-0.mp3",
    bubble:
      "Tanken er å komme nærmere en vanlig samtale: den prater med stemme, henter opp riktig sted på skjermen så du slipper å lete selv, og holder seg kun til godkjente fakta.",
  },
  {
    audioSrc: "/audio/usecase-1.mp3",
    bubble:
      "En nettbutikk kan bruke det i kundeservice eller på telefon for å hjelpe kunder, skoler kan bruke det til muntlig trening, og i helsevesenet kan det gi eldre og pasienter enkel veiledning.",
  },
];

export const FOLLOW_UP_PROMPTS: Array<{ text: string; match?: RegExp }> = [
  {
    text: USE_CASE_PROMPT,
    match: /3d|worker|portefølje|cinemorra|stemme/i,
  },
  { text: "Hva gjør du i Ember Booking?", match: /prosjekt|frontend|design|figma/i },
  { text: "Hvordan er MedCare Clinical bygget?", match: /ember|backend|noroff|eksamen/i },
  { text: "Hvordan bruker du AI i programvareutvikling?", match: /handel|helse|opplæring|gemini|utvikling|stack/i },
  { text: "Hva gjorde du før utvikling?", match: /noroff|rolle|utdanning|medcare/i },
  { text: "Hva slags rolle ser du etter?", match: /ekornes|pt|trener|cuba|erfaring/i },
  { text: "Hva er en svakhet du har?", match: /rolle|remote|hybrid|samarbeid/i },
  { text: "Hvordan løste du storskjermen i kantina?", match: /bordtennis/i },
  { text: "Hvordan fungerer 3D chatten?" },
  { text: "Vis meg rundt i prosjektene" },
  { text: "Kan jeg få se CV'en din?" },
];
