'use client';

import Script from 'next/script';
import { getGoogleConsentModeScript } from '@/lib/gtm-scripts';

/**
 * Client component that injects Google Consent Mode script
 * Uses Script component with beforeInteractive to ensure it loads before GTM
 */
export default function GoogleConsentMode() {
  return (
    <Script
      id="google-consent-mode-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: getGoogleConsentModeScript(),
      }}
    />
  );
}
