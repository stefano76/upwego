import { useEffect, useRef, useState } from 'react';
import { isElementVisible } from '../utils/visibility';

/**
 * Super simple hook for visibility-based animations
 * Just pass the animation class and threshold, get back refs to use
 */
export const useSimpleAnimation = (animationClass: string = 'animate-in-scale', threshold: number = 0.1) => {
  const sectionRef = useRef<HTMLElement>(null);
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  const addElementRef = (element: HTMLElement | null) => {
    if (element && !elementRefs.current.includes(element)) {
      elementRefs.current.push(element);
    }
  };

  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const checkVisibility = () => {
      if (hasAnimated || !sectionRef.current) return;
      
      if (isElementVisible(sectionRef.current, threshold)) {
        elementRefs.current.forEach(element => {
          if (element) {
            element.classList.add(animationClass);
          }
        });
        setHasAnimated(true);
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [hasAnimated, threshold, animationClass, sectionRef.current]);

  return {
    sectionRef,
    addElementRef,
    hasAnimated
  };
};
