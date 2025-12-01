/**
 * Converts a hex color to rgba format with variable opacity
 * @param hex - Hex color string (e.g., "#081022" or "081022")
 * @param opacity - Opacity value between 0 and 1 (default: 1)
 * @returns rgba color string (e.g., "rgba(8, 16, 34, 0.3)")
 */
export function hexToRgba(hex: string, opacity: number = 1): string {
  // Remove the hash if present
  const cleanHex = hex.replace('#', '');
  
  // Parse the hex color
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Clamp opacity between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  
  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
}

