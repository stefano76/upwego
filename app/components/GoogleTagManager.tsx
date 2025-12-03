'use client';

import { useEffect } from 'react';

interface GoogleTagManagerProps {
  gtmId: string;
}

// Type definitions for CookieYes and gtag
interface CookieYesConsent extends Record<string, boolean | undefined> {
  advertisement?: boolean;
  analytics?: boolean;
  functional?: boolean;
  personalization?: boolean;
}

interface DataLayerItem extends Record<string, unknown> {
  event?: string;
  consent?: CookieYesConsent;
  cookieyesConsent?: CookieYesConsent;
  cky_consent_update?: boolean;
}

declare global {
  interface Window {
    cookieyes?: {
      consent?: CookieYesConsent;
    };
    ckyConsent?: CookieYesConsent;
    gtag?: (
      command: 'consent',
      action: 'update',
      params: Record<string, string>
    ) => void;
  }
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
 * Client component to sync CookieYes consent with Google Consent Mode
 * Listens for CookieYes consent changes and updates consent mode accordingly
 */
export function CookieYesConsentSync() {
  useEffect(() => {
    // Wait for CookieYes to be available
    const checkCookieYes = () => {
      if (typeof window === 'undefined' || !window.dataLayer) {
        return;
      }

      // Check if CookieYes is available (it typically exposes a global object)
      // CookieYes updates consent via dataLayer events, so we listen for those
      const updateConsentFromCookieYes = () => {
        // CookieYes typically pushes consent updates to dataLayer
        // We'll check for CookieYes consent status and update Google Consent Mode
        try {
          // Check if CookieYes has set consent (common CookieYes global variable names)
          const cookieYesConsent = window.cookieyes?.consent || 
                                   window.ckyConsent ||
                                   null;

          if (cookieYesConsent) {
            // Map CookieYes consent to Google Consent Mode
            const consentMode: Record<string, string> = {
              'ad_storage': cookieYesConsent.advertisement ? 'granted' : 'denied',
              'ad_user_data': cookieYesConsent.advertisement ? 'granted' : 'denied',
              'ad_personalization': cookieYesConsent.advertisement ? 'granted' : 'denied',
              'analytics_storage': cookieYesConsent.analytics ? 'granted' : 'denied',
              'functionality_storage': cookieYesConsent.functional ? 'granted' : 'denied',
              'personalization_storage': cookieYesConsent.personalization ? 'granted' : 'denied',
              'security_storage': 'granted', // Always granted
            };

            // Update consent mode
            window.dataLayer.push({
              event: 'consent_update',
              ...consentMode
            });

            // Also update via gtag consent API if available
            if (window.gtag) {
              window.gtag('consent', 'update', consentMode);
            }
          }
        } catch (error) {
          console.debug('CookieYes consent sync:', error);
        }
      };

      // Function to update Google Consent Mode
      const updateGoogleConsentMode = (consentData: CookieYesConsent) => {
        const consentMode: Record<string, string> = {
          'ad_storage': consentData.advertisement ? 'granted' : 'denied',
          'ad_user_data': consentData.advertisement ? 'granted' : 'denied',
          'ad_personalization': consentData.advertisement ? 'granted' : 'denied',
          'analytics_storage': consentData.analytics ? 'granted' : 'denied',
          'functionality_storage': consentData.functional ? 'granted' : 'denied',
          'personalization_storage': consentData.personalization ? 'granted' : 'denied',
          'security_storage': 'granted', // Always granted
        };

        // Update via dataLayer
        window.dataLayer.push({
          event: 'consent_update',
          ...consentMode
        });

        // Update via gtag consent API if available
        if (window.gtag) {
          window.gtag('consent', 'update', consentMode);
        }
      };

      // Listen for CookieYes consent changes via dataLayer
      const originalPush = window.dataLayer.push.bind(window.dataLayer);
      window.dataLayer.push = function(...args: Array<Record<string, unknown>>) {
        const result = originalPush(...args);
        
        // Check if this is a CookieYes consent update
        const lastItem = args[args.length - 1] as DataLayerItem;
        if (lastItem) {
          // CookieYes typically pushes events like 'cookieyes-consent' or includes consent data
          if (lastItem.event === 'cookieyes-consent' || 
              lastItem.cky_consent_update ||
              lastItem.cookieyesConsent ||
              (lastItem.event && typeof lastItem.event === 'string' && lastItem.event.includes('cookieyes'))) {
            // Extract consent data from the event
            const consentData = (lastItem.consent || lastItem.cookieyesConsent || {}) as CookieYesConsent;
            if (consentData && (consentData.advertisement !== undefined || consentData.analytics !== undefined)) {
              updateGoogleConsentMode(consentData);
            }
          }
        }
        
        return result;
      };

      // Listen for CookieYes custom events
      window.addEventListener('cookieyes-consent', ((e: CustomEvent) => {
        if (e.detail && e.detail.consent) {
          updateGoogleConsentMode(e.detail.consent);
        }
      }) as EventListener);

      // Also check periodically for CookieYes consent (fallback)
      const interval = setInterval(() => {
        updateConsentFromCookieYes();
      }, 1000);

      // Clean up after 10 seconds (CookieYes should load quickly)
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      // Initial check
      updateConsentFromCookieYes();
    };

    // Wait for DOM and dataLayer to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkCookieYes);
    } else {
      checkCookieYes();
    }
  }, []);

  return null;
}

/**
 * Legacy component for backward compatibility
 * Note: For proper implementation, use the script functions directly in layout.tsx
 * This component is kept for backward compatibility but may not work correctly with beforeInteractive strategy
 */
export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  if (!gtmId) {
    return null;
  }

  return (
    <>
      <GoogleTagManagerBody gtmId={gtmId} />
      <CookieYesConsentSync />
    </>
  );
}
