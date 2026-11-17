import { AI_PAGE } from "@/data/ai";
import { ITEMS, PROFILE, SITE_URL } from "@/data/portfolio";

export async function GET() {
  const lines: string[] = [
    `# ${PROFILE.name} (@${PROFILE.handle})`,
    "",
    `> Fullstackutvikler bosatt i Gudbrandsdalen (${PROFILE.location}). Fullført toårig utdanning i Backend Development ved Noroff School of Technology and Digital Media (2024 til 2026, karakter A i gjennomsnitt), og tar nå Frontend Development på deltid ved Noroff. Medgründer av Ember Booking, med bakgrunn fra montering av møbler og programmering av Motoman industriroboter og som avdelingsleder med personalansvar, driftsplanlegging og kvalitetskontroll på Ekornes. Trives med å bidra med mer enn bare kode i møte med kunder, forstå forretning og drift, og ta del i juridiske vurderinger og større valg.`,
    "",
    "## Kort oversikt",
    `- Nettside: ${SITE_URL}`,
    `- GitHub: https://github.com/${PROFILE.handle}`,
    "- LinkedIn: https://www.linkedin.com/in/yosmel-chiang/",
    `- Epost: ${PROFILE.email}`,
    `- CV (PDF): ${SITE_URL}/Yosmel_Chiang_CV.pdf`,
    "- Språk: Norsk (morsmål), spansk (morsmål), engelsk (flytende)",
    "- Daglig arbeid: IKT drift og brukerstøtte ved Nord-Gudbrandsdal VGS, samt medgründer (merkevare, UX og frontend) i Ember Booking.",
    "- Ønsket arbeidsform: Åpen for utvikler og konsulentroller innen fullstack, backend eller frontend (fysisk kontor i Gudbrandsdalen/nærområdet, fagdager/kundemøter og hybrid i Innlandet, eller remote/hybrid).",
    "",
    "## Teknisk verktøykasse",
    ...PROFILE.about.stackGroups.map(
      (g) => `- **${g.label}:** ${g.items.join(", ")}`
    ),
    "",
    "## Prosjekter",
    "",
    ...ITEMS.flatMap((item) => {
      const urls = [
        `Case: ${SITE_URL}/prosjekter/${item.slug}`,
        item.liveUrl ? `Live: ${item.liveUrl}` : null,
        item.repoUrl ? `Kode: ${item.repoUrl}` : null,
      ]
        .filter(Boolean)
        .join(" | ");
      return [
        `### ${item.title} (${item.year})`,
        `${item.subtitle}`,
        urls ? `${urls}` : "",
        `Teknologi: ${item.tags.join(", ")}`,
        "",
        item.summary,
        ...item.highlights.map((h) => `- ${h}`),
        item.repoNote ? `- ${item.repoNote}` : "",
        item.aiNote ? `- AI metodikk: ${item.aiNote}` : "",
        "",
      ].filter((line, idx, arr) => !(line === "" && arr[idx - 1] === ""));
    }),
    "## Hvordan jeg bruker AI i programvareutvikling",
    ...AI_PAGE.lead.map((p) => p),
    "",
    AI_PAGE.principlesIntro,
    "",
    ...AI_PAGE.principles.map((p) => `- **${p.title}:** ${p.body}`),
    "",
    `### ${AI_PAGE.security.heading}`,
    ...AI_PAGE.security.paragraphs,
    ...AI_PAGE.security.layers.map((l) => `- ${l}`),
    "",
    `### ${AI_PAGE.practiceHeading}`,
    ...AI_PAGE.practices.map(
      (p) => `- **${p.project} (${p.status}):** ${p.description}`
    ),
    "",
    "## Sider på yosmel.no",
    `- [Forside og prosjekter](${SITE_URL}/): Oversikt over prosjekter og interaktiv 3D AI versjon med stemme og tale til tekst.`,
    `- [Om meg](${SITE_URL}/about): Bakgrunn, utdanning ved Noroff, Ember Booking og verktøykasse.`,
    `- [Hvordan jeg bruker AI](${SITE_URL}/ai): Arbeidsmetodikk med Spike and Stabilize, vern mot prompt injection, små commits og testing.`,
    `- [Snakk med AI versjonen](${SITE_URL}/chat): Fullskjerm samtale med 3D AI versjonen av ${PROFILE.shortName}.`,
    `- [Personvern](${SITE_URL}/personvern): Oversikt over hva som behandles i chatten og hvorfor ingen samtaler eller lydopptak lagres.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
