/**
 * VIEWPORT VISIBILITY UTILITY
 * 
 * Checks if an HTML element is visible in the browser viewport.
 * Used for scroll-based animations and lazy loading.
 */

/**
 * Determines if an element is visible in the viewport based on a threshold
 * 
 * This function calculates what percentage of an element is currently visible
 * in the viewport and returns true if it meets or exceeds the threshold.
 * 
 * HOW IT WORKS:
 * 1. Gets the element's position and size using getBoundingClientRect()
 * 2. Calculates how much of the element is visible (visible height)
 * 3. Compares visible height to total element height to get a ratio
 * 4. Returns true if ratio >= threshold
 * 
 * @param element - The HTML element to check (can be null)
 * @param threshold - Visibility threshold between 0 and 1
 *                   - 0.1 = 10% of element must be visible
 *                   - 1.0 = 100% of element must be visible (fully visible)
 *                   - Default: 0.1 (10%)
 * @returns true if element meets visibility threshold, false otherwise
 * 
 * USAGE EXAMPLE:
 * Used in scroll-based animations:
 * if (isElementVisible(element, 1.0)) {
 *   element.classList.add('visible');
 * }
 */
export const isElementVisible = (element: HTMLElement | null, threshold: number = 0.1): boolean => {
  if (!element) return false;
  
  // Get element's position and dimensions relative to viewport
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Calculate how much of the element is actually visible
  // visibleHeight = the portion of the element that's within the viewport
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;
  
  // Calculate visibility ratio (0 = not visible, 1 = fully visible)
  const visibilityRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;
  
  // Return true if visibility meets or exceeds threshold
  return visibilityRatio >= threshold;
};
