import type { Metadata } from "next";
import { Geist, Geist_Mono, Host_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CompanionProvider } from "@/components/CompanionContext";
import { Navbar } from "@/components/Navbar";
import { ChatDock } from "@/components/ChatDock";
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
      <body className="min-h-dvh flex flex-col">
        <div aria-hidden="true" className="prism-bar" />
        <ThemeProvider>
          <CompanionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <ChatDock />
          </CompanionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
