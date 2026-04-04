import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn(spaceGrotesk.variable, jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
