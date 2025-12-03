'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

// Declare dataLayer for TypeScript (used by Google Tag Manager)
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
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
 * Track page views using Google Tag Manager's dataLayer
 * This works with GTM which manages Google Analytics and other tags
 * Call this function when the route changes
 */
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: path,
    });
  }
}
