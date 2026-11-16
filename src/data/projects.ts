export type ItemCategory = "independent" | "school";

export interface CaseStudySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CaseStudyImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface ProjectCaseStudy {
  role: string;
  status: string;
  intro: string;
  wideImage?: CaseStudyImage;
  mobileGallery?: CaseStudyImage[];
  sections: CaseStudySection[];
}

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
  repoNote?: string;
  aiNote?: string;
  caseStudy: ProjectCaseStudy;
  /**
   * 1-sentence spoken intro used during the guided project tour ("Vis meg rundt i prosjektene").
   * `audioSrc` is optional: if a new project does not have a pre-recorded MP3 yet,
   * the card is still spotlit and scrolled into view at the normal tour cadence.
   */
  tour: {
    bubble: string;
    audioSrc?: string;
  };
  /**
   * Extra technical context and boundaries injected into the AI system instruction for this project.
   */
  aiContext?: string[];
}

export type IndexItem = ProjectItem;

/**
 * Single source of truth for all portfolio projects.
 * Adding or updating an entry here automatically updates the home grid, category filters,
 * AI system prompt, guided project tour, case study pages, SEO JSON-LD, and /llms.txt.
 */
const PROJECT_DEFINITIONS: ProjectItem[] = [
  {
    slug: "vgs-bordtennis",
    title: "VGS Bordtennis",
    year: "Pågår",
    category: "independent",
    accent: "#1b6b57",
    ground: "#17211e",
    media: {
      poster: "/projects/vgs-bordtennis-poster.jpg",
      video: "/projects/vgs-bordtennis.mp4?v=qr-bottom",
      alt: "Storskjerm med poengtavle og mobilvisning i VGS Bordtennis.",
    },
    tags: ["Node.js", "node:sqlite", "Socket.IO", "Pågår"],
    liveUrl: "https://vgsbordtennis.no/kiosk/demo",
    subtitle:
      "Sanntids turneringer og poengtavle for videregående skoler.",
    summary:
      "Pågående prosjekt ved Nord-Gudbrandsdal VGS som får elevene opp fra mobilen i friminuttet, med QR kode ved bordet og live storskjerm i kantina.",
    highlights: [
      "Kampflyt: Enkel flyt ved bordet med QR kode der begge spillerne bekrefter resultatet, med sjekk mot juks og automatisk frigjøring av glemte bord.",
      "Storskjerm: Live tavle i kantina via Socket.IO, tilpasset Infoskjermen.no på eldre TV skjermer med animert WebP og ES5 støtte.",
      "Arkitektur: Flere skoler på samme instans i Node.js og innebygd SQLite (5 npm pakker), stresstestet med 100 samtidige spillere.",
    ],
    repoNote:
      "Privat repo mens løsningen er i aktiv utprøving. Jeg viser gjerne frem kodebasen og arkitekturen i en prat.",
    aiNote:
      "Første versjon gikk fra plan til drift på en uke med Spike and Stabilize.",
    caseStudy: {
      role: "Design, arkitektur og fullstackutvikling (eget fritidsprosjekt)",
      status: "I aktiv utprøving ved Nord-Gudbrandsdal VGS",
      intro:
        "VGS Bordtennis startet med et enkelt ønske: å få flere elever til å legge bort telefonen i friminuttet og samle seg rundt bordtennisbordene i kantina. Resultatet ble en sanntids turnerings-, bord- og aktivitetsplattform med QR-skanning ved bordet og live poengtavle på storskjerm.",
      wideImage: {
        src: "/projects/vgs/kiosk.jpg",
        alt: "Storskjermen i VGS Bordtennis med pallplasser, live poengtavle, rekkert-ikoner og BOSS-markeringer.",
        caption:
          "Storskjermen (/kiosk) viser pallplasser, pågående kamper og hele tabellen live i kantina.",
        width: 1600,
        height: 1055,
      },
      mobileGallery: [
        {
          src: "/projects/vgs/mobile-turnering.jpg",
          alt: "Mobilvisning av Turnering-fanen med aktiv kamp, tabell og bunnmeny med Skann QR.",
          caption: "Turnering: Pågående kamp, tabell med BOSS-utfordringer og hurtigknapp for QR i bunnbaren.",
          width: 768,
          height: 1480,
        },
        {
          src: "/projects/vgs/mobile-match.jpg",
          alt: "Mobilvisning av Match-fanen med oversikt over bordene i kantina og vrimlearealet.",
          caption: "Match: Sanntidsstatus på bordene (opptatt i kamp eller ledig) og hvem som er bordets vokter.",
          width: 768,
          height: 1480,
        },
        {
          src: "/projects/vgs/mobile-profil.jpg",
          alt: "Mobilvisning av Profil-fanen med valgt rekkert, statistikk, trofeer og kamphistorikk.",
          caption: "Profil: Spillerens aktive rekkert, seiersprosent, tid ved bordet, trofeer og byttehandel.",
          width: 768,
          height: 1480,
        },
      ],
      sections: [
        {
          title: "Bakgrunn og motivasjon",
          paragraphs: [
            "Til daglig jobber jeg med IKT drift og support på Nord-Gudbrandsdal VGS. I friminuttene så jeg stadig det samme bildet: mange satt alene med blikket festet i mobilen, samtidig som bordtennisbordene i kantina ofte ble stående ubrukte eller uten noen fast struktur.",
            "Som tidligere videospillnerd fikk jeg lyst til å bygge et system på fritiden som tok de beste mekanikkene fra spillverdenen inn i et fysisk friminutt. Når elevene kan klatre på en felles stige, låse opp egne rekkerter, utfordre lærere i Boss Fight og se navnet sitt klatre live på storskjermen i kantina, blir terskelen for å bli med mye lavere.",
          ],
        },
        {
          title: "Skjermfri kampflyt ved bordet",
          paragraphs: [
            "Hele poenget med løsningen er at elevene skal spille bordtennis fremfor å stå og trykke på en skjerm. Derfor er flyten rundt selve bordet lagt opp slik at telefonen kun brukes i noen sekunder før og etter kampen.",
            "Når to spillere skanner QR-koden ved samme bord innen 45 sekunder, kobles de sammen og kampen starter automatisk. Telefonen legges i lomma mens settene spilles, og etterpå legger den ene inn resultatet mens motstanderen bekrefter med ett trykk.",
          ],
          bullets: [
            "Automatisk opprydding (Watchdog hvert 5. sekund): Hvis noen glemmer å fullføre en kamp, frigjøres bordet automatisk etter 12 minutter slik at neste par i den virtuelle bordkøen får varsel på telefonen.",
            "Vern mot juks og avtalt spill: Hvis en kamp rapporteres unaturlig raskt (under 45 sekunder per sett), blokkeres 90-sekunders autogodkjenning og kampen flagges til arrangør. To venner kan heller ikke låse stigen ved å spille tellende stigekamper mot hverandre to ganger på rad (Anti-Bodyguard).",
            "Lærere og ansatte som Boss Fight: Ansatte kan enten spille uforpliktende kamper utenfor tabellen eller melde seg på stigen med eget BOSS-merke. For å hindre poeng-farming mot samme lærer gis det maks ett tellende Boss-trofe per ansatt per dag.",
          ],
        },
        {
          title: "Turneringsmotor, rekkerter og Klasse-Guilds",
          paragraphs: [
            "Siden ulike skoler og friminutt har forskjellige behov, støtter turneringsmotoren i db.js tre fulle formater: Kongen på haugen (løpende stige der man utfordrer opptil 3 aktive plasser over seg), VM-sluttspill (gruppespill med slange-seeding og innbyrdes minitabell ved poenglikhet etterfulgt av kryss-seedet utslagstablå) og Sveitserstil (faste runder med Buchholz-utregning uten at noen ryker ut).",
            "For å skape samhold på tvers av trinn og klasser har systemet egne Klasse-Guilds og digitale StatTrak-rekkerter med lokalt VGS- og Innlandet-preg. Hver rekkert teller antall kamper, seire, Boss-seire og tidligere eiere. Hver tredje fullførte turnering roterer skolen til en ny sesongpakke, og ved skoleårsavslutning for VG3 flyttes opplåste rekkerter over i skolens Premiehvelv slik at arven lever videre på skolen.",
          ],
        },
        {
          title: "Storskjermen i kantina og erfaringer med Infoskjermen.no",
          paragraphs: [
            "En av de mest lærerike tekniske utfordringene dukket opp da poengtavlen (/kiosk) skulle kjøre hele skoledagen gjennom Infoskjermen.no på eldre Samsung Tizen- og LG webOS-skjermer. På vanlig mobil og PC fungerte alt på første forsøk, men inne i låste signage-WebViews oppførte nettleseren seg helt annerledes.",
            "I slike TV-nettlesere krever systemet et fysisk brukerklikk før en <video>-tag får spille. Kaller man video.play() i en iframe uten klikk, kaster ikke nettleseren en feilmelding: promiset blir bare stående uavklart for alltid, slik at videoen fryser på første bilde. I tillegg struper Chromium timere i kryss-domene iframes til hele minuttgrenser.",
          ],
          bullets: [
            "24 fps animert WebP fremfor <video>: Alle animasjoner på storskjermen genereres med ffmpeg som 24 fps animert WebP i en <picture>-tag med GIF-fallback, håndhevet automatisk av testsuiten.",
            "Tre synkroniserte visningslag: Storskjermen leveres først som ferdig SSR-HTML fra serveren, oppgraderes til sanntids Socket.IO i moderne nettlesere, og har en egen håndskrevet ES5-fallback (uten piler, template literals eller optional chaining) for eldre Smart-TV-er.",
            "Tidsstyrt dvalemodus: Utenfor skolens åpningstid (Europe/Oslo) kobler storskjermen automatisk ned sanntidstrafikken og våkner igjen ved skolestart neste morgen.",
          ],
        },
        {
          title: "Arkitektur, drift og innebygd personvern (GDPR)",
          paragraphs: [
            "Hele plattformen er bygget i Node.js (>= 22.5) med den innebygde node:sqlite-modulen i WAL-modus og kun 5 direkte npm-avhengigheter (express, socket.io, dotenv, qrcode og web-push). Flere skoler kjører isolert på samme instans via school_id på tvers av 22 SQLite-tabeller og adskilte Socket.IO-rom, på en Docker-instans hos Fly.io i Stockholm med persistent SSD-volum og automatisk VACUUM INTO-backup ved nye utgivelser.",
            "Fordi løsningen brukes av skoleelever, er personvern bygget inn i datamodellen etter prinsippet om dataminimering (Verify & Purge). Så snart en arrangør på skolen har bekreftet eleven (eller automatisk etter 14 dager), overskrives fullt navn og epost permanent med NULL i databasen. Kun en enveis HMAC-SHA256-hash beholdes for innlogging og duplikatsjekk, og plattformen har ingen fritekst-chat eller tredjepartssporing. Før utrulling ble løsningen stresstestet med 100 samtidige spillere uten feil.",
          ],
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/0.mp3",
      bubble:
        "Vi starter med VGS Bordtennis, et hobbyprosjekt på fritiden med QR kode ved bordet og live storskjerm i kantina.",
    },
    aiContext: [
      "Pågående hobbyprosjekt jeg bygger på fritiden for å få elevene opp fra mobilen og til å spille bordtennis i friminuttet. Flere skoler kan bruke samme løsning med hvert sitt adskilte område (`/?school=<code>` og `/kiosk/<slug>`). Hvis noen spør om favorittprosjektet mitt, si gjerne at jeg har storkost meg med VGS Bordtennis i det siste, både fordi det er gøy å se elevene legge vekk mobilen i friminuttet, og fordi det som tidligere videospillnerd vekket mye nostalgi og engasjement i meg.",
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
    accent: "#1b6b57",
    ground: "#17211e",
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
      "Min rolle: Vedlikeholder og videreutvikler frontenden og markedsføringssidene på emberbooking.no.",
      "Designsystem: Ansvar for visuell identitet, merkevare og komponenter med fokus på lesbarhet og tydelig hierarki.",
      "Brukeropplevelse: Jobber løpende med struktur, tilgjengelighet og enkel flyt på tvers av plattformen.",
    ],
    repoNote:
      "Privat repo (kommersielt produkt i drift). Jeg viser gjerne frem koden og designsystemet i en samtale.",
    caseStudy: {
      role: "Medgründer · Ansvar for design, frontend, merkevare og brukeropplevelse",
      status: "I kommersiell drift på emberbooking.no",
      intro:
        "Ember Booking er et norsk bookingsystem jeg driver sammen med Kim. Mitt hovedansvar er den visuelle identiteten, frontenden, markedsføringssidene på emberbooking.no og at brukeropplevelsen føles ryddig og enkel å forstå.",
      sections: [
        {
          title: "Samarbeidet og min rolle",
          paragraphs: [
            "Kim og jeg bygger Ember Booking sammen med en tydelig arbeidsdeling. Vi tar jevnlige statusmøter der vi går gjennom veien videre for bedriften, prioriterer hva som må på plass, og fordeler oppgavene mellom oss.",
            "Mitt bord er alt som møter brukeren visuelt og i frontenden: designsystemet, merkevaren, landingssidene i Next.js 16 og flyten i grensesnittet.",
          ],
        },
        {
          title: "Designsystem og visuelt uttrykk",
          paragraphs: [
            "Mange bookingsystemer for utleie, treningssentre og lokaler bærer preg av tette skjemaer og visuell støy. Da jeg utformet uttrykket for Ember Booking, var målet å skape en rolig, tillitvekkende flate med tydelig typografisk hierarki, gode kontraster og komponenter som fungerer like godt på mobil som på desktop.",
            "Fargepaletten, kortstrukturen og avstandene er bygget opp etter faste rammer slik at nye funksjoner og seksjoner kan legges til uten at helhetsinntrykket sprekker opp.",
          ],
        },
        {
          title: "Frontend og ytelse på emberbooking.no",
          paragraphs: [
            "Markedsføringssidene på emberbooking.no er bygget i Next.js 16 med fokus på rask innlasting, god søkemotoroptimalisering og tydelig presentasjon av hvordan systemet løser hverdagen for utleiere.",
          ],
          bullets: [
            "Komponentstruktur: Gjenbrukbare seksjoner for funksjonsvisning, prisoversikt og kundehistorier med lav kompleksitet i kodebasen.",
            "Tilgjengelighet og lesbarhet: Tastaturnavigering, semantisk HTML og typografi tilpasset rask skimming.",
            "Løpende forbedring: Jevnlig iterasjon på tekst, struktur og brukerflyt basert på tilbakemeldinger.",
          ],
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/1.mp3",
      bubble:
        "Videre har vi Ember Booking, et norsk bookingsystem jeg driver sammen med Kim der jeg har ansvaret for design og frontend.",
    },
    aiContext: [
      "Ember Booking er et norsk bookingsystem jeg driver sammen med Kim.",
      "Slik jobber Kim og jeg sammen: vi tar et statusmøte sammen i ny og ne der vi prater om veien videre for bedriften, legger strategi og noterer hva som må jobbes med, og så blir vi enige om hvem som har ansvaret for hva.",
      "Min rolle er å vedlikeholde og videreutvikle designet, frontenden, merkevaren og markedsføringssidene på `emberbooking.no` (bygget i Next.js 16), og sørge for at brukeropplevelsen er enkel og ryddig. Ikke si at jeg har bygget selve backend-motoren, smartlås-styringen eller regnskapsintegrasjonene; hold svarene om Ember fokusert på mitt arbeid med design, frontend, merkevare, landingssider, designsystem og brukeropplevelse.",
    ],
  },
  {
    slug: "interaktiv-portefolje",
    title: "Interaktiv Portefølje",
    year: "2026",
    category: "independent",
    accent: "#1b6b57",
    ground: "#17211e",
    media: {
      poster: "/projects/portfolio-poster.jpg",
      alt: "Fullskjerms 3D studio og AI-metodikk i Interaktiv Portefølje.",
    },
    tags: ["Next.js 16", "Three.js Worker", "Gemini TTS", "AI-assistert"],
    repoUrl: "https://github.com/yosang/portfolio",
    subtitle:
      "Samtalestyrt grensesnitt med 3D-skannet avatar, stemmekloning og visuell navigasjon.",
    summary:
      "Laget for at du kan snakke med en AI-versjon av meg i en vanlig samtale mens den viser deg rundt på siden. Samtidig er oppsettet en praktisk demonstrasjon av hvordan sanntids tale, visuell styring og forankring i egne fagdata kan løse reelle oppgaver innen helse, utdanning og kundeservice.",
    highlights: [
      "Samtalegrensesnitt: AI Yosmel tar besøkende gjennom en visuell omvisning i prosjektene, svarer med stemme og henter frem CV ved behov.",
      "Bruksområder: Samme oppsett kan gi eldre og pasienter muntlig veiledning i helsevesenet, brukes til muntlig trening i skolen eller løse kundeservice for bedrifter.",
      "Arkitektur: 3D-skannet modell med blendshapes i en egen OffscreenCanvas Web Worker på 60 fps, kombinert med sanntids TTS og tale-til-tekst.",
    ],
    aiNote:
      "Bygget høsten 2026 med faste rammer i AGENTS.md og skills.",
    caseStudy: {
      role: "Design, 3D-integrasjon og fullstackutvikling",
      status: "I produksjon på yosmel.no (åpen kildekode)",
      intro:
        "Denne porteføljen utforsker hvordan et nettsidegrensesnitt fungerer når du kan snakke direkte med det. I stedet for at besøkende må lete gjennom menyer på egen hånd, kan AI-versjonen av meg ta deg med på en visuell omvisning, åpne prosjekter på skjermen, svare muntlig med klonet stemme og hente frem CV ved behov.",
      sections: [
        {
          title: "Mer enn en portefølje: praktiske bruksområder",
          paragraphs: [
            "Tanken bak oppsettet var å teste hvor nær en vanlig muntlig samtale man kommer på web når modellen snakker med naturlig stemme, styrer det du ser på skjermen, og samtidig holder seg strengt til godkjente fakta.",
            "Den samme arkitekturen har tydelig nytteverdi langt utenfor en personlig portefølje: i helsevesenet kan et slikt grensesnitt gi eldre og pasienter rolig muntlig veiledning gjennom skjemaer og forberedelser, i skolen kan elever øve muntlig i trygge rammer, og i kundeservice kan bedrifter veilede brukere visuelt gjennom en sak uten at modellen finner på egne svar.",
          ],
        },
        {
          title: "3D-avatar i egen Web Worker på 60 fps",
          paragraphs: [
            "Avataren er en 3D-skanning av meg med 52 ARKit-blendshapes for munnsynk, blunking, hodebevegelser og ansiktsuttrykk. For at 3D-rendringen aldri skal blokkere hovedtråden eller gjøre rulling på siden treg, overføres lerretet til en egen OffscreenCanvas Web Worker (avatar.worker.ts).",
            "Selve Three.js-motoren startes først ved brukerinteraksjon eller etter at første bildeopptegning er ferdig, og pauser automatisk via IntersectionObserver når seksjonen ruller ut av synsfeltet.",
          ],
        },
        {
          title: "Synkronisert stemmekloning, tale-til-tekst og sikkerhet",
          paragraphs: [
            "Stemmen er klonet fra et 17 sekunders lydopptak og strømmes i sanntid over Server-Sent Events (SSE) fra /api/chat. Når lyden er skrudd på, venter chatboblen med å vises til første lydpakke faktisk starter avspilling i Web Audio API, slik at tekst, stemme og leppebevegelser treffer likt.",
          ],
          bullets: [
            "Tale-til-tekst (/api/transcribe): Besøkende kan snakke direkte inn via mikrofonen i chatten, med en egen fagordliste for prosjektnavn og tekniske uttrykk.",
            "Streng faktaforankring: Systemprompten bygges dynamisk fra samme datakilde som selve nettsiden (projects.ts og portfolio.ts), med klare grenser for hva modellen skal svare på og når den skal henvise videre på epost.",
            "Misbruksvern og kostnadskontroll: Endepunktene er sikret med Origin- og Sec-Fetch-Site-sjekk, størrelsesgrenser på nyttelast, samt både IP-baserte og globale minutt- og dagskvoter.",
          ],
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/portfolio.mp3",
      bubble:
        "Her er selve porteføljen du er på nå, laget for at du kan snakke med en AI-versjon av meg som viser deg rundt.",
    },
    aiContext: [
      "Denne porteføljen (`yosmel.no`, kildekode på `github.com/yosang/portfolio`) utforsker hvordan AI kan gjøre et grensesnitt enklere å bruke: man snakker med AI Yosmel i en vanlig samtale, mens den tar leseren gjennom en visuell tour av prosjekter, åpner detaljer, svarer på spørsmål og henter frem CV uten at man må klikke og lete rundt selv.",
      "Hva teknologien kan brukes til utenfor en portefølje: tanken er å komme nærmere en vanlig samtale der den prater med stemme, henter opp riktig sted på skjermen så du slipper å lete selv, og holder seg kun til godkjente fakta. Jeg ser for meg at bedrifter kan bruke slik teknologi til å hjelpe kunder i kundeservice eller på telefon. Samtidig kan skoler bruke det til muntlig trening, og i helsevesenet kan det gi eldre og pasienter enkel veiledning.",
      "Samtidig var dette prosjektet der jeg høsten 2026 for alvor utfordret meg selv på strukturert AI-assistert utvikling, med egne regler i `AGENTS.md` og `github.com/yosang/skills` (`ui-craft`, `natural-copy` og `lean-architecture`).",
      "Teknisk kjører 3D-skanningen (T2-modell med blendshapes for munnsynk, blunking og uttrykk) på Three.js i en egen `OffscreenCanvas` Web Worker på 60 fps, mens svar og klonet stemme (fra 17 sekunder opptak) strømmes fra Gemini over SSE.",
    ],
  },
  {
    slug: "skills",
    title: "Agent Skills",
    year: "2026",
    category: "independent",
    accent: "#1b6b57",
    ground: "#17211e",
    media: {
      poster: "/projects/skills-poster.jpg",
      alt: "Oversikt over SKILL.md-moduler og AGENTS.md i github.com/yosang/skills.",
    },
    tags: ["SKILL.md", "AGENTS.md", "Open Source"],
    repoUrl: "https://github.com/yosang/skills",
    subtitle:
      "Egne SKILL.md-filer og AGENTS.md-regler for arkitektur, design og språk i AI-assistert utvikling.",
    summary:
      "Åpent repo med kjørereglene jeg bruker når jeg jobber med kodeagenter, samlet i tre moduler som kan brukes på tvers av prosjekter.",
    highlights: [
      "ui-craft: Faste rammer for fargebruk, typografi, avstander og rolige flater i grensesnittet.",
      "lean-architecture: Regler for enkel kodebase, kort kontekst, strukturert arbeidsflyt og tydelig dokumentasjon.",
      "natural-copy: Retningslinjer for naturlig og rett-frem språk i tekst, dokumentasjon og tale.",
    ],
    aiNote:
      "Brukes på tvers av denne porteføljen og andre egne prosjekter.",
    caseStudy: {
      role: "Forfatter og vedlikeholder (Open Source)",
      status: "Offentlig repo på github.com/yosang/skills",
      intro:
        "Når man bruker kodeagenter uten tydelige rammer, ender man raskt opp med overkomplisert kode, lilla glødeeffekter i grensesnittet og stive maskinoversatte tekster. Agent Skills er mitt åpne bibliotek med SKILL.md-moduler og AGENTS.md-regler som holder arkitektur, design og språk på plass på tvers av prosjekter.",
      sections: [
        {
          title: "Hvorfor jeg samlet reglene i et eget repo",
          paragraphs: [
            "Da jeg høsten 2026 gikk inn for å bruke AI-assistert programvareutvikling mer systematisk, merket jeg raskt at kvaliteten står og faller på rammene man setter i forkant. Uten faste begrensninger legger språkmodeller gjerne til unødvendige abstraksjoner, defensiv kode som skjuler feil, og visuell støy.",
            "Ved å samle kjørereglene i et eget repo etter Agent Skills-standarden (kompatibelt med Claude Code, Cursor, Antigravity og Gemini CLI), kan jeg koble nøyaktig samme kvalitetskrav rett inn i hvert nytt prosjekt.",
          ],
        },
        {
          title: "De tre kjernemodulene",
          paragraphs: [
            "Biblioteket er delt inn i tre fokuserte moduler slik at hver oppgave kun laster inn den konteksten som faktisk trengs:",
          ],
          bullets: [
            "ui-craft: Bygger på Matt D. Smiths 3P-rammeverk (Purpose, Principles, Personality) og 60-30-10-fargeregelen. Kutter ut tilfeldige radial-gradients og overdimensjonerte kort til fordel for matte flater, OKLCH-nøytraler, flytende typografi (Utopia.fyi) og et 8pt avstandssystem.",
            "lean-architecture: Holder kontekstvinduet under 40 % og tvinger frem planlegging før kode. Kombinerer prinsipper om én kilde til sannhet, fjerning av død kode og Dan Norths Spike and Stabilize-mønster.",
            "natural-copy: Fjerner typiske AI-markører i både norsk og engelsk tekst, som tankestreker, tomme superlativer og stive ord-for-ord-oversettelser av etablerte tekniske uttrykk.",
          ],
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/skills.mp3",
      bubble:
        "Her er også skills-repoet mitt med faste regler for arkitektur, design og språk når jeg bruker AI.",
    },
    aiContext: [
      "`skills` (`github.com/yosang/skills`) er mitt åpne GitHub-repo med `SKILL.md`-filer og `AGENTS.md`-regler for AI-assistert programvareutvikling, kompatibelt med verktøy som følger Agent Skills-standarden (Claude Code, Cursor, Antigravity og Gemini CLI).",
      "Repoet er delt inn i tre moduler: `ui-craft` (design, farger, typografi og grensesnitt), `lean-architecture` (slank kodebase, kort kontekst og god dokumentasjon) og `natural-copy` (naturlig språk uten fyllord og stive oversettelser). Hvis noen vil se de konkrete reglene i detalj, vis gjerne til selve repoet på `github.com/yosang/skills`.",
    ],
  },
  {
    slug: "medcare-clinical",
    title: "MedCare Clinical",
    year: "2026",
    category: "school",
    accent: "#1b6b57",
    ground: "#17211e",
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
      "Backend: REST API i C# og .NET 9 med Entity Framework Core mot MySQL, soft delete ved avbestilling og Swagger.",
      "Sikkerhet og flyt: JWT innlogging med refresh token i cookie, gjestebooking, pasientprofil og eget adminpanel med full CRUD.",
      "Frontend og drift: React med TanStack Query, Zustand og Zod, satt opp på Vercel mot Azure Web App og Railway.",
    ],
    caseStudy: {
      role: "Fullstackutvikler (Eksamensprosjekt i Backend 2026 hos Noroff)",
      status: "Fullført eksamensprosjekt · Åpen kildekode",
      intro:
        "MedCare Clinical ble bygget over fem uker som avsluttende eksamensprosjekt på det toårige studiet i backendutvikling hos Noroff. Oppgaven var å planlegge, modellere og utvikle et komplett timebestillingssystem for helseklinikker i C# og .NET 9 med MySQL og en tilhørende klient i React.",
      sections: [
        {
          title: "Uke 1: Normalisering (3NF), skjemasjekk og CI fra dag en",
          paragraphs: [
            "Før jeg skrev en eneste linje C#, brukte jeg de første dagene på å gå gjennom kravspesifikasjonen, repetere normalisering og tegne ut ER-diagrammet i tredje normalform (3NF). Blant annet skilte jeg ut byer (City), kategorier og statuser (Status) som egne tabeller knyttet til klinikker og timeavtaler.",
            "Da modellene og relasjonene var satt opp i Entity Framework Core, ville jeg være helt sikker på at C#-koden ga den databasestrukturen jeg hadde planlagt. Jeg kjørte derfor mysqldump fra MySQL og importerte skjemaet tilbake i dbdiagram.io for å kontrollere at tabeller, fremmednøkler og unike skranker stemte 1-til-1 med ER-diagrammet.",
          ],
          bullets: [
            "GlobalExceptionHandler: Satte opp sentral feilhåndtering tidlig i uke 1 slik at tjenestelaget slapp gjentakende try/catch-blokker i hver metode.",
            "Swagger med XML-dokumentasjon: Konfigurerte Swagger på /doc med XML-kommentarer, eksempeldata og responskoder for hvert endepunkt.",
            "GitHub Actions CI: La inn automatisk byggesjekk ved hver push helt fra starten, slik at ingen commit kunne brekke byggeprosessen i det stille.",
          ],
        },
        {
          title: "Uke 2: Egne mappere fremfor AutoMapper og oppdagelsen med .Select og .Include",
          paragraphs: [
            "Etter hvert som antallet entiteter og DTO-er vokste, ble manuell mapping i tjenestelaget rotete. Jeg vurderte biblioteker som AutoMapper og Mapperly, men valgte å skrive egne C# extension-metoder (som ToAppointmentWithDetailsDTO og ToClinicDTO) kombinert med en UpdateWith-hjelpemetode for delvise oppdateringer. Det holdt tjenestene svært lesbare uten ekstra pakkeavhengigheter.",
            "Denne refaktoreringen avdekket en viktig detalj i hvordan EF Core bygger SQL: så lenge mappingen lå direkte inne i et .Select(a => new DTO { Doctor = ... })-uttrykk, skjønte EF Core at den måtte hente relasjonen til Doctor automatisk. Da jeg byttet til .Select(a => a.ToAppointmentWithDetailsDTO()), klarte ikke EF Core lenger å lese uttrykkstreet og kastet feil fordi relaterte data manglet. Løsningen var å legge inn eksplisitte .Include()-kall i spørringene.",
            "Samme uke endret jeg fødselsnummer (NationalIdentityNumber) fra int til string på 11 tegn, siden norske fødselsnumre kan starte med 0 og aldri brukes til utregninger.",
          ],
        },
        {
          title: "Overlappende legetimer (tegnet på papir) og duplikatsjekk for gjester",
          paragraphs: [
            "For å hindre dobbeltbooking la jeg først inn sammensatte unike indekser i databasen på DoctorId + AppointmentDate og PatientId + AppointmentDate. Under testing oppdaget jeg at indeksen kun stoppet to timer som startet på nøyaktig samme minutt, men ikke hindret en ny bestilling klokken 10:15 hvis legen allerede hadde en 30-minutters time fra 10:00 til 10:30.",
            "Jeg måtte sette meg ned med penn og papir og tegne opp tidsaksene for å være 100 prosent sikker på at datokontrollen fanget alle varianter av overlapp, både ved ny bestilling og når en registrert pasient endrer en eksisterende avtale.",
          ],
          bullets: [
            "Gjenbruk av pasientprofil ved gjestebooking: Uregistrerte pasienter kan bestille time med navn, fødselsdato, telefon og epost. Hvis samme person bestiller igjen senere eller oppretter full brukerkonto, gjenbruker og oppgraderer backenden den eksisterende pasientraden i stedet for å lage duplikater.",
            "Soft delete ved avbestilling: Avbestilte timer beholdes med status i databasen for historikk, uten å blokkere tidspunktet for nye pasienter.",
          ],
        },
        {
          title: "Uke 4 og 5: Fra Zustand til TanStack Query, minnebasert JWT og RBAC",
          paragraphs: [
            "I starten av frontend-arbeidet brukte jeg Zustand til alt, inkludert å hente lister med leger og timeavtaler. Det ga mye gjentakende kode og unødvendige useEffect-kall. Selv om jeg lå etter skjema etter en runde med influensa midt i prosjektet, valgte jeg å skrive om datahentingen til TanStack Query (useQuery, useMutation og useInfiniteQuery med paginering i backend), mens Zustand kun beholdt ren klient-state som aktivt token og tema.",
          ],
          bullets: [
            "Kortlivet Access Token i minnet + httpOnly Refresh Cookie: Access token (1 til 15 minutter) holdes kun i minnet. Når et beskyttet endepunkt svarer med 401, kaller klienten automatisk POST /api/Auth/refresh med en 7-dagers httpOnly-cookie og fornyer tilgangen uten at brukeren merker det.",
            "Rollebasert tilgangskontroll (RBAC): For at vanlige innloggede pasienter ikke skulle kunne endre oppslagstabeller som klinikker, byer og spesialiteter, la jeg til en egen Role-tabell (Patient og Admin) og låste skriveendepunktene med [Authorize(Roles = \"Admin\")].",
            "Innspurt og optimalisering: Brukte react-scan for å rydde bort unødvendige re-renders, samlet duplisert JWT-oppsett i JWTTokenValidationParameters, flyttet CORS-innstillinger ut i appsettings.json, og flyttet all sortering og filtrering av timeavtaler fra frontend-tabellen over til backend.",
          ],
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/2.mp3",
      bubble:
        "Under skoleprosjekter ligger MedCare Clinical, eksamensprosjektet mitt i backend hos Noroff med legetimer i C# og .NET 9.",
    },
    aiContext: [
      "Levert som eksamensprosjektet mitt i Backend 2026 hos Noroff over fem uker (jeg fikk karakter A på eksamen og karakter A i snitt på hele backendstudiet med bestått på alle mindre innleveringer; nevn kun karakterer hvis noen spør om karakterer eller hvordan det gikk på studiet/eksamen).",
      "Fullstack timebestillingssystem for klinikker der pasienter kan søke opp leger på tvers av klinikker, byer og spesialiteter, og bestille, endre eller avbestille timer (med soft delete) både som gjest uten bruker og som innlogget pasient. Administratorer har et eget adminpanel med full CRUD for leger, klinikker, spesialiteter og timeavtaler.",
      "Viktige tekniske valg og feilsøking underveis (fra changelog.md): 1) Designet databasen i 3. normalform (3NF) og brukte mysqldump + dbdiagram.io for å revers-sjekke at EF Core-migrasjonene i MySQL stemte 1-til-1 med ER-diagrammet. 2) Valgte egne C# extension-metoder (og UpdateWith for delvise oppdateringer) fremfor AutoMapper, og oppdaget at EF Core krevde eksplisitte .Include()-kall når mappingen ble flyttet ut av inline .Select()-uttrykk. 3) Oppdaget at unike indekser kun stoppet timer på nøyaktig samme minutt, så jeg tegnet opp tidsaksene på papir for å lage overlappssjekk på start- og sluttid. 4) Gjenbruker eksisterende gjestepasienter (navn + fødselsdato + epost) når de bestiller på nytt eller registrerer konto. 5) Migrerte datahenting i frontend fra Zustand + useEffect over til TanStack Query (med useInfiniteQuery og paginering/sortering/filtrering i backend), la til RBAC med egen Role-tabell (Patient/Admin), og satte opp kortlivede JWT access tokens i minnet med 7-dagers httpOnly refresh cookie.",
    ],
  },
  {
    slug: "cinemorra",
    title: "Cinemorra",
    year: "2026",
    category: "school",
    accent: "#1b6b57",
    ground: "#17211e",
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
      "Struktur: Delt opp i Next.js App Router mellom åpne sider og eget adminpanel med middleware, loading og error states.",
      "Funksjonalitet: Server Actions for innlogging og håndtering av filmer, sammen med søk, mørk modus og state i Zustand.",
      "Kvalitetssikring: Komponenttester med Jest og React Testing Library, pluss sjekk av accessibility med eslint-plugin-jsx-a11y.",
    ],
    caseStudy: {
      role: "Frontendutvikler (Skoleprosjekt hos Noroff)",
      status: "Fullført skoleprosjekt · Live demo og åpen kildekode",
      intro:
        "Cinemorra er en filmkatalog og utlånsplattform bygget som skoleoppgave på frontendstudiet hos Noroff. Prosjektet fokuserer på rutestruktur i Next.js App Router, Server Actions, skjemavalidering og automatisert komponenttesting.",
      sections: [
        {
          title: "Rutestruktur og App Router-oppsett",
          paragraphs: [
            "Applikasjonen er delt inn i tydelige rutegrupper i Next.js App Router: en åpen publikumsdel ((home)) der besøkende kan utforske sjangre, søke i katalogen, se trailere og lese anmeldelser, og en beskyttet administrasjonsdel ((dashboard)/admin) for å legge til, redigere og slette filmer.",
            "Tilgangskontroll håndteres i middleware.ts, og hver rute har egne loading- og error-states slik at overganger og feilsituasjoner håndteres ryddig i grensesnittet.",
          ],
        },
        {
          title: "State, Server Actions og testing",
          paragraphs: [
            "Innlogging og mutasjoner mot filmkatalogen kjører via Next.js Server Actions, mens klient-state som filtre, utlånsstatus og temavalg (lys og mørk visning) holdes i Zustand.",
          ],
          bullets: [
            "Komponenttester: Sentrale visninger og interaksjoner er dekket med Jest og React Testing Library.",
            "Tilgjengelighet (Accessibility): Koden sjekkes med eslint-plugin-jsx-a11y, med semantiske skjemaelementer og tastaturstøtte.",
          ],
        },
      ],
    },
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
 * Always ordered to match the visual display order on the home page
 * (Independent projects first, followed by School projects).
 */
export const PROJECTS: ProjectItem[] = [
  ...INDEPENDENT_PROJECTS,
  ...SCHOOL_PROJECTS,
];

export const ITEMS: IndexItem[] = PROJECTS;

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

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
