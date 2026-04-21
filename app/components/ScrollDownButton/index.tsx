'use client';

import { useEffect, useRef } from 'react';

interface ScrollDownButtonProps {
  text?: string;
  visible?: boolean;
  targetId?: string;
}

export default function ScrollDownButton({ text, visible, targetId }: ScrollDownButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleScrollDown = () => {
    const startPosition = window.pageYOffset;
    const heightHeader = 100;
    let targetPosition: number;
    
    if (targetId) {
      // Scroll to element with the specified ID
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetPosition = targetElement.offsetTop - heightHeader;
      } else {
        // Fallback to default behavior if element not found
        targetPosition = window.innerHeight;
      }
    } else {
      // Default behavior: scroll down by one viewport height
      targetPosition = window.innerHeight;
    }
    
    const distance = targetPosition - startPosition;
    const duration = 1500; // 1.5 seconds
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    // Show button by default, or when explicitly set to visible
    if ((visible !== false) && buttonRef.current) {
      buttonRef.current.classList.remove('hidden');
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.add('opacity-100');
        }
      }, 1000);
    }
  }, [visible]);

  return (
    <div className="flex justify-center absolute tablet:bottom-5 bottom-10 left-0 w-full">
      <button
        ref={buttonRef}
        onClick={handleScrollDown}
        className="intro-scroll-down-button cursor-pointer opacity-0 hidden transition-opacity animate-fade-in"
        aria-label="Scroll down"
      >
        <span className="flex flex-col items-center gap-2">
          {text && (
            <span className="text-sm text-brand-tertiary hover:text-brand-secondary transition-colors duration-300">{text}</span>
          )}
          <svg
            className="w-12 h-12 text-[var(--brand-secondary)] animate-bounce"
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
    </div>
  );
}

