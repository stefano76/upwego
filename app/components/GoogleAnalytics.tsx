'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

// Declare gtag function for TypeScript
type GtagCommand = 'config' | 'set' | 'event' | 'js';
type GtagConfigParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (command: GtagCommand, targetId: string, config?: GtagConfigParams) => void;
  }
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
            window.gtag = gtag;
          `,
        }}
      />
    </>
  );
}

/**
 * Track page views for Google Analytics
 * Call this function when the route changes
 */
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: path,
    });
  }
}
