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
  title: "BugDrop - Free Website Feedback Widget for GitHub Issues",
  description:
    "Free, open source website feedback widget by mean-weasel. Users report bugs with screenshots and annotations — issues are created in GitHub automatically. One script tag, zero config.",
  keywords: [
    "BugDrop",
    "mean-weasel",
    "GitHub Issues feedback widget",
    "website feedback widget",
    "bug reporting widget",
    "Product Hunt",
  ],
  metadataBase: new URL("https://bugdrop.dev"),
  openGraph: {
    title: "BugDrop - Free Website Feedback Widget for GitHub Issues",
    description:
      "Free, open source website feedback widget by mean-weasel. Users report bugs with screenshots and annotations — issues are created in GitHub automatically.",
    url: "https://bugdrop.dev",
    siteName: "BugDrop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BugDrop - Free Website Feedback Widget for GitHub Issues",
    description:
      "Free, open source website feedback widget. Users report bugs with screenshots and annotations — issues are created in GitHub automatically.",
  },
  verification: {
    google: "sTi4vjMGXpdkvZcZQnRhs9u-uVyxsqTHOIR_txqHR-w",
  },
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
