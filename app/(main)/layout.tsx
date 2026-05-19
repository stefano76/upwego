import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/app/styles/globals.css";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { getGoogleTagManagerScript } from "@/lib/gtm-scripts";
import { GoogleTagManagerBody, CookieYesConsentSync } from "@/app/components/GoogleTagManager";
import GoogleConsentMode from "@/app/components/GoogleConsentMode";
import CookieYesErrorSuppressor from "@/app/components/CookieYesErrorSuppressor";

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

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeading.variable} antialiased`} suppressHydrationWarning>
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
        {/* Suppress CookieYes errors on localhost */}
        <CookieYesErrorSuppressor />
        {/* Sync CookieYes consent with Google Consent Mode */}
        {gtmId && <CookieYesConsentSync />}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
