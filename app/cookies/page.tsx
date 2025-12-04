/**
 * COOKIE POLICY PAGE COMPONENT
 * 
 * Displays the CookieYes cookie policy script.
 * This page loads the cookie policy content from CookieYes.
 * 
 * FEATURES:
 * - Uses CookieYes cookie policy script
 * - Responsive layout with max-width constraint
 * - Loading state while script loads
 */
'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import '../styles/privacy.css';

export default function Cookies() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if CookieYes script has loaded
    const checkScript = () => {
      if (document.getElementById('cky-cookie-policy')) {
        setScriptLoaded(true);
      }
    };

    // Check immediately and then periodically
    checkScript();
    const interval = setInterval(checkScript, 100);

    // Clean up after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setScriptLoaded(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-brand-primary">
      <div className="container">
        {/* Main content area with max-width constraint for readability */}
        <div className="max-w-screen-desktop mx-auto mb-24">
          {/* Page title */}
          <h1 className="title text-4xl text-brand-tertiary mb-16 font-bold">Cookie Policy</h1>
          
          {/* CookieYes Cookie Policy Script */}
          <div id="cookie-policy-container" className="privacy-content text-brand-tertiary">
            {!scriptLoaded && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-tertiary"></div>
                <span className="ml-4 text-brand-tertiary">Loading cookie policy...</span>
              </div>
            )}
            <Script
              id="cky-cookie-policy"
              src={`https://cdn-cookieyes.com/client_data/ccf217bb0e6c5d44c5a22c173b55556b/cookie-policy/script.js`}
              strategy="afterInteractive"
              onLoad={() => setScriptLoaded(true)}
              onError={() => setScriptLoaded(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
