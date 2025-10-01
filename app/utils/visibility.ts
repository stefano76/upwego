/**
 * Simple function to check if an element is visible in the viewport
 * @param element - The HTML element to check
 * @param threshold - Visibility threshold (0-1), default 0.1 (10%)
 * @returns boolean - true if element is visible, false otherwise
 */
export const isElementVisible = (element: HTMLElement | null, threshold: number = 0.1): boolean => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;
  const visibilityRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;
  
  return visibilityRatio >= threshold;
};
