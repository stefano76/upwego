'use client';

import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * Google Tag Manager script for <head> section
 * Should be placed as high in the <head> as possible
 * Using beforeInteractive strategy to ensure it loads in <head> before page becomes interactive
 */
export function GoogleTagManagerHead({ gtmId }: GoogleTagManagerProps) {
  if (!gtmId) {
    return null;
  }

  return (
    <Script
      id="google-tag-manager"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `,
      }}
    />
  );
}

/**
 * Google Tag Manager noscript fallback for <body> section
 * Should be placed immediately after the opening <body> tag
 */
export function GoogleTagManagerBody({ gtmId }: GoogleTagManagerProps) {
  if (!gtmId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

/**
 * Legacy component for backward compatibility
 * Use GoogleTagManagerHead and GoogleTagManagerBody separately for proper placement
 */
export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  if (!gtmId) {
    return null;
  }

  return (
    <>
      <GoogleTagManagerHead gtmId={gtmId} />
      <GoogleTagManagerBody gtmId={gtmId} />
    </>
  );
}
