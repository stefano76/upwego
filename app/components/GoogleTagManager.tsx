'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * Google Consent Mode initialization
 * Must run BEFORE GTM loads to set consent defaults
 * This allows tags to load but in a consent-aware mode
 */
export function GoogleConsentModeInit() {
  return (
    <Script
      id="google-consent-mode-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted',
            'wait_for_update': 500
          });
        `,
      }}
    />
  );
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
    <>
      {/* Initialize consent mode BEFORE GTM loads */}
      <GoogleConsentModeInit />
      {/* Google Tag Manager */}
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
    </>
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
          const cookieYesConsent = (window as any).cookieyes?.consent || 
                                   (window as any).ckyConsent ||
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
            if ((window as any).gtag) {
              (window as any).gtag('consent', 'update', consentMode);
            }
          }
        } catch (error) {
          console.debug('CookieYes consent sync:', error);
        }
      };

      // Function to update Google Consent Mode
      const updateGoogleConsentMode = (consentData: Record<string, boolean>) => {
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
        if ((window as any).gtag) {
          (window as any).gtag('consent', 'update', consentMode);
        }
      };

      // Listen for CookieYes consent changes via dataLayer
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args: any[]) {
        const result = originalPush.apply(this, args);
        
        // Check if this is a CookieYes consent update
        const lastItem = args[args.length - 1];
        if (lastItem) {
          // CookieYes typically pushes events like 'cookieyes-consent' or includes consent data
          if (lastItem.event === 'cookieyes-consent' || 
              lastItem.cky_consent_update ||
              lastItem.cookieyesConsent ||
              (lastItem.event && lastItem.event.includes('cookieyes'))) {
            // Extract consent data from the event
            const consentData = lastItem.consent || lastItem.cookieyesConsent || {};
            updateGoogleConsentMode(consentData);
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
      <CookieYesConsentSync />
    </>
  );
}
