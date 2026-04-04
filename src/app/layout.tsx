import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BugDrop - In-app feedback to GitHub Issues",
  description:
    "Collect bug reports with screenshots in 30 seconds. Open source feedback widget that creates GitHub issues automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="bg-atmosphere" />
        <Nav />
        <div className="max-w-[1100px] mx-auto px-8 py-16 max-sm:px-4 max-sm:py-8">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
