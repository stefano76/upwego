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
  const [contentLoaded, setContentLoaded] = useState(false);
  const scriptUrl = `https://cdn-cookieyes.com/client_data/${process.env.NEXT_PUBLIC_COOKIEYES_ID}/cookie-policy/script.js`;

  useEffect(() => {
    // Check if CookieYes has rendered content
    const checkContent = () => {
      const container = document.getElementById('cookie-policy-container');
      
      // CookieYes might inject content in various places
      const possibleSelectors = [
        '.cky-cookie-policy-content',
        '.cky-cookie-policy',
        '[class*="cookie-policy"]',
        '[id*="cookie-policy"]',
        '[id*="cky"]'
      ];
      
      // Check container first
      if (container) {
        // Check if there's actual content (not just the script tag)
        const hasContentInContainer = container.children.length > 1 || 
                                      (container.textContent && container.textContent.trim().length > 50);
        
        if (hasContentInContainer) {
          setContentLoaded(true);
          return true;
        }
        
        // Check for CookieYes-specific classes/IDs
        for (const selector of possibleSelectors) {
          if (container.querySelector(selector)) {
            setContentLoaded(true);
            return true;
          }
        }
      }
      
      // Also check the entire document (CookieYes might inject outside container)
      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim().length > 50) {
          // Move it to our container if it's outside
          if (container && !container.contains(element)) {
            container.appendChild(element);
          }
          setContentLoaded(true);
          return true;
        }
      }
      
      return false;
    };

    // Check immediately
    if (checkContent()) {
      return;
    }

    // Check periodically for content to appear
    const interval = setInterval(() => {
      if (checkContent()) {
        clearInterval(interval);
      }
    }, 200);

    // Stop checking after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setContentLoaded(true); // Hide loading even if content didn't load
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
            {!contentLoaded && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-tertiary"></div>
                <span className="ml-4 text-brand-tertiary">Loading cookie policy...</span>
              </div>
            )}
            <Script
              id="cky-cookie-policy"
              src={scriptUrl}
              strategy="afterInteractive"
              onLoad={() => {
                console.log('CookieYes policy script loaded from:', scriptUrl);
                // CookieYes script may take a moment to render content
                // Check multiple times with increasing delays
                const checkDelays = [500, 1000, 2000, 3000];
                checkDelays.forEach((delay) => {
                  setTimeout(() => {
                    const container = document.getElementById('cookie-policy-container');
                    const pageContent = document.querySelector('.cky-cookie-policy-content') || 
                                      document.querySelector('[class*="cookie-policy"]') ||
                                      document.querySelector('[id*="cookie-policy"]');
                    
                    console.log(`Checking for content after ${delay}ms:`, {
                      containerChildren: container?.children.length,
                      foundContent: !!pageContent,
                      containerText: container?.textContent?.substring(0, 100)
                    });
                    
                    if (container && (container.children.length > 1 || pageContent)) {
                      setContentLoaded(true);
                    }
                  }, delay);
                });
              }}
              onError={(e) => {
                console.error('Failed to load CookieYes policy script:', e);
                console.error('Script URL:', scriptUrl);
                console.error('CookieYes ID:', process.env.NEXT_PUBLIC_COOKIEYES_ID);
                setContentLoaded(true);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
