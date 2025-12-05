/**
 * COOKIEYES ERROR SUPPRESSOR COMPONENT
 * 
 * Suppresses CookieYes errors on localhost since CookieYes is not needed
 * for local development. CookieYes is loaded via GTM, so we can't prevent
 * it from loading, but we can suppress its error messages.
 */
'use client';

import { useEffect } from 'react';
import { isLocalhost } from '@/app/utils/environment';

export default function CookieYesErrorSuppressor() {
  useEffect(() => {
    // Only suppress errors on localhost
    if (!isLocalhost()) {
      return;
    }

    // Catch unhandled errors from CookieYes script
    const errorHandler = (event: ErrorEvent) => {
      if (
        event.message &&
        (event.message.includes('CookieYes') ||
         event.message.includes('cookieyes') ||
         event.message.includes('website URL has changed') ||
         event.message.includes('registered URL'))
      ) {
        // Suppress CookieYes errors on localhost
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // Catch unhandled promise rejections from CookieYes
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        typeof event.reason === 'object' &&
        'message' in event.reason &&
        typeof event.reason.message === 'string' &&
        (event.reason.message.includes('CookieYes') ||
         event.reason.message.includes('cookieyes') ||
         event.reason.message.includes('website URL has changed'))
      ) {
        // Suppress CookieYes promise rejections on localhost
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', rejectionHandler);

    // Cleanup: remove event listeners on unmount
    return () => {
      window.removeEventListener('error', errorHandler, true);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  return null;
}

