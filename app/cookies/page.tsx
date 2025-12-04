/**
 * COOKIE POLICY PAGE COMPONENT
 * 
 * Displays the cookie policy content with CookieYes integration.
 * Uses static HTML content with CookieYes dynamic elements.
 * 
 * FEATURES:
 * - Static cookie policy content
 * - CookieYes audit table integration
 * - CookieYes consent preferences button
 * - Responsive layout with max-width constraint
 */
'use client';
import { useEffect } from 'react';
import '../styles/privacy.css';
import styles from './Cookies.module.css';

export default function Cookies() {
  useEffect(() => {
    // Initialize CookieYes elements if they exist
    // The audit table and banner button will be populated by CookieYes script
    const bannerButton = document.querySelector('.cky-banner-element');
    
    if (bannerButton) {
      // Add click handler to open CookieYes consent preferences
      bannerButton.addEventListener('click', () => {
        // Trigger CookieYes consent banner if available
        // Type guard to check if CookieYes API is available with show method
        const cookieYes = window.cookieyes as { show?: () => void } | undefined;
        if (typeof window !== 'undefined' && cookieYes?.show) {
          cookieYes.show();
        } else {
          // Fallback: reload page to show banner
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <section className="bg-brand-primary">
      <div className="container">
        {/* Main content area with max-width constraint for readability */}
        <div className="max-w-screen-desktop mx-auto mb-24">
          {/* Cookie Policy Content */}
          <div className={`${styles.cookiePolicyContent} privacy-content text-brand-tertiary`}>

            <h1 className={styles.cookiePolicyH1}>Cookie Policy</h1>
            
            <div className={styles.cookiePolicyDateContainer}>
              <p>Effective date: December 04, 2025</p>
              <p>Last updated: December 04, 2025</p>
            </div>

            <h2>What are cookies?</h2>
            <div className={styles.cookiePolicyP}>
              <p>This Cookie Policy explains what cookies are, how we use them, the types of cookies we use (i.e., the information we collect using cookies and how that information is used), and how to manage your cookie settings.</p>
              <p>Cookies are small text files used to store small pieces of information. They are stored on your device when a website loads in your browser. These cookies help ensure that the website functions properly, enhance security, provide a better user experience, and analyse performance to identify what works and where improvements are needed.</p>
            </div>

            <h2>How do we use cookies?</h2>
            <div className={styles.cookiePolicyP}>
              <p>Like most online services, our website uses both first-party and third-party cookies for various purposes. First-party cookies are primarily necessary for the website to function properly and do not collect any personally identifiable data.</p>
              <p>The third-party cookies used on our website primarily help us understand how the website performs, track how you interact with it, keep our services secure, deliver relevant advertisements, and enhance your overall user experience while improving the speed of your future interactions with our website.</p>
            </div>

            <h2>Types of cookies we use</h2>
            <div className="cky-audit-table-element"></div>

            <h2 style={{ marginBottom: '20px' }}>Manage cookie preferences</h2>
            <a className="cky-banner-element">Consent Preferences</a>
            <br />
            
            <div>
              <p>You can modify your cookie settings anytime by clicking the &apos;Consent Preferences&apos; button above. This will allow you to revisit the cookie consent banner and update your preferences or withdraw your consent immediately.</p>
              <p>Additionally, different browsers offer various methods to block and delete cookies used by websites. You can adjust your browser settings to block or delete cookies. Below are links to support documents on how to manage and delete cookies in major web browsers.</p>
              <p>Chrome: <a target="_blank" rel="noopener noreferrer" href="https://support.google.com/accounts/answer/32050">https://support.google.com/accounts/answer/32050</a></p>
              <p>Safari: <a target="_blank" rel="noopener noreferrer" href="https://support.apple.com/en-in/guide/safari/sfri11471/mac">https://support.apple.com/en-in/guide/safari/sfri11471/mac</a></p>
              <p>Firefox: <a target="_blank" rel="noopener noreferrer" href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US">https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US</a></p>
              <p>Internet Explorer: <a target="_blank" rel="noopener noreferrer" href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc">https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc</a></p>
              <p>If you are using a different web browser, please refer to its official support documentation.</p>
            </div>

            <p className={styles.cookiePolicyP}>
              Cookie Policy generated by{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://www.cookieyes.com/?utm_source=CP&utm_medium=footer&utm_campaign=UW">
                CookieYes - Cookie Policy Generator
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}