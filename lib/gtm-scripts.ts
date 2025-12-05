/**
 * Google Tag Manager script utilities
 * Server-safe functions for generating GTM and consent mode scripts
 */

import { getLocalhostCheckCode } from '@/app/utils/environment';

/**
 * Google Consent Mode initialization script (as string)
 * Must run BEFORE GTM loads to set consent defaults
 * This allows tags to load but in a consent-aware mode
 * 
 * On localhost, grants all consent automatically for development convenience
 */
export function getGoogleConsentModeScript(): string {
  const localhostCheck = getLocalhostCheckCode();
  
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    // Check if running on localhost
    const isLocalhost = ${localhostCheck};
    
    // On localhost, grant all consent for development convenience
    // In production, deny by default and wait for CookieYes consent
    if (isLocalhost) {
      gtag('consent', 'default', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted',
        'functionality_storage': 'granted',
        'personalization_storage': 'granted',
        'security_storage': 'granted'
      });
    } else {
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
    }
  `;
}

/**
 * Google Tag Manager script for <head> section (as string)
 * Should be placed as high in the <head> as possible
 */
export function getGoogleTagManagerScript(gtmId: string): string {
  return `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
}
