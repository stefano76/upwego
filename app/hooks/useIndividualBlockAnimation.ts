import { useEffect, useRef, useState } from 'react';
import { isElementVisible } from '../utils/visibility';

interface UseIndividualBlockAnimationOptions {
  threshold?: number; // Visibility threshold (0-1)
  animationClass?: string; // CSS animation class to apply
}

/**
 * Hook for individual block animations that trigger when each block comes into view
 * Each block animates independently when it becomes visible
 */
export const useIndividualBlockAnimation = (options: UseIndividualBlockAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    animationClass = 'animate-fade-in-delayed'
  } = options;

  const blockRefs = useRef<{ element: HTMLElement; hasAnimated: boolean }[]>([]);

  const addBlockRef = (index: number) => (element: HTMLElement | null) => {
    if (element) {
      // Remove any existing ref for this index
      blockRefs.current = blockRefs.current.filter((_, i) => i !== index);
      // Add the new ref
      blockRefs.current[index] = { element, hasAnimated: false };
    }
  };

  useEffect(() => {
    const checkVisibility = () => {
      blockRefs.current.forEach((blockRef, index) => {
        if (blockRef && !blockRef.hasAnimated && isElementVisible(blockRef.element, threshold)) {
          blockRef.element.classList.add(animationClass);
          blockRef.hasAnimated = true;
        }
      });
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [threshold, animationClass]);

  return {
    addBlockRef
  };
};
