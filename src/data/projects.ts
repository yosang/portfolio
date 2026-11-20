export type ItemCategory = "independent" | "school";

export interface CaseStudySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  tour: {
    bubble: string;
    audioSrc: string;
  };
}

export interface CaseStudyImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  afterSection?: number;
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
    ground: "#ffffff",
    media: {
      poster: "/projects/vgs-bordtennis-poster.jpg",
      video: "/projects/vgs-bordtennis.mp4?v=light-ground",
      alt: "Storskjerm med poengtavle og mobilvisning i VGS Bordtennis.",
    },
    tags: ["Node.js", "node:sqlite", "Socket.IO", "Pågår"],
    liveUrl: "https://vgsbordtennis.no/kiosk/demo",
    subtitle:
      "Sanntids turneringer og poengtavle for videregående skoler.",
    summary:
      "Pågående prosjekt ved Nord-Gudbrandsdal VGS laget for å inkludere flere elever i miljøet rundt bordtennisbordene i friminuttet, med QR kode ved bordet og live storskjerm i kantina.",
    highlights: [
      "Kampflyt: Gjestespill uten registrering og kobling via QR kode.",
      "Storskjerm: Live tavle i kantina via Socket.IO, tilpasset Infoskjermen.no på eldre TV skjermer.",
      "Arkitektur: Støtte for flere skoler på samme instans i Node.js, innebygd personvern og stresstestet med 100 samtidige spillere.",
    ],
    repoNote:
      "Privat repo mens løsningen er i aktiv utprøving. Jeg viser gjerne frem kodebasen og arkitekturen i en prat.",
    caseStudy: {
      role: "Arkitektur, design og utvikling",
      status: "I aktiv utprøving ved Nord-Gudbrandsdal VGS",
      intro:
        "VGS Bordtennis startet som et forsøk på inkludering i friminuttet, med mål om å lage noe artig som gjorde det enklere for flere elever å bli med i miljøet rundt bordtennisbordene og være fysisk aktive sammen. Løsningen er et sanntidssystem i Node.js laget for turneringer og poengtavle på storskjerm, med QR kode ved bordet.",
      wideImage: {
        src: "/projects/vgs/kiosk.jpg",
        alt: "Storskjermen i VGS Bordtennis med pallplasser, live poengtavle, rekkerter og BOSS markeringer.",
        caption:
          "Storskjermen (/kiosk) viser pallplasser, pågående kamper og hele tabellen live i kantina.",
        width: 1600,
        height: 1055,
        afterSection: 3,
      },
      mobileGallery: [
        {
          src: "/projects/vgs/mobile-turnering.jpg",
          alt: "Mobilvisning av turneringsfanen med aktiv kamp, tabell og bunnmeny med Skann QR.",
          caption: "Pågående kamp, tabell med utfordringer mot ansatte og hurtigknapp for QR kode nederst.",
          width: 768,
          height: 1480,
        },
        {
          src: "/projects/vgs/mobile-match.jpg",
          alt: "Mobilvisning av kampfanen med oversikt over bordene i kantina og vrimlearealet.",
          caption: "Sanntidsstatus på bordene (opptatt i kamp eller ledig) og hvem som holder bordet.",
          width: 768,
          height: 1480,
        },
        {
          src: "/projects/vgs/mobile-profil.jpg",
          alt: "Mobilvisning av profilfanen med valgt rekkert, statistikk, trofeer og kamphistorikk.",
          caption: "Spillerens aktive rekkert, seiersprosent, tid ved bordet, trofeer og byttehandel.",
          width: 768,
          height: 1480,
        },
      ],
      sections: [
        {
          title: "Bakgrunn og motivasjon",
          paragraphs: [
            "Til daglig jobber jeg med IKT drift og support på Nord-Gudbrandsdal VGS. I friminuttene så vi at det allerede var mye liv og aktivitet rundt bordtennisbordene i kantina, samtidig som det var en gjeng med elever som ikke helt greide å komme seg inn i miljøet og derfor endte opp med å sitte på telefonen i stedet.",
            "Prosjektet startet som et forsøk på inkludering og å skape enda mer engasjement rundt bordene. Som tidligere videospillnerd ville jeg lage noe artig som senket terskelen for å bli med, og som forsterket elevenes eget ønske om å delta aktivt og fysisk i en felles aktivitet i friminuttet.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/0.mp3",
            bubble:
              "Prosjektet startet fordi vi ville gjøre det enklere for flere elever å bli med rundt bordtennisbordene i friminuttet i stedet for å bli sittende på telefonen.",
          },
        },
        {
          title: "Lavterskel gjestespill og rask kampflyt ved bordet",
          paragraphs: [
            "Hele poenget med løsningen er at elevene skal spille bordtennis fremfor å stå og trykke på en skjerm. Derfor er flyten rundt selve bordet lagt opp slik at telefonen kun brukes i noen få sekunder før og etter kampen.",
            "Når to spillere skanner QR koden ved samme bord innen 45 sekunder, kobles de sammen og kampen starter automatisk. Telefonen legges i lomma mens settene spilles, og etterpå trykker den ene på ferdige hurtigknapper for resultatet (1-0, 2-0 eller 2-1) mens motstanderen bekrefter med ett trykk.",
          ],
          bullets: [
            "Gjestespill med poeng på vent: Elever uten konto kommer rett i kamp som gjest og kan samle opptil 3 seire på vent, som flyttes automatisk over når de oppretter profil etterpå.",
            "Raskt bytte ved bordet: Bordet frigjøres straks sluttstillingen sendes inn og husker vinneren i 20 minutter, slik at neste utfordrer kan skanne og trykke Spill mot vinneren direkte.",
            "Sesjonsbro mellom kamera og hjemskjerm (PWA): Siden iOS skiller lagring mellom Safari og apper på hjemskjermen, synkroniseres økten via manifestet når elevene skanner QR koden med kameraet.",
            "Sperrer mot juks og Boss i kantina: Daglige kvoter per spillerpar og automatisk varsel ved unaturlig raske kamper hindrer poengjuks, mens lærere deltar som Boss uten å ta plasser på elevtabellen.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/1.mp3",
            bubble:
              "Ved bordet skanner to spillere QR koden innen 45 sekunder, legger vekk mobilen mens de spiller, og kan til og med samle opptil tre seire på vent som gjest før de lager profil.",
          },
        },
        {
          title: "Turneringer, rekkerter og klasselag",
          paragraphs: [
            "Siden ulike skoler og friminutt har forskjellige behov, støtter turneringsmotoren både åpen poengstige (Kongen på haugen med automatisk påmelding ved bordet), sluttspill og Sveitserstil der alle får spille helt til slutt.",
            "For å skape samhold på tvers av trinn har systemet egne klasselag og digitale rekkerter med lokalt preg fra skolen og Innlandet. Hver rekkert teller kamper, seire og tidligere eiere før opplåste rekkerter flyttes til skolens premiehvelv når VG3 avslutter.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/2.mp3",
            bubble:
              "Turneringsmotoren støtter både åpen poengstige, sluttspill og sveitserstil, kombinert med klasselag og digitale rekkerter med lokalt preg.",
          },
        },
        {
          title: "Storskjermen i kantina og erfaringer med Infoskjermen.no",
          paragraphs: [
            "En av de mest lærerike tekniske utfordringene dukket opp da poengtavlen (/kiosk) skulle kjøre hele skoledagen gjennom Infoskjermen.no på eldre TV skjermer fra Samsung og LG. På vanlig mobil og PC fungerte alt på første forsøk, men inne i låste TV nettlesere oppførte visningen seg helt annerledes.",
            "I slike TV nettlesere krever systemet et fysisk brukerklikk før en <video> får spille. Kaller man video.play() i en iframe uten klikk, kaster ikke nettleseren en feilmelding, men lar bare promiset bli stående uavklart for alltid slik at videoen fryser på første bilde. I tillegg struper Chromium timere i kryssdomene iframes til hele minuttgrenser, slik at vanlig sekundbasert polling hoppes over.",
          ],
          bullets: [
            "24 fps animert WebP fremfor <video>: Alle animasjoner på storskjermen lages med ffmpeg som 24 fps animert WebP i et <picture> element med GIF som reserve.",
            "Tre synkroniserte visningslag og TV testing: Storskjermen leveres først som ferdig HTML fra serveren (SSR), oppgraderes til sanntids Socket.IO i moderne nettlesere, og har en egen klient i ren ES5 (med 3 sekunders polling og måling av faktisk medgått tid) for eldre TV skjermer. Reservevisningene kan testes direkte i vanlig nettleser med ?mode=es5 og ?mode=ssr.",
            "Diagnosestempel og tidsstyrt dvale: Nederst til høyre viser skjermen aktiv modus (LIVE, POLL, ES5 eller SSR) og laster seg selv inn på nytt automatisk når en ny versjon rulles ut. Utenfor skolens åpningstid går storskjermen i dvale og våkner igjen ved skolestart neste morgen.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/3.mp3",
            bubble:
              "På eldre TV skjermer i kantina frøs vanlig HTML video i iframes, så storskjermen bruker animert WebP og tre visningslag med egen ES5 reserve.",
          },
        },
        {
          title: "Arkitektur, drift og personvern",
          paragraphs: [
            "Løsningen er bygget i Node.js med innebygd node:sqlite i WAL modus og kun 5 npm pakker. Flere skoler kjører adskilt på samme instans via school_id og egne Socket.IO rom i en Docker container på Fly.io i Stockholm, stresstestet med 100 samtidige spillere uten feil.",
            "Tilgangsstyringen bygger på 4-nivås RBAC etter minste rettighet og ansvarsdeling: elev, ansatt spiller, lokal skolearrangør låst til egen skole, IKT drift på tvers av skoler, og en egen systemeierkonto for destruktive handlinger som skoleårsavslutning og skolesletting.",
            "Personvern (GDPR art. 25) ligger rett i datamodellen uten åpen chat mellom elever. I samme sekund en voksen arrangør godkjenner en elev, slettes navn og epost permanent fra databasen slik at kun kallenavn og en enveis HMAC-SHA256 hash står igjen. Arrangør kan også hente ut anonyme aktivitetsrapporter til A4 og Excel uten eksterne pakker.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/4.mp3",
            bubble:
              "Backenden kjører i Node.js med innebygd SQLite og bare fem npm pakker, stresstestet med hundre samtidige spillere og bygget slik at navn og epost slettes etter godkjenning.",
          },
        },
        {
          title: "Resultater etter tre dager i kantina",
          paragraphs: [
            "På de tre første skoledagene gikk aktiviteten fra 4 kamper mandag til 26 tirsdag og 66 onsdag, med 96 fullførte kamper og 14 timer aktiv bevegelse blant elevene. Mellom kl. 11 og 13 på onsdag var bordet i spill 55 av 60 minutter hver time (93 prosent av tiden), med bare 13 sekunders pause mellom parene.",
            "Målet var et opplegg som samler skolen på tvers og styrer seg selv i hverdagen uten dommer eller ekstraarbeid for ansatte. Uten beskjed fra voksne la elevene selv om fra tre sett til ett sett til 21 poeng på onsdag for å få unna køen.",
          ],
          bullets: [
            "Ett felles miljø på tvers: Alle 27 aktive spillere (8 av 10 registrerte elever) henger sammen i ett nettverk på 48 ulike par uten lukkede klikker, inkludert kamper mot lærere i kantina.",
            "Spilleglede utover poengkvoten: Mellom 60 og 80 prosent kom tilbake dagen etter, og elevene spilte 12 ekstra kamper rent for moro skyld etter at dagens kvote for poeng var fylt opp.",
            "96 prosent selvstyrt ved bordet: Begge bekrefter stillingen på mobilen på 4 sekunder før rekkerten går videre, og i nær 3 av 10 kamper er det den som tapte som legger inn resultatet.",
            "Veien videre i kantina: Vi har lagt inn timeplanstyring og enkel moderering av kallenavn. Neste steg er et bord nummer 2 i lunsjen, faste ukesrunder der elevene stemmer frem format, og lagkamp mellom klasser.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/5.mp3",
            bubble:
              "På bare tre dager ble det spilt nittiseks fullførte kamper med fjorten timer fysisk bevegelse, der bordet var i spill nesten hele midttimen og elevene ordnet alt selv.",
          },
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/0.mp3",
      bubble:
        "Vi starter med VGS Bordtennis, et hobbyprosjekt på fritiden med QR kode ved bordet og live storskjerm i kantina.",
    },
    aiContext: [
      "Pågående hobbyprosjekt jeg bygger på fritiden. Bakgrunnen var at vi så mye aktivitet rundt bordtennisbordene i kantina, samtidig som en gjeng med elever ikke helt greide å komme seg inn i miljøet og derfor havnet på telefonen. Vi ville bytte passiv skjermtid med fysisk bevegelse, knytte elever og voksne sammen på tvers, og lage et opplegg som styrer seg selv med fullt personvern og null ekstraarbeid for ansatte. Flere skoler kan bruke samme løsning med hvert sitt adskilte område (`/?school=<code>` og `/kiosk/<slug>`).",
      "Viktig grense hvis noen spør 'Laget du dette på jobb?' eller 'Betalte skolen for dette?': svar rolig og rett frem at nei, jobben min på skolen er kun IKT drift og support, og VGS Bordtennis er et rent hobbyprosjekt jeg har laget på egen fritid, ulønnet og på eget domene og server. Ikke nevn dette uoppfordret når folk bare spør vanlig om funksjonene i appen.",
      "Lavterskel gjestespill og kampflyt ved bordet: gjester uten konto som skanner QR koden ved bordet starter rett i kamp som Gjest uten å fylle ut skjema først, og kan samle opptil 3 seire (9 poeng) på vent. Når de oppretter profil eller logger inn på en eksisterende bruker etterpå, flyttes kamper og poeng automatisk over på kontoen mens den midlertidige gjesten slettes. En egen sesjonsbro i manifestet holder elevene innlogget på tvers av mobilkameraet og appen på hjemskjermen (PWA). Når to spillere skanner samme bord innen 45 sekunder, kobles de automatisk sammen, og bordet frigjøres straks resultatet legges inn og husker vinneren i 20 minutter slik at neste utfordrer kan trykke Spill mot vinneren direkte. Lærere og ansatte deltar som Boss i kantina uten å ta plasser på elevtabellen.",
      "Turneringer og rekkerter: støtter Kongen på haugen (åpen poengstige med 3 poeng per seier, automatisk påmelding ved bordet og daglige kvoter per spillerpar), sluttspill og Sveitserstil (med Buchholz), i tillegg til klasselag og digitale rekkerter med lokalt preg.",
      "Resultater etter 3 dager i drift ved Nord-Gudbrandsdal VGS: fra 4 kamper mandag til 26 tirsdag og 66 onsdag, totalt 96 fullførte kamper (0 avbrutte) og 14 timer aktiv bevegelse blant elevene. 27 av 34 verifiserte brukere (8 av 10 registrerte elever) har allerede spilt. Mellom kl. 11 og 13 på onsdag var bordet i aktivt spill 55 av 60 minutter hver time (93 prosent av tiden), med 13 sekunders bytte mellom parene. Uten beskjed fra voksne la elevene selv om fra best av tre sett mandag til ett sett til 21 poeng i samtlige 66 kamper onsdag (median 3 minutter og 37 sekunder) for å få unna køen. Mellom 60 og 80 prosent kom tilbake dagen etter, og 12 ekstra kamper ble spilt rent for moro skyld etter at dagens kvote for poeng var fylt opp (35 prosent frie vennskapskamper på onsdag). Alle 27 aktive spillere henger sammen i ett felles nettverk på 48 ulike par uten lukkede klikker (68 prosent har vunnet minst en kamp, og elevene vant 4 av 5 oppgjør mot ansatte på onsdag). 96 prosent av kampene styres av elevene selv uten dommer, der begge bekrefter stillingen på mobilen på 4 sekunder ved bordet, i nær 3 av 10 kamper er det taperen som legger inn resultatet, og kun 2 av 96 kamper har hatt uenighet (0 konflikter om bordet). Vi la raskt inn timeplanstyring (steng bordet digitalt ved behov) og moderering av kallenavn, og neste steg er et bord nummer 2 i kantina for å doble plassen og slippe mer beskjedne elever lettere til, faste ukesrunder på fredager der elevene stemmer frem format, og lagkamp mellom klasser i uke 3.",
      "Teknisk oppsett og storskjermen i kantina (`/kiosk`): bygget i Node.js med innebygd `node:sqlite` (i `WAL` modus) og kun 5 npm pakker, kjørende i Docker på Fly.io i Stockholm med CalVer utgivelser og automatisk `VACUUM INTO` sikkerhetskopi. Tilgangsstyringen bygger på 4-nivås RBAC etter minste rettighet og ansvarsdeling: elev, ansatt spiller, lokal skolearrangør låst til egen skole, IKT drift på tvers av skoler, og en egen systemeierkonto for destruktive handlinger som skoleårsavslutning og skolesletting. Storskjermen er tilpasset Infoskjermen.no på eldre TV skjermer: bruker 24 fps animert WebP i stedet for `<video>` fordi TV nettleseren fryser videoer på første bilde, unngår sekundsjekker i `setInterval` fordi Chromium struper timere i iframes til minuttgrenser, og har 3 synkroniserte lag (SSR, Socket.IO og ren ES5 som kan testes med `?mode=es5` og `?mode=ssr`) samt diagnosestempel og dvalemodus. Stresstestet med 100 samtidige spillere fordelt på 2 skoler uten feil.",
      "Personvern (nevn kun kort hvis det er naturlig eller noen spør): midlertidig navn og epost slettes (`NULL`) så snart en arrangør har godkjent eleven (eller automatisk etter 14 dager, og tomme gjesteøkter etter 24 timer), slik at kun en enveis `HMAC-SHA256` hash lagres. Løsningen har ingen fritekstchat, støtter selvbetjent sletting av konto og kan lage anonymisert aktivitetsrapport med ukentlig puls og hverdagsrytme (A4 og Excel uten ekstra pakker).",
    ],
  },
  {
    slug: "ember-booking",
    title: "Ember Booking",
    year: "2026",
    category: "independent",
    ground: "#ffffff",
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
      "Brukeropplevelse: Jobber løpende med struktur, accessibility og enkel flyt på tvers av plattformen.",
    ],
    caseStudy: {
      role: "Medgründer, med ansvar for merkevare, design, copy, frontend og brukeropplevelse",
      status: "I kommersiell drift på emberbooking.no",
      intro:
        "Ember Booking er et norsk bookingsystem jeg driver sammen med Kim for bedrifter innen badstue, treningsstudio og utleie. Der har jeg ansvaret for merkevaren, posisjoneringen, tekstene, designsystemet og frontenden på emberbooking.no.",
      wideImage: {
        src: "/projects/ember/casestudy-ronny.jpg",
        alt: "Kundehistorie på emberbooking.no med Honndalen Gym og Sauna som sparer 5 til 7 timer i måneden.",
        caption:
          "Kundehistorier på emberbooking.no viser konkret hvordan pilotkunder som Honndalen Gym og Sauna sparer 5 til 7 timer hver måned.",
        width: 1600,
        height: 1016,
        afterSection: 2,
      },
      sections: [
        {
          title: "Målgruppe og innsikt i hvem vi bygger for",
          paragraphs: [
            "Da Kim og jeg skulle forme merkevaren og budskapet for Ember Booking, startet arbeidet med å definere hvem den ideelle kunden vår er, og like viktig hvem vi venter med i første omgang. Målgruppen vår er travle eiere av små og mellomstore bedrifter som har mange baller i luften, og som vil bruke minst mulig tid på administrasjon og mest mulig tid på kundene sine, kampanjer og drift.",
            "To konkrete kundeprofiler og smertepunkter la føringene for både posisjonering, tekst og struktur på nettsiden:",
          ],
          bullets: [
            "Ronny (Honndalen Gym og Sauna): Driver treningsstudio, gruppetimer og badstue. Før Ember gikk det med opptil en hel arbeidsdag i måneden på å hente ut rapporter, kryssjekke Vipps betalinger i Excel og føre bilag manuelt inn i Tripletex.",
            "Deving (ATV utleie og naturopplevelser på Vestlandet): Frustrert over etablerte utleiesystemer (som Periode.no, Gibbs og Sharefox) som markedsfører seg som enkle, men som i praksis krever lang opplæring og er fulle av funksjoner bedriften ikke trenger.",
          ],
          tour: {
            audioSrc: "/audio/cases/ember-booking/0.mp3",
            bubble:
              "Arbeidet med Ember Booking startet med innsikt fra travle bedriftseiere som brukte altfor mye tid på å avstemme Vipps, Excel og regnskap manuelt.",
          },
        },
        {
          title: "Posisjonering og tre konkrete løfter",
          paragraphs: [
            "Innsikten fra bedriftseierne gjorde det enkelt å skrelle bort vag markedsføringssjargong. Når noen spør hva som skiller Ember Booking fra eldre systemer, koker posisjoneringen og copyen på nettsiden ned til tre konkrete løfter:",
          ],
          bullets: [
            "Vipps registrering på sekunder uten lange skjemaer: Mange systemer tvinger gjesten til å fylle ut lange skjemaer og opprette passord bare for å bestille en time. Med Vipps eller kort (Stripe og PayPal) er kunden registrert og ferdig betalt på sekunder.",
            "Ferdig avstemt regnskap: Alle transaksjoner avstemmes automatisk mot Tripletex og Fiken, og systemet sender ut SMS og epost ved hver reservasjon. Bedriftseieren trenger kun å se over tallene i stedet for å føre manuelt.",
            "Klar til bruk på en dag uten opplæringskurs: Systemet inneholder kun funksjonaliteten utleiebedrifter faktisk bruker i hverdagen, uten overflødige moduler som gjør oppsettet tungvint.",
          ],
          tour: {
            audioSrc: "/audio/cases/ember-booking/1.mp3",
            bubble:
              "Ut fra dette bygde jeg opp budskapet rundt rask Vipps betaling uten lange skjemaer, ferdig avstemt regnskap mot Tripletex og Fiken, og et system som er klart på en dag.",
          },
        },
        {
          title: "Informasjonsarkitektur og tillitsreisen på emberbooking.no",
          paragraphs: [
            "Selve oppbyggingen av emberbooking.no (bygget i Next.js 16) er strukturert for å svare på spørsmålene og tvilen en bedriftseier sitter med før de tar steget og bytter system:",
          ],
          bullets: [
            "Over folden (Hero): Tydelig verdiforslag ('Ett bookingsystem for alle dine ressurser'), kort forklaring av hvordan booking, betaling og regnskap henger sammen, primær handlingsknapp og lav terskel ('Ingen bindingstid').",
            "Hvorfor Ember (3 raske kort under Hero): Viser forskjellen fra tunge konkurrenter ved første øyekast med hurtig Vipps utsjekk, spisset funksjonalitet og automatisert arbeidshverdag.",
            "Fra smertepunkt til løsning: Setter først ord på frustrasjonen med Excel ark, manuell eksport og import og tungvinte systemer, før løsningen presenteres med automatisk regnskap, rask betaling og ressursstyring.",
            "Bruksområder og sosial tillit (Social Proof): Bransjekort (som badstue med planlagt styring av ovn og belysning, treningssenter og utleie av ATV og bil) og kundehistorier fra reelle pilotkunder som sparer 5 til 7 timer i måneden er spredt naturlig nedover siden.",
            "Åpne priser og FAQ: Tydelige pakker uten skjulte kostnader og svar på de vanligste spørsmålene om regnskapsintegrasjon, oppsett og bindingstid før avsluttende handlingsknapp.",
          ],
          tour: {
            audioSrc: "/audio/cases/ember-booking/2.mp3",
            bubble:
              "Landingssiden i Next.js 16 er bygget opp steg for steg fra konkrete smertepunkter til kundehistorier fra pilotkunder som sparer fem til sju timer i måneden.",
          },
        },
        {
          title: "Designsystem og samarbeid i hverdagen",
          paragraphs: [
            "Kim og jeg tar jevnlige statusmøter der vi går gjennom veien videre for bedriften, legger strategi og fordeler oppgavene mellom oss. Mitt ansvar er alt som møter brukeren visuelt og i frontenden, fra merkevaren, designsystemet og markedsføringssidene til at brukeropplevelsen holder seg rolig, lesbar og ryddig på både mobil og PC.",
          ],
          tour: {
            audioSrc: "/audio/cases/ember-booking/3.mp3",
            bubble:
              "I hverdagen har jeg ansvaret for designsystemet, merkevaren og frontenden, slik at hele plattformen holder seg ryddig og enkel å bruke.",
          },
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/1.mp3",
      bubble:
        "Videre har vi Ember Booking, et norsk bookingsystem jeg driver sammen med Kim der jeg har ansvaret for design og frontend.",
    },
    aiContext: [
      "Ember Booking er et norsk bookingsystem jeg driver sammen med Kim for blant annet badstue, treningsstudio og utleie av ATV og bil.",
      "Slik jobber Kim og jeg sammen: vi tar et statusmøte sammen i ny og ne der vi prater om veien videre for bedriften, legger strategi og noterer hva som må jobbes med, og så blir vi enige om hvem som har ansvaret for hva.",
      "Min rolle er å vedlikeholde og videreutvikle merkevaren, posisjoneringen, copy, designet, frontenden og markedsføringssidene på `emberbooking.no` (bygget i Next.js 16), og sørge for at brukeropplevelsen er enkel og ryddig. Ikke si at jeg har bygget selve backend motoren, smartlås styringen eller regnskapsintegrasjonene; hold svarene om Ember fokusert på mitt arbeid med merkevare, målgruppeinnsikt, copy, designsystem, landingssider, frontend og brukeropplevelse.",
      "Fra arbeidet vårt med merkevare og landingssider spisset vi målgruppen mot travle bedriftseiere (som Ronny på Honndalen Gym og Sauna som tidligere brukte en hel arbeidsdag på å avstemme Vipps, Excel og Tripletex manuelt og nå sparer 5 til 7 timer i måneden, og Deving innen ATV utleie på Vestlandet som var lei av innviklede systemer). Ut fra dette bygde jeg opp budskapet og informasjonsarkitekturen på emberbooking.no rundt tre løfter, som er 1) lynrask registrering og betaling med Vipps uten lange skjemaer, 2) automatisk avstemt regnskap mot Tripletex og Fiken, og 3) et enkelt system som er klart på en dag uten unødvendige funksjoner.",
    ],
  },
  {
    slug: "medcare-clinical",
    title: "MedCare Clinical",
    year: "2026",
    category: "school",
    ground: "#ffffff",
    media: {
      poster: "/projects/medcare-poster.jpg",
      alt: "Timebestilling, kalender og egne avtaler i MedCare Clinical.",
    },
    tags: ["C#", ".NET 9", "EF Core", "MySQL", "React"],
    repoUrl: "https://github.com/yosang/medcare-clinical",
    subtitle:
      "Timebestilling på tvers av klinikker og spesialiteter i C#, .NET 9 og React.",
    summary:
      "Fullstack timebestillingssystem for klinikker bygget i C#, .NET 9 og React, der pasienter kan søke opp leger og bestille time både som gjest og innlogget bruker.",
    highlights: [
      "Backend: REST API i C# og .NET 9 med Entity Framework Core mot MySQL, soft delete ved avbestilling og Swagger.",
      "Sikkerhet og flyt: JWT innlogging med refresh token i cookie, gjestebooking, pasientprofil og eget adminpanel med full CRUD.",
      "Frontend og drift: React med TanStack Query, Zustand og Zod, satt opp på Vercel mot Azure Web App og Railway.",
    ],
    caseStudy: {
      role: "Fullstackutvikler (Eksamensprosjekt i Backend 2026 hos Noroff)",
      status: "Fullført eksamensprosjekt, åpen kildekode",
      intro:
        "MedCare Clinical ble bygget over fem uker som avsluttende eksamensprosjekt på det toårige studiet i backendutvikling hos Noroff. Oppgaven var å planlegge, modellere og utvikle et komplett timebestillingssystem for helseklinikker i C# og .NET 9 med MySQL og en tilhørende klient i React.",
      sections: [
        {
          title: "Normalisering (3NF), skjemasjekk og CI fra dag en",
          paragraphs: [
            "Før jeg skrev en eneste linje C#, brukte jeg de første dagene på å gå gjennom kravspesifikasjonen, repetere normalisering og tegne ut ER diagrammet i tredje normalform (3NF). Blant annet skilte jeg ut byer (City), kategorier og statuser (Status) som egne tabeller knyttet til klinikker og timeavtaler.",
            "Da modellene og relasjonene var satt opp i Entity Framework Core, ville jeg være helt sikker på at koden i C# ga den databasestrukturen jeg hadde planlagt. Jeg kjørte derfor mysqldump fra MySQL og importerte skjemaet tilbake i dbdiagram.io for å kontrollere at tabeller, fremmednøkler og unike indekser stemte overens med ER diagrammet.",
          ],
          bullets: [
            "GlobalExceptionHandler: Satte opp sentral feilhåndtering tidlig i uke 1 slik at tjenestelaget slapp gjentakende try/catch i hver metode.",
            "Swagger med XML dokumentasjon: Konfigurerte Swagger på /doc med XML kommentarer, eksempeldata og responskoder for hvert endepunkt.",
            "GitHub Actions CI: La inn automatisk byggesjekk ved hver push helt fra starten, slik at ingen commit kunne brekke byggeprosessen i det stille.",
          ],
          tour: {
            audioSrc: "/audio/cases/medcare-clinical/0.mp3",
            bubble:
              "Før jeg skrev kode tegnet jeg databasen i tredje normalform, og importerte skjemaet fra MySQL tilbake i dbdiagram for å sjekke at tabeller og unike indekser stemte med planen.",
          },
        },
        {
          title: "Egne mappere fremfor AutoMapper og oppdagelsen med .Select og .Include",
          paragraphs: [
            "Etter hvert som antallet entiteter og DTO objekter vokste, ble manuell mapping i tjenestelaget rotete. Jeg vurderte biblioteker som AutoMapper og Mapperly, men valgte å skrive egne extension metoder i C# (som ToAppointmentWithDetailsDTO og ToClinicDTO) sammen med en UpdateWith hjelpemetode for delvise oppdateringer. Det holdt tjenestene lesbare uten ekstra pakker.",
            "Denne oppryddingen viste en viktig detalj i hvordan EF Core bygger SQL. Så lenge mappingen lå direkte inne i et .Select(a => new DTO { Doctor = ... }) uttrykk, skjønte EF Core at den måtte hente relasjonen til Doctor automatisk. Da jeg byttet til .Select(a => a.ToAppointmentWithDetailsDTO()), klarte ikke EF Core lenger å lese uttrykkstreet og kastet feil fordi relaterte data manglet. Løsningen var å legge inn eksplisitte kall til .Include() i spørringene.",
            "Samme uke endret jeg fødselsnummer (NationalIdentityNumber) fra int til string på 11 tegn, siden norske fødselsnumre kan starte med 0 og aldri brukes til utregninger.",
          ],
          tour: {
            audioSrc: "/audio/cases/medcare-clinical/1.mp3",
            bubble:
              "Etter hvert som modellene vokste skrev jeg egne extension mappere i C# fremfor AutoMapper, og oppdaget at EF Core krever eksplisitte kall til Include når mappingen flyttes ut av Select.",
          },
        },
        {
          title: "Overlappende legetimer og duplikatsjekk for gjester",
          paragraphs: [
            "For å hindre dobbeltbooking la jeg først inn sammensatte unike indekser i databasen på DoctorId + AppointmentDate og PatientId + AppointmentDate. Under testing oppdaget jeg at indeksen kun stoppet to timer som startet på nøyaktig samme minutt, men ikke hindret en ny bestilling klokken 10:15 hvis legen allerede hadde en time på 30 minutter fra 10:00 til 10:30.",
            "Jeg måtte sette meg ned med penn og papir og tegne opp tidsaksene for å være 100 prosent sikker på at datokontrollen fanget alle varianter av overlapp, både ved ny bestilling og når en registrert pasient endrer en eksisterende avtale.",
          ],
          bullets: [
            "Gjenbruk av pasientprofil ved gjestebooking: Pasienter uten konto kan bestille time med navn, fødselsdato, telefon og epost. Hvis samme person bestiller igjen senere eller oppretter full brukerkonto, gjenbruker og oppgraderer backenden den eksisterende pasientraden i stedet for å lage duplikater.",
            "Soft delete ved avbestilling: Avbestilte timer beholdes med status i databasen for historikk, uten å blokkere tidspunktet for nye pasienter.",
          ],
          tour: {
            audioSrc: "/audio/cases/medcare-clinical/2.mp3",
            bubble:
              "For å hindre dobbeltbooking tegnet jeg opp tidsaksene på papir så kontrollen fanger alle delvise overlapp mellom legetimer, samtidig som gjestebooking gjenbruker eksisterende pasientrader.",
          },
        },
        {
          title: "Fra Zustand til TanStack Query, minnebasert JWT og RBAC",
          paragraphs: [
            "I starten av arbeidet med frontenden brukte jeg Zustand til alt, inkludert å hente lister med leger og timeavtaler. Det ga mye gjentakende kode og unødvendige kall til useEffect. Selv om jeg lå etter skjema etter en runde med influensa midt i prosjektet, valgte jeg å skrive om datahentingen til TanStack Query (useQuery, useMutation og useInfiniteQuery med paginering i backend), mens Zustand kun beholdt ren klientstate som aktivt token og tema.",
          ],
          bullets: [
            "Kortlivet Access Token i minnet + httpOnly Refresh Cookie: Access token (1 til 15 minutter) holdes kun i minnet. Når et beskyttet endepunkt svarer med 401, kaller klienten automatisk POST /api/Auth/refresh med en httpOnly cookie (7 dager) og fornyer tilgangen uten at brukeren merker det.",
            "Rollebasert tilgangskontroll (RBAC): For at vanlige innloggede pasienter ikke skulle kunne endre oppslagstabeller som klinikker, byer og spesialiteter, la jeg til en egen Role tabell (Patient og Admin) og låste skriveendepunktene med [Authorize(Roles = \"Admin\")].",
            "Innspurt og optimalisering: Brukte react-scan for å rydde bort unødvendige oppdateringer av visningen, samlet duplisert JWT oppsett i JWTTokenValidationParameters, flyttet CORS innstillinger ut i appsettings.json, og flyttet all sortering og filtrering av timeavtaler fra tabellen i frontend over til backend.",
          ],
          tour: {
            audioSrc: "/audio/cases/medcare-clinical/3.mp3",
            bubble:
              "Til slutt skrev jeg om datahentingen i React fra Zustand til TanStack Query med paginering i backend, kortlivede JWT tokens i minnet og rollebasert tilgang for admin.",
          },
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
      "Viktige tekniske valg og feilsøking underveis (fra changelog.md): 1) Designet databasen i 3. normalform (3NF) og brukte mysqldump + dbdiagram.io for å sjekke at migrasjonene fra EF Core i MySQL stemte med ER diagrammet. 2) Valgte egne extension metoder i C# (og UpdateWith for delvise oppdateringer) fremfor AutoMapper, og oppdaget at EF Core krevde eksplisitte kall til .Include() når mappingen ble flyttet ut av inline .Select() uttrykk. 3) Oppdaget at unike indekser kun stoppet timer på nøyaktig samme minutt, så jeg tegnet opp tidsaksene på papir for å lage overlappssjekk på start og sluttid. 4) Gjenbruker eksisterende gjestepasienter (navn + fødselsdato + epost) når de bestiller på nytt eller registrerer konto. 5) Flyttet datahenting i frontend fra Zustand + useEffect over til TanStack Query (med useInfiniteQuery og paginering, sortering og filtrering i backend), la til RBAC med egen Role tabell (Patient og Admin), og satte opp kortlivede JWT access tokens i minnet med 7 dagers httpOnly refresh cookie.",
    ],
  },
  {
    slug: "interaktiv-portefolje",
    title: "Interaktiv Portefølje",
    year: "2026",
    category: "independent",
    ground: "#ffffff",
    media: {
      poster: "/projects/portfolio-poster.jpg",
      alt: "Fullskjerms 3D studio og KI metodikk i Interaktiv Portefølje.",
    },
    tags: ["Next.js 16", "Three.js Worker", "Gemini TTS", "KI assistert"],
    repoUrl: "https://github.com/yosang/portfolio",
    subtitle:
      "Samtalestyrt grensesnitt med 3D skannet avatar, stemmekloning og visuell navigasjon.",
    summary:
      "Laget for at du kan snakke med en KI versjon av meg i en vanlig samtale mens den viser deg rundt på siden. Samtidig viser oppsettet hvordan sanntids tale, visuell styring og strukturerte fagdata kan løse reelle oppgaver innen helse, utdanning og kundeservice.",
    highlights: [
      "Samtalegrensesnitt: KI Yosmel tar besøkende gjennom en visuell omvisning i prosjektene, svarer med stemme og henter frem CV ved behov.",
      "Bruksområder: Samme oppsett kan gi eldre og pasienter muntlig veiledning i helsevesenet, brukes til muntlig trening i skolen eller løse kundeservice for bedrifter.",
      "Arkitektur og sikkerhet: Delt 3D modell med 20 blendshapes i en egen OffscreenCanvas Web Worker på 60 fps, kombinert med sanntids TTS, tale til tekst og vern mot prompt injection.",
    ],
    caseStudy: {
      role: "Design, 3D integrasjon og fullstackutvikling",
      status: "I produksjon på yosmel.no (åpen kildekode)",
      intro:
        "Målet med porteføljen var å lage en løsning der besøkende kan snakke med en KI versjon av meg i en vanlig samtale mens den viser rundt på skjermen, og samtidig vise hvordan sanntids tale og visuell styring kan løse oppgaver i helsevesenet, skolen og kundeservice. Løsningen kjører en delt 3D modell i en egen Web Worker, strømmer svar og klonet stemme fra Gemini over SSE, og holder seg kun til godkjente fakta.",
      sections: [
        {
          title: "Praktiske bruksområder utenfor en portefølje",
          paragraphs: [
            "Tanken bak oppsettet var å teste hvor nær en vanlig muntlig samtale man kommer på web når modellen snakker med naturlig stemme, styrer det du ser på skjermen, og samtidig holder seg strengt til godkjente fakta.",
            "Samme oppsett har tydelig nytteverdi i andre bransjer. I helsevesenet kan det gi eldre og pasienter rolig muntlig veiledning gjennom skjemaer og forberedelser, i skolen kan elever øve muntlig i trygge rammer, og i kundeservice kan bedrifter hjelpe brukere visuelt gjennom en sak uten at modellen finner på egne svar.",
          ],
          tour: {
            audioSrc: "/audio/cases/interaktiv-portefolje/0.mp3",
            bubble:
              "Målet med porteføljen var å teste hvordan en muntlig samtale som styrer skjermen ut fra faste fakta også kan brukes i helsevesenet, skolen og kundeservice.",
          },
        },
        {
          title: "Delt 3D modell i egen Web Worker på 60 fps",
          paragraphs: [
            "Avataren er en 3D skanning av meg med 20 blendshapes for munnsynk, blunking og ansiktsuttrykk, kombinert med skjelettstyring av nakke og hode. For at 3D visningen aldri skal blokkere hovedtråden eller gjøre rulling på siden treg, kjører lerretet i en egen OffscreenCanvas Web Worker (avatar.worker.ts).",
            "En og samme WebGL og Worker instans flyttes direkte via en DOM portal mellom seksjonen på forsiden, det flytende hjørnepanelet og fullskjermssiden (/chat), slik at modellen kun lastes inn en gang i minnet. Three.js starter ved første interaksjon og pauser automatisk via IntersectionObserver når avataren er ute av synsfeltet.",
          ],
          tour: {
            audioSrc: "/audio/cases/interaktiv-portefolje/1.mp3",
            bubble:
              "Selv om 3D figuren har tjue blendshapes for munnsynk og uttrykk, kjører den i en egen OffscreenCanvas Web Worker som gjenbrukes på tvers av hele siden på 60 fps.",
          },
        },
        {
          title: "Synkronisert stemmekloning og tale til tekst",
          paragraphs: [
            "Stemmen er klonet fra et 17 sekunders lydopptak og strømmes i sanntid over SSE fra /api/chat. Når lyden er på, venter chatboblen med å vises til første lydpakke faktisk starter avspilling i Web Audio API, slik at tekst, stemme og leppebevegelser treffer likt.",
          ],
          bullets: [
            "Tale til tekst (/api/transcribe): Besøkende kan snakke direkte inn via mikrofonen i chatten, med en egen ordliste for prosjektnavn og faguttrykk.",
            "Kun godkjente fakta: Systemprompten bygges dynamisk fra samme datakilde som selve nettsiden (projects.ts og portfolio.ts), med klare grenser for hva modellen skal svare på og når den skal henvise videre på epost.",
          ],
          tour: {
            audioSrc: "/audio/cases/interaktiv-portefolje/2.mp3",
            bubble:
              "Stemmen er klonet fra sytten sekunder lydopptak, og chatboblene venter på Web Audio API slik at tekst, tale og leppebevegelser starter helt likt.",
          },
        },
        {
          title: "Sikring mot prompt injection i praksis",
          paragraphs: [
            "Når en språkmodell får styre hva som skjer på siden og i tillegg svarer med min egen klonede stemme, kan man ikke stole blindt på det som kommer inn fra nettleseren. Oppsettet følger derfor prinsippet i Simon Willisons The Lethal Trifecta. Siden chatten er åpen for meldinger utenfra, har modellen verken tilgang til private data eller mulighet til å sende data videre ut på nettet.",
            "Siden en språkmodell alltid kan bli forsøkt lurt, ligger disse sjekkene i vanlig TypeScript kode rundt modellen.",
          ],
          bullets: [
            "Kun åpne data og låst nettleser: Modellen har ingen database, ingen verktøykall og ser kun de offentlige tekstene på siden. Boblene vises som ren tekst i React uten eksterne bilder, og nettleseren er låst til å kun hente og sende data på eget domene.",
            "Skille regler og brukerinput: Systemprompten settes kun sammen av faste filer på serveren. Meldinger fra chatten renses før de sendes inn, og serveren sjekker at tidligere svar i tråden faktisk er ekte slik at ingen kan forfalske samtalen.",
            "Fast liste over lovlige handlinger og vern av stemmen: Tagger som bytter side eller scroller til prosjekter sjekkes mot en fast liste av gyldige sider på både server og klient, og CV slippes kun gjennom når du faktisk ber om den. Før et svar sendes til stemmekloning, sjekker koden lengden og stopper forsøk på å få stemmen til å lese opp uønsket tekst.",
            "Ingen lagring og faste kvoter: Alle kall for chat, stemme og tale til tekst kjører med lagring slått av hos Gemini, sammen med sjekk av at kallet kommer fra min egen side og faste grenser per minutt og per dag i minnet.",
          ],
          tour: {
            audioSrc: "/audio/cases/interaktiv-portefolje/3.mp3",
            bubble:
              "For å sikre mot prompt injection ligger sjekkene i vanlig TypeScript kode rundt modellen, der meldinger renses og alle tagger som styrer siden sjekkes mot faste lister på server og klient.",
          },
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/portfolio.mp3",
      bubble:
        "Her er selve porteføljen du er på nå, laget for at du kan snakke med en KI versjon av meg som viser deg rundt.",
    },
    aiContext: [
      "Denne porteføljen (`yosmel.no`, kildekode på `github.com/yosang/portfolio`) utforsker hvordan KI kan gjøre et grensesnitt enklere å bruke, der man snakker med KI Yosmel i en vanlig samtale mens den tar leseren gjennom en visuell tour av prosjekter, åpner detaljer, svarer på spørsmål og henter frem CV uten at man må klikke og lete rundt selv.",
      "Hva teknologien kan brukes til utenfor en portefølje: tanken er å komme nærmere en vanlig samtale der den prater med stemme, henter opp riktig sted på skjermen så du slipper å lete selv, og holder seg kun til godkjente fakta. Jeg ser for meg at bedrifter kan bruke slik teknologi til å hjelpe kunder i kundeservice eller på telefon. Samtidig kan skoler bruke det til muntlig trening, og i helsevesenet kan det gi eldre og pasienter enkel veiledning.",
      "Samtidig var dette prosjektet der jeg høsten 2026 for alvor utfordret meg selv på strukturert KI assistert utvikling, med egne regler i `AGENTS.md` og `github.com/yosang/skills` (`ui-craft`, `natural-copy` og `lean-architecture`).",
      "Teknisk kjører 3D skanningen (T2 modell med 20 blendshapes for munnsynk, blunking og uttrykk) på Three.js i en delt `OffscreenCanvas` Web Worker på 60 fps som gjenbrukes på tvers av sidene via en portal, mens svar og klonet stemme (fra 17 sekunder opptak) strømmes fra Gemini over SSE.",
      "Sikkerhet og vern mot prompt injection: oppsettet følger Simon Willisons The Lethal Trifecta. Siden chatten er åpen for meldinger og tale fra hvem som helst, har modellen verken tilgang til private data eller mulighet til å sende ting videre ut på nettet. Selve sikkerheten ligger i vanlig TypeScript kode rundt modellen, der 1) systemprompten bygges kun av faste filer på serveren mens meldinger utenfra renses, og serveren sjekker at tidligere svar i tråden er ekte så ingen kan forfalske samtalen, 2) svarene vises som ren tekst uten eksterne bilder og alle tagger som bytter side, scroller eller viser CV sjekkes mot en fast liste på både server og klient, 3) den klonede stemmen har egne sjekker i kode på lengde og innhold så ingen kan bruke den til å lese opp samtykker eller uønsket tekst, og 4) alle kall til Gemini kjører med lagring slått av og faste grenser per minutt og per dag i minnet.",
    ],
  },
  {
    slug: "skills",
    title: "Agent Skills",
    year: "2026",
    category: "independent",
    ground: "#ffffff",
    media: {
      poster: "/projects/skills-poster.jpg",
      alt: "Oversikt over SKILL.md moduler og AGENTS.md i github.com/yosang/skills.",
    },
    tags: ["SKILL.md", "AGENTS.md", "Open Source"],
    repoUrl: "https://github.com/yosang/skills",
    subtitle:
      "Egne SKILL.md filer og AGENTS.md regler for arkitektur, design og språk i KI assistert utvikling.",
    summary:
      "Åpent repo med reglene og rammene jeg bruker når jeg jobber med kodeagenter, samlet i tre moduler som brukes på tvers av prosjekter.",
    highlights: [
      "ui-craft: Faste rammer for fargebruk, typografi, avstander og rolige flater i grensesnittet.",
      "lean-architecture: Regler for slank arkitektur, korte kontekster og hyppig versjonskontroll.",
      "natural-copy: Retningslinjer for naturlig og rett frem språk i tekst, dokumentasjon og tale.",
    ],
    caseStudy: {
      role: "Forfatter og vedlikeholder (Open Source)",
      status: "Offentlig repo på github.com/yosang/skills",
      intro:
        "Da jeg tok i bruk kodeagenter mer systematisk høsten 2026, så jeg raskt at kvaliteten står og faller på rammene man setter før man begynner å bygge. Derfor samlet jeg reglene mine i et åpent repo på github.com/yosang/skills, med faste krav til slank arkitektur, rolige grensesnitt og naturlig språk på tvers av prosjekter.",
      sections: [
        {
          title: "Hvorfor jeg samlet reglene i et eget repo",
          paragraphs: [
            "Da jeg høsten 2026 gikk inn for å bruke KI assistert programvareutvikling mer systematisk, merket jeg raskt at kvaliteten står og faller på rammene man setter i forkant. Uten faste begrensninger legger språkmodeller gjerne til unødvendige abstraksjoner, defensiv kode som skjuler feil, og visuell støy.",
            "Ved å samle reglene i et eget repo som følger Agent Skills standarden (kompatibelt med Claude Code, Cursor, Antigravity og Gemini CLI), kan jeg bruke de samme kravene i hvert nytt prosjekt.",
          ],
          tour: {
            audioSrc: "/audio/cases/skills/0.mp3",
            bubble:
              "Jeg samlet reglene mine i et eget repo fordi kvaliteten når man bruker kodeagenter står og faller på at man låser rammene på forhånd.",
          },
        },
        {
          title: "De tre modulene",
          paragraphs: [
            "Repoet er delt inn i tre moduler slik at hver oppgave kun laster inn de reglene som faktisk trengs:",
          ],
          bullets: [
            "ui-craft: Bygger på Matt D. Smiths 3P rammeverk (Purpose, Principles, Personality) og 60-30-10 fargeregelen. Kutter ut tilfeldige glødeeffekter og overdimensjonerte kort til fordel for matte flater, rolige OKLCH farger, flytende typografi (Utopia.fyi) med maks 62 tegn per linje, et 8pt avstandssystem og medier som pauser utenfor synsfeltet.",
            "lean-architecture: Holder konteksten kort og krever at datamodell og plattformkrav låses på papir og i AGENTS.md før kode. Fokuserer på Dan Norths Spike and Stabilize, en felles kilde for delte data, små og trygge commits uten å blande refaktorering og ny funksjonalitet, tidlig opprydding i logiske og strukturelle code smells, og dokumentasjon av tause produksjonsfeller i README.md.",
            "natural-copy: Fjerner typiske KI uvaner i både norsk og engelsk tekst, som tankestreker, unødvendige bindestreker mellom faguttrykk og norske ord, tomme klisjeer og stive oversettelser. Krever også at prosjekttekster og søknader starter med den menneskelige motivasjonen før tekniske detaljer.",
          ],
          tour: {
            audioSrc: "/audio/cases/skills/1.mp3",
            bubble:
              "Repoet er delt i tre moduler som styrer rolige flater og farger i grensesnittet, slank arkitektur med kort kontekst, og naturlig språk der motivasjonen kommer før tekniske detaljer.",
          },
        },
      ],
    },
    tour: {
      audioSrc: "/audio/tour/skills.mp3",
      bubble:
        "Her er også skills repoet mitt med faste regler for arkitektur, design og språk når jeg bruker KI.",
    },
    aiContext: [
      "`skills` (`github.com/yosang/skills`) er mitt åpne GitHub repo med `SKILL.md` filer og `AGENTS.md` regler for KI assistert programvareutvikling, kompatibelt med verktøy som følger Agent Skills standarden (Claude Code, Cursor, Antigravity og Gemini CLI).",
      "Repoet er delt inn i tre moduler: `ui-craft` (design, farger, typografi og grensesnitt), `lean-architecture` (slank kodebase, kort kontekst og god dokumentasjon) og `natural-copy` (naturlig språk uten fyllord og stive oversettelser). Hvis noen vil se de konkrete reglene i detalj, vis gjerne til selve repoet på `github.com/yosang/skills`.",
    ],
  },
  {
    slug: "cinemorra",
    title: "Cinemorra",
    year: "2026",
    category: "school",
    ground: "#ffffff",
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
      status: "Fullført skoleprosjekt, live demo og åpen kildekode",
      intro:
        "Cinemorra ble bygget som skoleoppgave på frontendstudiet hos Noroff med mål om å lage en oversiktlig filmkatalog der brukere enkelt kan utforske, søke opp og låne filmer på nett, mens administratorer styrer katalogen i et eget adminpanel. Løsningen er bygget i Next.js App Router og TypeScript med et tydelig skille mellom de åpne sidene og administrasjon.",
      sections: [
        {
          title: "Rutestruktur og tilgangskontroll i Next.js App Router",
          paragraphs: [
            "For å skille de åpne sidene tydelig fra administrasjonen bruker løsningen egne rutegrupper i Next.js App Router, med en åpen del ((home)) der besøkende kan filtrere på sjanger, søke i katalogen, se trailere og lese anmeldelser, og en skjermet del ((dashboard)/admin) for å legge til, redigere og slette filmer.",
            "Tilgang til adminrutene sjekkes i middleware.ts før siden vises, og hver rute har egne loading og error states slik at brukeren alltid får tydelig tilbakemelding ved nettverksfeil eller trege oppslag.",
          ],
          tour: {
            audioSrc: "/audio/cases/cinemorra/0.mp3",
            bubble:
              "I Cinemorra er App Router delt i egne rutegrupper for den åpne filmkatalogen og et beskyttet adminpanel styrt via middleware.",
          },
        },
        {
          title: "Server Actions, klientstate og automatiske tester",
          paragraphs: [
            "Innlogging, utlån og endringer i filmkatalogen kjører gjennom Next.js Server Actions med skjemavalidering på serversiden. I nettleseren holdes Zustand kun til ren UI state som aktive søkefiltre, utlånsstatus og bytte mellom lys og mørk visning.",
          ],
          bullets: [
            "Komponenttester med Jest og React Testing Library: Tester at søk, filtrering, skjemainnsending og feilmeldinger oppfører seg riktig ved brukerinteraksjon.",
            "Accessibility i skjemaflyt og kort: Sjekkes automatisk med eslint-plugin-jsx-a11y for å sikre semantiske skjemaelementer, tydelige fokusmarkeringer og full tastaturnavigasjon.",
          ],
          tour: {
            audioSrc: "/audio/cases/cinemorra/1.mp3",
            bubble:
              "Innlogging, utlån og filmendringer går gjennom Server Actions med ren UI state i Zustand, mens søk, skjemaer og accessibility testes med Jest og React Testing Library.",
          },
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
 * Always ordered to match the visual display order on the home page.
 */
export const PROJECTS: ProjectItem[] = PROJECT_DEFINITIONS;

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

export const CASE_WALKTHROUGH_RE =
  /\b(gjennom\s+caset|gjennomgang\s+av\s+caset|les(?:e)?\s+(?:gjennom\s+)?caset|seksjon\s+for\s+seksjon|walk\s+(?:me\s+)?(?:briefly\s+)?through\s+the\s+.*case|through\s+the\s+case\s+study|read\s+the\s+case\s+study)\b/i;
