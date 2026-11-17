export {
  CASE_WALKTHROUGH_RE,
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
  heroHeadline: "Hei, Yosmel her",
  heroBio:
    "Jeg utvikler nettsider og systemer med fokus på ryddig arkitektur, tydelig design og løsninger som folk faktisk tar i bruk. Bla gjerne gjennom prosjektene mine, eller slå av en prat med AI versjonen av meg.",
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
        " siden 2013.",
      ],
      [
        "Til daglig jobber jeg på Nord-Gudbrandsdal VGS, med IKT drift og support. Ved siden av driver jeg ",
        { label: "Ember Booking", href: "https://emberbooking.no" },
        " sammen med Kim. Der har jeg ansvaret for design, frontend, merkevare, markedsføringssider og brukeropplevelse.",
      ],
      [
        "Jeg trives godt med det jeg gjør i dag, og er åpen for spennende utviklerroller innen frontend, backend eller fullstack når den rette muligheten dukker opp. Siden jeg er etablert her med familien, passer remote eller en praktisk hybridløsning best.",
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
  { text: "Hvordan sikrer du chatten mot prompt injection?", match: /sikkerhet|personvern|prompt|injection|3d|chat/i },
  { text: "Hvordan fungerer 3D chatten?" },
  { text: "Vis meg rundt i prosjektene" },
  { text: "Kan jeg få se CV'en din?" },
];
