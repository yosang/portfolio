import type { Metadata } from "next";
import { Geist, Geist_Mono, Host_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CompanionProvider } from "@/components/CompanionContext";
import { Navbar } from "@/components/Navbar";
import { ChatDock } from "@/components/ChatDock";
import { SiteFooter } from "@/components/SiteFooter";
import { ITEMS, PROFILE, SITE_URL } from "@/data/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_TITLE = `${PROFILE.name} · Fullstackutvikler`;
const DEFAULT_DESCRIPTION =
  "Fullstackutvikler innen TypeScript, Next.js, C#, .NET og UX. Studier i backend og frontend ved Noroff School of Technology and Digital Media, og medbygger av Ember Booking.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${PROFILE.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: SITE_URL,
    siteName: PROFILE.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      alternateName: ["Yosmel Gutierrez Chiang", PROFILE.handle],
      url: SITE_URL,
      email: `mailto:${PROFILE.email}`,
      jobTitle: "Fullstackutvikler",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Noroff School of Technology and Digital Media",
        url: "https://www.noroff.no",
      },
      worksFor: {
        "@type": "Organization",
        name: "Ember Booking",
        url: "https://emberbooking.no",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: PROFILE.location,
        addressCountry: "NO",
      },
      knowsLanguage: ["nb", "es", "en"],
      knowsAbout: [
        "TypeScript",
        "Next.js",
        "React",
        "C#",
        ".NET 9",
        "ASP.NET Core",
        "Entity Framework Core",
        "Node.js",
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "Socket.IO",
        "UX Design",
        "Figma",
        "Three.js",
      ],
      sameAs: [
        "https://github.com/yosang",
        "https://www.linkedin.com/in/yosmel-chiang/",
        "https://emberbooking.no",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "nb-NO",
      mainEntity: { "@id": `${SITE_URL}/#person` },
      hasPart: ITEMS.map((item) => ({
        "@type": item.repoUrl ? "SoftwareSourceCode" : "WebApplication",
        name: item.title,
        description: `${item.subtitle} ${item.summary}`,
        url: item.liveUrl ?? item.repoUrl ?? `${SITE_URL}/#prosjekter`,
        ...(item.repoUrl ? { codeRepository: item.repoUrl } : {}),
        author: { "@id": `${SITE_URL}/#person` },
        keywords: item.tags.join(", "),
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${hostGrotesk.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/avatar/yosmel.glb?v=t2-outfit"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title={`${PROFILE.name} LLM oversikt`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if("scrollRestoration"in history){history.scrollRestoration="manual"}if(location.hash!=="#prosjekter"){window.scrollTo(0,0)}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <div aria-hidden="true" className="prism-bar" />
        <ThemeProvider>
          <CompanionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <ChatDock />
          </CompanionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
