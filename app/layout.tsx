import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { generatePageMetadata } from "@/lib/metadata";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "./components/GoogleTagManager";

const fontBody = Inter({
  subsets: ["latin"],
  weight: ["300", "400"], // Light, Regular
  variable: "--font-body",
});

const fontHeading = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"], // Medium, Semibold, Bold
  variable: "--font-heading",
});

/**
 * Generate metadata dynamically based on the current pathname
 * This replaces the need for individual layout.tsx files in each route
 * Pathname is passed via middleware custom header 'x-pathname'
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get the pathname from custom header set by middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  
  // Generate page-specific metadata
  const pageMetadata = generatePageMetadata(pathname);
  
  return {
    ...pageMetadata,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      {/* Google Tag Manager - Placed as high as possible (Next.js will place in <head>) */}
      {gtmId && <GoogleTagManagerHead gtmId={gtmId} />}
      <body className={`${fontBody.variable} ${fontHeading.variable} antialiased`}>
        {/* Google Tag Manager noscript - Immediately after opening <body> tag */}
        {gtmId && <GoogleTagManagerBody gtmId={gtmId} />}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
