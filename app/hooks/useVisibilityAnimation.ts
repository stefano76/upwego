import { useEffect, useRef, useState } from 'react';
import { isElementVisible } from '../utils/visibility';

interface UseVisibilityAnimationOptions {
  threshold?: number; // Visibility threshold (0-1)
  animationClass?: string; // CSS animation class to apply
}

export const useVisibilityAnimation = (options: UseVisibilityAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    animationClass = 'animate-fade-in-scale'
  } = options;

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
  }, [hasAnimated, threshold, animationClass]);

  return {
    sectionRef,
    addElementRef,
    hasAnimated
  };
};
