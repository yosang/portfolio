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
      "Pågående prosjekt ved Nord-Gudbrandsdal VGS laget for å inkludere flere elever i miljøet rundt bordtennisbordene i friminuttet, med QR kode ved bordet og live storskjerm i kantina.",
    highlights: [
      "Kampflyt: Gjestespill uten registrering ved bordet (opptil 3 seire på vent), automatisk kobling via QR kode og hurtigknapper for resultat (1-0, 2-0, 2-1).",
      "Storskjerm: Live tavle i kantina via Socket.IO, tilpasset Infoskjermen.no på eldre TV skjermer med animert WebP, ES5 støtte og diagnosestempel.",
      "Arkitektur: Flere skoler på samme instans i Node.js og innebygd SQLite (5 npm pakker), innebygd personvern og stresstestet med 100 samtidige spillere.",
    ],
    repoNote:
      "Privat repo mens løsningen er i aktiv utprøving. Jeg viser gjerne frem kodebasen og arkitekturen i en prat.",
    aiNote:
      "Første versjon gikk fra plan til drift på en uke med Spike and Stabilize.",
    caseStudy: {
      role: "Design, arkitektur og fullstackutvikling (eget fritidsprosjekt)",
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
            "Gjestespill med poeng på vent: Elever uten konto som skanner bordet kommer rett inn i kamp som Gjest uten å fylle ut registreringsskjema først. De kan samle opptil 3 seire (9 poeng) på vent, og når de oppretter profil eller logger inn på en eksisterende bruker etterpå, flyttes kamper og poeng automatisk over på kontoen mens den midlertidige gjestebrukeren slettes.",
            "Spill mot vinneren og umiddelbar bordfrigjøring: Så snart første spiller trykker inn sluttresultatet, frigjøres bordet med en gang og husker vinneren i 20 minutter. Da kan to nye spillere skanne QR koden etter tur, en ny utfordrer kan skanne og trykke Spill mot vinneren uten at vinneren må ta opp mobilen, eller forrige par kan ta omkamp med ett trykk. Glemmer noen å fullføre, frigjøres bordet etter 12 minutter.",
            "Sesjonsbro mellom kamera og hjemskjerm (PWA): Siden iOS skiller lagring mellom vanlig Safari og apper på hjemskjermen, synkroniseres økten via manifestet slik at elevene forblir innlogget når de skanner QR koden med mobilkameraet.",
            "Valideringslogikk mot juks og Boss Fight: Lovlige resultater godkjennes automatisk etter 60 sekunder, mens unaturlig raske kamper (under 45 sekunder per sett) stoppes og flagges til arrangør. Samme spillerpar kan ikke låse tabellen ved å spille mot hverandre to ganger på rad (maks 2 tellende kamper per par per dag), og ansatte kan delta som Boss Fight med maks ett tellende trofe per ansatt per dag.",
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
            "Siden ulike skoler og friminutt har forskjellige behov, støtter turneringsmotoren både Kongen på haugen (åpen poengstige med 3 poeng per seier og automatisk påmelding ved bordet der alle kan møte hverandre på kryss og tvers), sluttspill med gruppespill og utslagsrunder, og Sveitserstil med faste runder der alle får spille helt til slutt.",
            "For å skape samhold på tvers av trinn og klasser har systemet egne klasselag og digitale rekkerter med lokalt preg fra skolen og Innlandet. Hver rekkert teller antall kamper, seire og tidligere eiere. Hver tredje fullførte turnering bytter skolen til en ny sesongpakke, og ved skoleårsavslutning for VG3 flyttes opplåste rekkerter over i skolens premiehvelv.",
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
            "Løsningen er bygget i Node.js med innebygd node:sqlite i WAL modus og kun 5 npm pakker (express, socket.io, dotenv, qrcode og web-push). Flere skoler kjører adskilt på samme instans via school_id i databasen og egne Socket.IO rom, i en lukket Docker container på Fly.io i Stockholm med fast lagringsvolum, CalVer versjonering og automatisk sikkerhetskopi (VACUUM INTO) ved nye utgivelser. Før utrulling ble systemet stresstestet med 100 samtidige spillere fordelt på to skoler uten feil.",
            "Fordi løsningen brukes av skoleelever, er personvern (GDPR art. 25) bygget rett inn i datamodellen. Så snart en arrangør på skolen har bekreftet eleven, slettes midlertidig navn og epost permanent med NULL i databasen (og uverifiserte data vaskes automatisk etter 14 dager, mens tomme gjesteøkter vaskes etter 24 timer). Kun en enveis HMAC-SHA256 hash beholdes for innlogging, elevene kan slette egen konto på stedet, og arrangør kan hente ut en anonymisert aktivitetsrapport for skolen med ukentlig puls, hverdagsrytme og tidslinje (A4 og Excel generert uten eksterne pakker).",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/4.mp3",
            bubble:
              "Backenden kjører i Node.js med innebygd SQLite og bare fem npm pakker, stresstestet med hundre samtidige spillere og bygget slik at navn og epost slettes etter godkjenning.",
          },
        },
        {
          title: "Evaluering og tiltak etter to dager i drift",
          paragraphs: [
            "Allerede på dag 2 i drift ved Nord-Gudbrandsdal VGS ga produksjonsdataene fra aktivitetsrapporten et tydelig bilde av hvordan elevene faktisk tok løsningen i bruk i kantina. Fra 4 kamper i lunsjen på dag 1 økte aktiviteten til 21 fullførte kamper før kl. 13:20 på dag 2 på ett enkelt bord, med 28 registrerte profiler (pluss gjesteøkter opp til rekkert nummer 33) og 15 ulike spillere med tellende kamper.",
            "Tidsstemplene viste faste bølger gjennom skoledagen, med en kort runde før skolestart kl. 08:08, en formiddagsøkt og 9 sammenhengende kamper over 72 minutter i midttimen uten dødtid ved bordet. Tiden fra en kamp ble ferdig til neste par startet var nede i 12 til 38 sekunder, og når det var kø valgte elevene selv raske kamper på ett sett (3 til 4 minutter) før de gikk over til best av 3 sett når det ble roligere. Reglene mot bordmonopol (maks 2 tellende kamper per par per dag og rullering mellom motstandere) slo inn automatisk 4 ganger i løpet av dagen og la ekstra oppgjør som fritt spill, slik at tre elever sto helt likt på toppen av tabellen.",
            "Basert på observasjonene fra de to første dagene la vi inn tre konkrete endringer samme dag for å ligge i forkant av typiske utfordringer i en skolehverdag:",
          ],
          bullets: [
            "Timeplanstyring for bordene i skoletiden: For å unngå at kamper drar ut i undervisningstiden når klokka ringer, kan arrangør nå legge inn faste tidsvinduer for friminutt og midttime der bordene er åpne for kampstart, kombinert med midlertidig opplåsning ved fritime eller gym.",
            "Kallenavnmoderering med 24 timers varsel: Siden tenåringer er raske til å finne kreative ordspill som går rundt vanlige ordfiltre på storskjermen, fikk arrangør verktøy for å endre upassende kallenavn direkte uten å slette spillerens poeng. Eleven kan fortsatt logge inn med sitt gamle kallenavn, ser et varsel i 24 timer om hvorfor navnet ble endret, og er sperret fra å bytte tilbake til det utestengte navnet.",
            "Motstanderbekreftelse ved modusbytte i kamp: For å hindre at en spiller alene skrur en tellende kamp over til fritt spill når de ligger under, krever bytte mellom turnering og fritt spill nå bekreftelse fra motstanderen før resultatet kan sendes inn. Ved uenighet om resultat går kampen stille til konflikt i arrangørpanelet uten at bordet blokkeres for neste par.",
          ],
          tour: {
            audioSrc: "/audio/cases/vgs-bordtennis/5.mp3",
            bubble:
              "Allerede på dag to i kantina økte aktiviteten til 21 kamper før lunsjen var ferdig, og vi la inn timeplanstyring for bordene og enkel moderering av kallenavn.",
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
      "Pågående hobbyprosjekt jeg bygger på fritiden. Bakgrunnen var at vi så mye aktivitet rundt bordtennisbordene i kantina, samtidig som en gjeng med elever ikke helt greide å komme seg inn i miljøet og derfor havnet på telefonen. Prosjektet startet som et forsøk på inkludering og å lage noe artig som senket terskelen for å bli med og forsterket elevenes ønske om å delta aktivt og fysisk i friminuttet. Flere skoler kan bruke samme løsning med hvert sitt adskilte område (`/?school=<code>` og `/kiosk/<slug>`).",
      "Viktig grense hvis noen spør 'Laget du dette på jobb?' eller 'Betalte skolen for dette?': svar rolig og rett frem at nei, jobben min på skolen er kun IKT drift og support, og VGS Bordtennis er et rent hobbyprosjekt jeg har laget på egen fritid, ulønnet og på eget domene og server. Ikke nevn dette uoppfordret når folk bare spør vanlig om funksjonene i appen.",
      "Lavterskel gjestespill og kampflyt ved bordet: gjester uten konto som skanner QR koden ved bordet starter rett i kamp som Gjest uten å fylle ut skjema først, og kan samle opptil 3 seire (9 poeng) på vent. Når de oppretter profil eller logger inn på en eksisterende bruker etterpå, flyttes kamper og poeng automatisk over på kontoen mens den midlertidige gjesten slettes. En egen sesjonsbro i manifestet holder elevene innlogget på tvers av mobilkameraet og appen på hjemskjermen (PWA). Når to spillere skanner samme bord innen 45 sekunder, kobles de automatisk sammen, legger vekk mobilen mens de spiller, og trykker på hurtigknapper for resultatet etterpå (1-0, 2-0 eller 2-1, med mulighet til å bytte mellom turnering og fritt spill i kampkortet). Bordet frigjøres med en gang resultatet legges inn og husker vinneren i 20 minutter, slik at neste utfordrer kan skanne og trykke Spill mot vinneren direkte uten at vinneren må skanne på nytt. Lovlige kamper godkjennes automatisk etter 60 sekunder, kamper under 45 sekunder per sett flagges mot juks, og glemte bord frigjøres etter 12 minutter.",
      "Turneringer og rekkerter: støtter Kongen på haugen (åpen poengstige med 3 poeng per seier, automatisk påmelding ved bordet og maks 2 tellende kamper per spillerpar per dag), sluttspill og Sveitserstil (med Buchholz), i tillegg til klasselag, Boss Fight mot ansatte og statistikk på hvilke rekkerter som vinner mest gjennom sesongen.",
      "Milepæl og erfaringer fra dag 2 i drift ved Nord-Gudbrandsdal VGS: aktiviteten femdoblet seg fra 4 kamper i lunsjen på dag 1 til 21 fullførte kamper før kl. 13:20 på dag 2 på ett bord, med 28 registrerte profiler (pluss gjesteøkter opp til rekkert nummer 33) og 15 ulike spillere med tellende kamper. I midttimen gikk det 9 kamper på rad over 72 minutter uten dødtid, og tiden fra en kamp ble ferdig til neste par startet var nede i 12 til 38 sekunder. Elevene regulerte selv køen med raske kamper på ett sett (3 til 4 minutter) i rushet og best av 3 sett når det var roligere, mens reglene mot bordmonopol slo inn automatisk 4 ganger slik at flere slapp til. Samme dag rullet vi ut tre konkrete tiltak basert på tallene: timeplanstyring for bordene (slik at bordene kun er åpne i friminutt og midttime eller ved midlertidig opplåsning fra arrangør), kallenavnmoderering med 24 timers varsel til eleven (og mulighet til å logge inn med det gamle kallenavnet uten å kunne bytte tilbake til det utestengte), samt krav om motstanderbekreftelse for å bytte en pågående kamp mellom turnering og fritt spill.",
      "Teknisk oppsett og storskjermen i kantina (`/kiosk`): bygget i Node.js med innebygd `node:sqlite` (i `WAL` modus) og kun 5 npm pakker, kjørende i Docker på Fly.io i Stockholm med CalVer utgivelser og automatisk `VACUUM INTO` sikkerhetskopi. Storskjermen er tilpasset Infoskjermen.no på eldre TV skjermer: bruker 24 fps animert WebP i stedet for `<video>` fordi TV nettleseren fryser videoer på første bilde, unngår sekundsjekker i `setInterval` fordi Chromium struper timere i iframes til minuttgrenser, og har 3 synkroniserte lag (SSR, Socket.IO og ren ES5 som kan testes med `?mode=es5` og `?mode=ssr`) samt diagnosestempel og dvalemodus. Stresstestet med 100 samtidige spillere fordelt på 2 skoler uten feil.",
      "Personvern (nevn kun kort hvis det er naturlig eller noen spør): midlertidig navn og epost slettes (`NULL`) så snart en arrangør har godkjent eleven (eller automatisk etter 14 dager, og tomme gjesteøkter etter 24 timer), slik at kun en enveis `HMAC-SHA256` hash lagres. Løsningen har ingen fritekstchat, støtter selvbetjent sletting av konto og kan lage anonymisert aktivitetsrapport med ukentlig puls og hverdagsrytme (A4 og Excel uten ekstra pakker).",
    ],
  },
  {
    slug: "ember-booking",
    title: "Ember Booking",
    year: "2026",
    category: "independent",
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
      "Brukeropplevelse: Jobber løpende med struktur, accessibility og enkel flyt på tvers av plattformen.",
    ],
    repoNote:
      "Privat repo (kommersielt produkt i drift). Jeg viser gjerne frem koden og designsystemet i en samtale.",
    caseStudy: {
      role: "Medgründer · Ansvar for merkevare, design, copy, frontend og brukeropplevelse",
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
              "Ut fra dette spisset jeg budskapet rundt tre konkrete løfter: rask betaling med Vipps uten lange skjemaer, ferdig avstemt regnskap mot Tripletex og Fiken, og oppsett på en dag.",
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
    ground: "#17211e",
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
      status: "Fullført eksamensprosjekt · Åpen kildekode",
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
              "I uke en tegnet jeg databasen i tredje normalform og eksporterte skjemaet fra MySQL tilbake til dbdiagram for å sjekke at migrasjonene i EF Core stemte på prikken.",
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
              "I uke to skrev jeg egne extension mappere i C# i stedet for AutoMapper, og lærte at EF Core krever eksplisitte Include kall så snart mappingen flyttes ut av Select.",
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
    ground: "#17211e",
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
    aiNote:
      "Bygget høsten 2026 med faste rammer i AGENTS.md og skills.",
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
            "Når en språkmodell får sende ut tagger som styrer siden ([TOUR:<slug>], [GO:<sti>] og [FILE:cv]), kan man ikke stole blindt på det som kommer inn fra nettleseren. Da jeg gikk gjennom koden for 3D chatten, fant jeg tre ting som måtte strammes inn. Info om hvilken side brukeren sto på ble sendt rett inn i systemprompten uten vasking, taggen [GO:...] manglet en fast liste over gyldige ruter, og stemmekallene manglet eksplisitt store: false.",
            "Siden en språkmodell alltid kan bli forsøkt lurt, flyttet jeg disse sjekkene ut i vanlig TypeScript kode (apiGuard.ts) rundt modellen:",
          ],
          bullets: [
            "Skille regler og brukerinput: Systemprompten settes kun sammen av faste filer på serveren. Meldinger fra chatten vaskes for kontrolltagger og legges i <untrusted_visitor_input>, og historikken sendes med låste roller (user_input og model_output) slik at ingen kan forfalske tidligere svar i tråden.",
            "Fast liste over lovlige handlinger: [GO:<sti>] sjekkes mot en fast liste av gyldige sider på både server og klient før router.push kjører, så modellen aldri kan sende noen til eksterne nettsider. [FILE:cv] peker til en fast PDF fil og slippes kun gjennom når du faktisk ber om CV.",
            "Ingen lagring og faste kvoter: Alle kall for chat, stemme og tale til tekst sendes med store: false, sammen med sjekk av Origin, Sec-Fetch-Site og faste grenser per minutt og per dag i minnet.",
          ],
          tour: {
            audioSrc: "/audio/cases/interaktiv-portefolje/3.mp3",
            bubble:
              "For å sikre mot prompt injection renses alle meldinger utenfra i en egen TypeScript vaktmodul, og alle tagger som styrer siden sjekkes mot faste lister på server og klient.",
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
      "Sikkerhet og vern mot prompt injection: da jeg gikk over koden til porteføljen fant og fikset jeg tre ting som måtte strammes inn. Sideinfo gikk rett inn i systemprompten uten sjekk, `[GO:...]` manglet en fast liste over lovlige sider, og stemmekallene manglet eksplisitt `store: false`. Nå ligger sikkerheten i vanlig TypeScript kode (`apiGuard.ts` og `chat/route.ts`), der 1) meldinger fra brukeren renses for kontrolltagger og legges i `<untrusted_visitor_input>` med låste roller så ingen kan forfalske tidligere svar, 2) alle tagger som styrer siden (`[GO:...]`, `[TOUR:...]`, `[FILE:cv]`) sjekkes mot en fast liste av gyldige valg på både server og klient så modellen aldri kan åpne eksterne lenker eller frie filer, og 3) alle kall til Gemini sendes med `store: false`, Origin sjekk og faste grenser per minutt og per dag i minnet.",
    ],
  },
  {
    slug: "skills",
    title: "Agent Skills",
    year: "2026",
    category: "independent",
    ground: "#17211e",
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
    aiNote:
      "Brukes på tvers av denne porteføljen og andre egne prosjekter.",
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
              "Repoet er delt i tre moduler som styrer rolige flater og farger i grensesnittet, slank arkitektur med kort kontekst, og naturlig språk uten klisjeer.",
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
              "Innlogging og filmendringer går gjennom Server Actions med klientstate i Zustand, og sentrale visninger testes med Jest og React Testing Library.",
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
