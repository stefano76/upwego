import { useEffect, useRef, useState } from 'react';

/**
 * Home Process Animation Controller
 * 
 * This file contains all animations related to the home-process section:
 * - Slide-down animation for the main content box
 * - List items fade-in-slide-right animation
 * - Button fade-in animation
 * - All animation configurations and styles
 */

// ============================================================================
// Animation Configuration
// ============================================================================

export interface HomeProcessAnimationConfig {
  /** Visibility threshold (0-1) for triggering slide-down animation */
  slideDownThreshold?: number;
  /** Delay after slide-down animation to show home-process-content (ms) */
  contentFadeInDelay?: number;
  /** Delay before starting scale animation sequence (ms) */
  scaleAnimationStartDelay?: number;
  /** Duration for each item scale animation (ms) */
  scaleAnimationDuration?: number;
  /** Duration for line growth animation (ms) */
  lineAnimationDuration?: number;
  /** Delay after all line animations complete before showing ::before line (ms) */
  lineCompleteDelay?: number;
  /** Whether content blocks have been loaded */
  blocksLoaded?: boolean;
}

const DEFAULT_CONFIG: Required<Omit<HomeProcessAnimationConfig, 'blocksLoaded'>> = {
  slideDownThreshold: 0.2,
  contentFadeInDelay: 2000, // Match slide-down animation duration (2s)
  scaleAnimationStartDelay: 300, // Delay after content fade-in
  scaleAnimationDuration: 400, // Duration for scale animation
  lineAnimationDuration: 600, // Duration for line growth
  lineCompleteDelay: 600, // Delay after all lines complete before showing ::before line
};

// ============================================================================
// Animation Hook
// ============================================================================

/**
 * Custom hook for home-process section animations
 * Handles all animations: slide-down, content fade-in, scale sequence, and lines
 */
export const useHomeProcessAnimation = (config: HomeProcessAnimationConfig = {}) => {
  const {
    slideDownThreshold = DEFAULT_CONFIG.slideDownThreshold,
    contentFadeInDelay = DEFAULT_CONFIG.contentFadeInDelay,
    scaleAnimationStartDelay = DEFAULT_CONFIG.scaleAnimationStartDelay,
    scaleAnimationDuration = DEFAULT_CONFIG.scaleAnimationDuration,
    lineAnimationDuration = DEFAULT_CONFIG.lineAnimationDuration,
    lineCompleteDelay = DEFAULT_CONFIG.lineCompleteDelay,
    blocksLoaded = false
  } = config;

  // Refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const boxProcessContentRef = useRef<HTMLElement | null>(null);
  const sectionTitleRef = useRef<HTMLElement | null>(null);
  const homeProcessContentRef = useRef<HTMLElement | null>(null);
  
  // Animation states
  const [hasAnimatedSlideDown, setHasAnimatedSlideDown] = useState(false);
  const [hasAnimatedContentFadeIn, setHasAnimatedContentFadeIn] = useState(false);
  const [hasAnimatedScale, setHasAnimatedScale] = useState(false);
  const [refsReady, setRefsReady] = useState(false);

  // ==========================================================================
  // Ref Setters
  // ==========================================================================

  const setSectionRef = (element: HTMLElement | null) => {
    if (element && sectionRef.current !== element) {
      sectionRef.current = element;
      // Check if all required refs are now ready
      if (sectionRef.current && boxProcessContentRef.current) {
        setRefsReady(true);
      }
    }
  };

  const setBoxProcessContentRef = (element: HTMLElement | null) => {
    if (element && boxProcessContentRef.current !== element) {
      boxProcessContentRef.current = element;
      // Check if all required refs are now ready
      if (sectionRef.current && boxProcessContentRef.current) {
        setRefsReady(true);
      }
    }
  };

  const setSectionTitleRef = (element: HTMLElement | null) => {
    if (element && sectionTitleRef.current !== element) {
      sectionTitleRef.current = element;
    }
  };

  const setHomeProcessContentRef = (element: HTMLElement | null) => {
    if (element && homeProcessContentRef.current !== element) {
      homeProcessContentRef.current = element;
    }
  };

  // ==========================================================================
  // Slide-Down Animation
  // ==========================================================================

  useEffect(() => {
    if (!blocksLoaded) return;
    if (hasAnimatedSlideDown) return;

    // Wait for refs to be ready (tracked via state)
    if (!refsReady || !sectionRef.current || !boxProcessContentRef.current) {
      return;
    }

    // Check if element is already visible when observer is set up
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.height;
    const visibilityRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;

    const triggerAnimation = () => {
      if (hasAnimatedSlideDown) return;
      
      boxProcessContentRef.current?.classList.add('animate-slide-down');
      sectionTitleRef.current?.classList.add('visible');
      setHasAnimatedSlideDown(true);
    };

    // If already visible, trigger immediately
    if (visibilityRatio >= slideDownThreshold) {
      triggerAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= slideDownThreshold) {
            triggerAnimation();
          }
        });
      },
      {
        threshold: slideDownThreshold,
        rootMargin: '0px'
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [blocksLoaded, slideDownThreshold, hasAnimatedSlideDown, refsReady]);

  // ==========================================================================
  // Home Process Content Fade-In Animation (after slide-down)
  // ==========================================================================

  useEffect(() => {
    if (!hasAnimatedSlideDown || hasAnimatedContentFadeIn) return;
    if (!homeProcessContentRef.current) return;

    // Wait for slide-down animation to complete, then fade in the content
    const timer = setTimeout(() => {
      if (homeProcessContentRef.current) {
        homeProcessContentRef.current.style.opacity = '1';
        setHasAnimatedContentFadeIn(true);
      }
    }, contentFadeInDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [hasAnimatedSlideDown, hasAnimatedContentFadeIn, contentFadeInDelay]);

  // ==========================================================================
  // Scale Animation Sequence (after content fade-in)
  // ==========================================================================

  useEffect(() => {
    if (!hasAnimatedContentFadeIn || hasAnimatedScale) return;
    if (!homeProcessContentRef.current) return;

    const container = homeProcessContentRef.current.querySelector('.home-process-items') as HTMLElement;
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.home-process-item')) as HTMLElement[];
    if (items.length === 0) return;

    // Start animation sequence after delay
    const startAnimation = () => {
      items.forEach((item, index) => {
        if (index === 0) {
          // First item: add animated class immediately
          setTimeout(() => {
            item.classList.add('animated');
          }, scaleAnimationStartDelay);
        } else {
          // Subsequent items: animate line first, then add animated class to item
          const previousItem = items[index - 1];
          const currentItem = item;
          
          // Calculate positions
          const prevRect = previousItem.getBoundingClientRect();
          const currentRect = currentItem.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Calculate line position and height
          const lineStartY = prevRect.top + prevRect.height / 2 - containerRect.top;
          const lineEndY = currentRect.top + currentRect.height / 2 - containerRect.top;
          const lineHeight = lineEndY - lineStartY;
          
          // Create line element
          const line = document.createElement('div');
          line.className = 'home-process-line';
          line.style.position = 'absolute';
          line.style.left = `calc(50% - 0.5px)`;
          line.style.top = `${lineStartY}px`;
          line.style.width = '1px';
          line.style.height = '0px';
          line.style.backgroundColor = 'white';
          line.style.transformOrigin = 'top center';
          line.style.zIndex = '1';
          
          container.style.position = 'relative';
          container.appendChild(line);
          
          // Calculate timing: after previous item completes, then line, then current item
          const previousItemCompleteTime = scaleAnimationStartDelay + (index - 1) * (scaleAnimationDuration + lineAnimationDuration) + scaleAnimationDuration;
          
          // Add animated class to line after previous item completes
          setTimeout(() => {
            line.classList.add('animated');
            // Set the target height when animating
            line.style.height = `${lineHeight}px`;
          }, previousItemCompleteTime);
          
          // Add animated class to item after line completes
          setTimeout(() => {
            currentItem.classList.add('animated');
          }, previousItemCompleteTime + lineAnimationDuration);
        }
      });
      
      // Show the ::before line only after ALL line animations complete
      // Calculate when the last line animation finishes
      const totalItems = items.length;
      if (totalItems > 1) {
        // Last line starts after: first item + (items-2) * (scale + line) + scale
        // Last line completes after: last line start + lineAnimationDuration
        const lastLineStartTime = scaleAnimationStartDelay + (totalItems - 2) * (scaleAnimationDuration + lineAnimationDuration) + scaleAnimationDuration;
        const lastLineCompleteTime = lastLineStartTime + lineAnimationDuration;
        
        setTimeout(() => {
          container.classList.add('line-complete');
          homeProcessContentRef.current?.classList.add('items-complete');
        }, lastLineCompleteTime + lineCompleteDelay);
      }
      
      setHasAnimatedScale(true);
    };

    // Small delay to ensure DOM is ready
    setTimeout(startAnimation, 50);
  }, [hasAnimatedContentFadeIn, hasAnimatedScale, scaleAnimationStartDelay, scaleAnimationDuration, lineAnimationDuration, lineCompleteDelay]);


  // ==========================================================================
  // Return API
  // ==========================================================================

  return {
    // Refs
    sectionRef: setSectionRef,
    boxProcessContentRef: setBoxProcessContentRef,
    sectionTitleRef: setSectionTitleRef,
    homeProcessContentRef: setHomeProcessContentRef,
    // Animation states
    hasAnimatedSlideDown,
    hasAnimatedContentFadeIn,
    hasAnimatedScale,
  };
};

// ============================================================================
// CSS Styles (for reference - actual styles should be in home.css)
// ============================================================================

/**
 * CSS styles that should be applied for home-process animations.
 * These are documented here for reference, but the actual styles
 * should remain in app/styles/home.css
 * 
 * Required CSS classes:
 * - .box-process-content: initial state (opacity: 0, transform: translateY(-30px))
 * - .box-process-content.animate-slide-down: animated state (uses Tailwind animate-slide-down)
 * - .section-title-process: initial state (opacity: 0)
 * - .section-title-process.visible: visible state (opacity: 1)
 * - .home-process-item: initial state (transform: scale(0))
 * - .home-process-item.animated: animated state (transform: scale(1))
 * - .home-process-items.line-complete::before: shows full line after all animations
 * - .home-process-content.items-complete: final state after all animations complete
 * - .home-process-content-cta: initial state (opacity: 0, pointer-events: none)
 * - .home-process-content.items-complete .home-process-content-cta: visible state (opacity: 1)
 */
