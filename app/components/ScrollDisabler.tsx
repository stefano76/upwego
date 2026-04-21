'use client';

import { useEffect } from 'react';

const secondsToScroll = 1; // Reduced from 5 to 1 second

export default function ScrollDisabler() {
  useEffect(() => {
    // Only run on homepage
    if (window.location.pathname !== '/') return;

    // Check if user is at the top of the page
    const isAtTop = window.scrollY === 0;
    if (!isAtTop) return;

    // Disable scrolling for a much shorter time
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling after 1 second (reduced from 5)
    const timer = setTimeout(() => {
      document.body.style.overflow = 'unset';

      // Remove hidden class first
      const button = document.querySelector('.intro-scroll-down-button');
      if (button) {
        button.classList.remove('hidden');

        // Add opacity-100 after a small delay for smooth fade-in
        setTimeout(() => {
          button.classList.add('opacity-100');
        }, 100);
      }
    }, secondsToScroll * 1000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return null; // This component doesn't render anything
}
