'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnimationContextType {
  shouldAnimate: boolean;
  setShouldAnimate: (animate: boolean) => void;
  isHomepage: boolean;
  setIsHomepage: (homepage: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [isHomepage, setIsHomepage] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're on the homepage
    const currentPath = window.location.pathname;
    const homepage = currentPath === '/';
    setIsHomepage(homepage);

    // Defer animations until page is interactive (after initial load)
    // This prevents blocking the main thread during critical rendering
    const enableAnimations = () => {
      if (homepage && window.scrollY === 0) {
        setShouldAnimate(true);
      } else {
        setShouldAnimate(false);
      }
    };

    // Wait for page to be interactive before enabling animations
    if (document.readyState === 'complete') {
      // Page already loaded, enable animations after a short delay
      setTimeout(enableAnimations, 100);
    } else {
      // Wait for page load, then enable animations
      window.addEventListener('load', () => {
        setTimeout(enableAnimations, 100);
      });
    }
  }, []);

  return (
    <AnimationContext.Provider value={{
      shouldAnimate,
      setShouldAnimate,
      isHomepage,
      setIsHomepage
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
