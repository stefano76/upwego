import { useEffect, useRef, useState } from 'react';

interface AnimationElement {
  element: HTMLElement;
  animationClass: string;
  hasAnimated: boolean;
  parentBlock?: HTMLElement; // Reference to the parent block container
}

/**
 * Enhanced hook for multiple animations within a section
 * Each element can have its own animation class
 * Uses Intersection Observer API for better mobile/iPhone compatibility
 */
export const useMultiAnimation = (threshold: number = 0.1) => {
  const sectionRef = useRef<HTMLElement>(null);
  const elementRefs = useRef<AnimationElement[]>([]);
  const [sectionMounted, setSectionMounted] = useState(false);

  const addElementRef = (animationClass: string) => (element: HTMLElement | null) => {
    if (element && !elementRefs.current.some(item => item.element === element)) {
      // Find the parent challenge block container
      let parentBlock: HTMLElement | undefined;
      let current: HTMLElement | null = element.parentElement;
      while (current) {
        if (current.classList.contains('home-challenge-content')) {
          parentBlock = current;
          break;
        }
        current = current.parentElement;
      }

      elementRefs.current.push({ 
        element, 
        animationClass, 
        hasAnimated: false,
        parentBlock 
      });
    }
  };

  useEffect(() => {
    if (!sectionMounted || !sectionRef.current) {
      return;
    }

    const observers: IntersectionObserver[] = [];
    let scrollHandler: (() => void) | null = null;

    const triggerAnimationForBlock = (blockElement: HTMLElement) => {
      // Find all elements that belong to this block and haven't been animated yet
      const blockElements = elementRefs.current.filter(
        item => item.parentBlock === blockElement && !item.hasAnimated
      );

      if (blockElements.length === 0) {
        return;
      }

      blockElements.forEach(({ element, animationClass }) => {
        if (element && element.classList) {
          // Remove opacity-0 class so animation can run properly
          element.classList.remove('opacity-0');
          element.classList.add(animationClass);
          // Mark as animated
          const item = elementRefs.current.find(item => item.element === element);
          if (item) {
            item.hasAnimated = true;
          }
        }
      });
    };

    const checkBlockVisibility = (blockElement: HTMLElement) => {
      const rect = blockElement.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const elementHeight = rect.height;
      
      // On mobile, trigger if any part is visible
      const isMobile = window.innerWidth < 1024;
      const effectiveThreshold = isMobile ? 0.05 : threshold;
      const visibilityRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;

      return {
        visibilityRatio,
        effectiveThreshold,
        shouldTrigger: visibilityRatio >= effectiveThreshold
      };
    };

    // Wait for elements to be added, then set up observers for each block
    const setupObservers = () => {
      if (!sectionRef.current) return;
      
      // Check if elements are ready
      if (elementRefs.current.length === 0) {
        // Try again in 100ms
        setTimeout(setupObservers, 100);
        return;
      }

      // Get unique parent blocks
      const parentBlocks = new Set<HTMLElement>();
      elementRefs.current.forEach(item => {
        if (item.parentBlock) {
          parentBlocks.add(item.parentBlock);
        }
      });

      const isMobile = window.innerWidth < 1024;
      const effectiveThreshold = isMobile ? 0.05 : threshold;

      // Set up an observer for each block
      parentBlocks.forEach((blockElement) => {
        // Check initial visibility
        const { shouldTrigger } = checkBlockVisibility(blockElement);

        if (shouldTrigger) {
          triggerAnimationForBlock(blockElement);
        }

        // Set up Intersection Observer for this block
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio >= effectiveThreshold) {
                triggerAnimationForBlock(blockElement);
              }
            });
          },
          {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
            rootMargin: isMobile ? '100px' : '50px'
          }
        );

        observer.observe(blockElement);
        observers.push(observer);
      });

      // Add scroll listener as fallback
      scrollHandler = () => {
        parentBlocks.forEach((blockElement) => {
          const { shouldTrigger } = checkBlockVisibility(blockElement);
          if (shouldTrigger) {
            triggerAnimationForBlock(blockElement);
          }
        });
      };
      window.addEventListener('scroll', scrollHandler, { passive: true });
      window.addEventListener('resize', scrollHandler, { passive: true });
      if (isMobile) {
        window.addEventListener('touchmove', scrollHandler, { passive: true });
      }
    };

    // Start setup after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObservers, 200);

    return () => {
      clearTimeout(timeoutId);
      observers.forEach(observer => observer.disconnect());
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', scrollHandler);
        window.removeEventListener('touchmove', scrollHandler);
      }
    };
  }, [threshold, sectionMounted]);

  // Callback ref to detect when section is mounted
  const setSectionRef = (element: HTMLElement | null) => {
    sectionRef.current = element;
    if (element && !sectionMounted) {
      setSectionMounted(true);
    } else if (!element && sectionMounted) {
      setSectionMounted(false);
    }
  };

  return {
    sectionRef: setSectionRef,
    addElementRef
  };
};
