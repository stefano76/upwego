/**
 * 404 NOT FOUND PAGE COMPONENT
 * 
 * This is Next.js's special not-found page that displays when a user navigates
 * to a route that doesn't exist. Next.js automatically uses this component
 * for 404 errors.
 * 
 * HOW IT WORKS:
 * - Next.js looks for a file named "not-found.tsx" in the app directory
 * - When a route doesn't match any page, Next.js renders this component
 * - This provides a user-friendly error page instead of a generic 404
 * 
 * FEATURES:
 * - Large "404" number display
 * - Friendly error message
 * - "Go Back Home" button to return to homepage
 * - Styled with brand colors for consistency
 * - Background image (controlled by CSS, initially hidden)
 * 
 * USAGE:
 * This page is automatically used by Next.js - no manual routing needed.
 * To test: Navigate to any non-existent URL like /this-does-not-exist
 */
'use client';
import Button from './components/Button';
import './styles/not-found.css';

export default function NotFound() {
  return (
    <section className="not-found-section bg-brand-primary">
      <div className="container">
        {/* Main content area with max-width constraint */}
        <div className="not-found-content max-w-screen-desktop mx-auto">
          {/* Background image (opacity controlled by CSS animations) */}
          <div className="background-image opacity-0"></div>
          
          {/* Large 404 number display */}
          <div className="not-found-number"><h1 className="text-brand-secondary text-8xl font-bold">404</h1></div>
          
          {/* Error message title */}
          <h2 className="not-found-title text-brand-tertiary">Oops... Page not found</h2>
          
          {/* Error description */}
          <p className="not-found-text text-brand-tertiary italic">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          
          {/* Call-to-action button to return to homepage */}
          <Button href="/" variant="blue" className="cta-back-home w-fit mx-auto !mt-[4vh]">Go Back Home</Button>
        </div>
      </div>
    </section>
  );
}
