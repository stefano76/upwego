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
    if (!sectionRef.current || hasAnimated) return;

    const checkVisibility = () => {
      if (hasAnimated || !sectionRef.current) return;
      
      if (isElementVisible(sectionRef.current, threshold)) {
        elementRefs.current.forEach(({ element, animationClass }) => {
          element.classList.add(animationClass);
        });
        setHasAnimated(true);
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [hasAnimated, threshold, sectionRef.current]);

  return {
    sectionRef,
    addElementRef,
    hasAnimated
  };
};
