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

    // Set animation state based on homepage and scroll position
    if (homepage && window.scrollY === 0) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
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
