import type { Metadata } from "next";
import { Geist, Geist_Mono, Host_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CompanionProvider } from "@/components/CompanionContext";
import { Navbar } from "@/components/Navbar";
import { ChatDock } from "@/components/ChatDock";
import { Prologue } from "@/components/Prologue";
import { SiteFooter } from "@/components/SiteFooter";
import { PROFILE } from "@/data/portfolio";

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

export const metadata: Metadata = {
  title: PROFILE.name,
  description: PROFILE.heroBio,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(location.pathname==="/"&&sessionStorage.getItem("yosmel-prologue-seen")!=="1"){document.documentElement.dataset.prologue="1"}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <div aria-hidden="true" className="prism-bar" />
        <ThemeProvider>
          <CompanionProvider>
            <Prologue />
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
