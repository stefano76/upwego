import { useEffect, useRef, useState } from 'react';
import { isElementVisible } from '../utils/visibility';

interface AnimationElement {
  element: HTMLElement;
  animationClass: string;
}

/**
 * Enhanced hook for multiple animations within a section
 * Each element can have its own animation class
 */
export const useMultiAnimation = (threshold: number = 0.1) => {
  const sectionRef = useRef<HTMLElement>(null);
  const elementRefs = useRef<AnimationElement[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  const addElementRef = (animationClass: string) => (element: HTMLElement | null) => {
    if (element && !elementRefs.current.some(item => item.element === element)) {
      elementRefs.current.push({ element, animationClass });
    }
  };

  useEffect(() => {
    if (hasAnimated) return;

    const checkVisibility = () => {
      if (hasAnimated || !sectionRef.current) return;
      
      if (isElementVisible(sectionRef.current, threshold)) {
        elementRefs.current.forEach(({ element, animationClass }) => {
          element.classList.add(animationClass);
        });
        setHasAnimated(true);
      }
    };

    // Check immediately if ref is available
    if (sectionRef.current) {
      checkVisibility();
    }
    
    // Always set up scroll listener - it will check the ref on each scroll
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [hasAnimated, threshold]);

  return {
    sectionRef,
    addElementRef,
    hasAnimated
  };
};
