'use client';

export default function ScrollDownButton() {
  const handleScrollDown = () => {
    const startPosition = window.pageYOffset;
    const targetPosition = window.innerHeight;
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

  return (
    <div className="flex justify-center absolute tablet:bottom-5 bottom-10 left-0 w-full">
      <button id="home-intro-scroll-down-button"
        onClick={handleScrollDown}
        className="cursor-pointer opacity-0 hidden transition-opacity duration-1000"
        aria-label="Scroll down"
      >
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
      </button>
    </div>
  );
}
