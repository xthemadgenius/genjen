import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import StructuredData from "@/components/StructuredData";
import AppKitProvider from "@/context/AppKitProvider";
import { LogoutProvider } from "@/context/LogoutContext";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://jengen.ai'),
  title: "JenGen.ai - Bridging Generations Through AI-Powered Learning & Mentorship",
  description: "Join JenGen.ai&apos;s exclusive membership platform connecting generations through AI-powered storytelling, smart matching, and custom learning journeys. Access our private mentorship network and bridge the wisdom gap.",
  keywords: ["intergenerational learning", "AI mentorship", "generational bridge", "membership platform", "wisdom exchange", "custom learning", "smart matching", "storytelling platform", "private network"],
  authors: [{ name: "JenGen.ai" }],
  creator: "JenGen.ai",
  publisher: "JenGen.ai",
  robots: "index, follow",
  applicationName: "JenGen.ai",
  generator: "Next.js",
  category: "Education",
  classification: "Business",
  icons: {
    icon: '/jengenfav.ico',
    shortcut: '/jengenfav.ico',
    apple: '/jengenfav.ico',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jengen.ai",
    title: "JenGen.ai - Bridging Generations Through AI-Powered Learning",
    description: "Join our exclusive membership platform connecting generations through AI-powered storytelling, smart matching, and custom learning journeys.",
    siteName: "JenGen.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JenGen.ai - Bridging Generations Through AI-Powered Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JenGenAI",
    creator: "@JenGenAI",
    title: "JenGen.ai - Bridging Generations Through AI-Powered Learning",
    description: "Join our exclusive membership platform connecting generations through AI-powered storytelling and smart matching.",
    images: ["/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://jengen.ai",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6C4FF2',
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get('cookie')
  
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <AppKitProvider cookies={cookies}>
          <LogoutProvider>
            {children}
          </LogoutProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
