import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { generatePageMetadata } from "@/lib/metadata";
import { getGoogleTagManagerScript } from "@/lib/gtm-scripts";
import { GoogleTagManagerBody, CookieYesConsentSync } from "./components/GoogleTagManager";
import GoogleConsentMode from "./components/GoogleConsentMode";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeading.variable} antialiased`}>
        {/* Google Consent Mode - Must load BEFORE GTM (beforeInteractive puts it in head) */}
        {gtmId && <GoogleConsentMode />}
        {/* Google Tag Manager - Loads after consent mode */}
        {gtmId && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: getGoogleTagManagerScript(gtmId),
            }}
          />
        )}
        {/* Google Tag Manager noscript - Immediately after opening <body> tag */}
        {gtmId && <GoogleTagManagerBody gtmId={gtmId} />}
        {/* Sync CookieYes consent with Google Consent Mode */}
        {gtmId && <CookieYesConsentSync />}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
