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

export interface OutdoorMediaItem {
  kind: "video" | "image";
  src: string;
  webmSrc?: string;
  poster?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export const SITE_URL = "https://yosmel.no";

export const PROFILE = {
  name: "Yosmel Chiang",
  shortName: "Yosmel",
  handle: "yosang",
  email: "yosmelchiang@gmail.com",
  location: "Otta",
  heroHeadline: "Hei, Yosmel her",
  heroBio:
    "Fullstackutvikler innen TypeScript, React, Next.js og C# / .NET med øye for UX og praktisk KI.",
  socials: [
    { label: "GitHub", href: "https://github.com/yosang" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/yosmel-chiang/" },
    { label: "Epost", href: "mailto:yosmelchiang@gmail.com" },
  ],
  about: {
    subtitle: "Utvikler, tidligere avdelingsleder og friluftsmenneske",
    portrait: {
      src: "/about/portrait.jpg",
      alt: "Portrett av Yosmel Chiang",
      width: 500,
      height: 750,
    },
    paragraphs: [
      [
        "Jeg heter Yosmel Gutierrez Chiang, er født på Cuba, kom til Norge da jeg var ti år og bor på Otta i Gudbrandsdalen sammen med familien min og hunden vår Ella. På GitHub har jeg bygget ting som ",
        { label: "@yosang", href: "https://github.com/yosang" },
        " siden 2013.",
      ],
      [
        "Før jeg utdannet meg i backendutvikling og frontendutvikling hos Noroff, jobbet jeg på Ekornes. Der startet jeg i produksjonen med montering av møbler og programmering av Motoman industriroboter før jeg gikk videre til teamleder og avdelingsleder med personalansvar, daglig driftsplanlegging og kvalitetskontroll. Den erfaringen gjør at jeg trives når jeg får bidra med mer enn bare kode, som å sette meg inn i forretningen og driften, ta del i juridiske vurderinger (som avtaler, personvern og forretningsregler) og være med på de større valgene.",
      ],
      [
        "Til daglig jobber jeg med IKT drift og brukerstøtte på Nord-Gudbrandsdal VGS, og ved siden av driver jeg ",
        { label: "Ember Booking", href: "https://emberbooking.no" },
        " sammen med Kim. Der snakker vi direkte med norske bedriftseiere og former både forretningsmodell, merkevare, designsystem og frontend. Jeg trives godt med det jeg gjør i dag, og er åpen for spennende roller som utvikler eller konsulent innen fullstack, backend eller frontend. Siden jeg er fast etablert her i Gudbrandsdalen, stiller jeg gjerne fysisk på kontor i nærområdet eller på fagdager og kundemøter i Innlandet, og jobber like godt hybrid eller remote.",
      ],
    ] as AboutSegment[][],
    outdoors: {
      heading: "Fjell, telt og hunden",
      paragraphs: [
        "Når jeg klapper igjen PCen, finner du meg som regel ute i skogen eller til fjells rundt Gudbrandsdalen og Rondane, uansett årstid. Enten det er løpeturer i regn og tåke på bratte stier, sommernetter i telt ved et fjellvann eller vinterturer med teltovn i snøen, er det ute i naturen jeg lufter hodet og henter energi.",
        "Nesten alltid er familiehunden vår Ella, en italiensk fuglehund (Bracco Italiano), med på lasset og først ute av teltåpningen om morgenen.",
      ],
      media: [
        {
          kind: "image",
          src: "/about/mountain-run.jpg",
          alt: "Yosmel under fjelløp i Hornindal med løpevest og startnummer.",
          caption: "Fjelløp i Hornindal.",
          width: 882,
          height: 1176,
        },
        {
          kind: "image",
          src: "/about/winter-coffee.jpg",
          alt: "Kaffekjele på primus, kaffekopp i hånda og hunden Ella som løper med ball i snøen.",
          caption: "Kaffe på primusen.",
          width: 882,
          height: 1176,
        },
        {
          kind: "image",
          src: "/about/winter-tent.jpg",
          alt: "Nortent kuppeltelt med teltovn i snøen med solbelyste fjell i bakgrunnen.",
          caption: "Kald vinter med teltovn.",
          width: 738,
          height: 984,
        },
        {
          kind: "image",
          src: "/about/lake-camp.jpg",
          alt: "Utsikt fra teltåpningen mot et stille fjellvann og bratte fjellsider mens Ella står ved vannkanten.",
          caption: "Morgenstund.",
          width: 741,
          height: 984,
        },
      ] as OutdoorMediaItem[],
    },
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
  "Hva kan denne KI teknologien brukes til i praksis?";

export const FOLLOW_UP_PROMPTS: Array<{ text: string; match?: RegExp }> = [
  {
    text: USE_CASE_PROMPT,
    match: /3d|worker|portefølje|cinemorra|stemme/i,
  },
  { text: "Hva gjør du i Ember Booking?", match: /prosjekt|frontend|design|figma/i },
  { text: "Hvordan er MedCare Clinical bygget?", match: /ember|backend|noroff|eksamen/i },
  { text: "Hvordan bruker du KI i programvareutvikling?", match: /handel|helse|opplæring|gemini|utvikling|stack/i },
  { text: "Hva gjorde du før utvikling?", match: /noroff|rolle|utdanning|medcare/i },
  { text: "Hva slags rolle ser du etter?", match: /ekornes|pt|trener|cuba|erfaring/i },
  { text: "Hva er en svakhet du har?", match: /rolle|remote|hybrid|samarbeid/i },
  { text: "Hvordan løste du storskjermen i kantina?", match: /bordtennis/i },
  { text: "Hvordan sikrer du chatten mot prompt injection?", match: /sikkerhet|personvern|prompt|injection|3d|chat/i },
  { text: "Hvordan fungerer 3D chatten?" },
  { text: "Vis meg rundt i prosjektene" },
  { text: "Kan jeg få se CV'en din?" },
];
