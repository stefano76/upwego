/**
 * Environment utility functions
 * Provides helper functions to detect the current environment
 */

/**
 * Checks if the current environment is localhost/development
 * 
 * @returns true if running on localhost, false otherwise
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check NODE_ENV
    return process.env.NODE_ENV === 'development';
  }
  
  // Client-side: check hostname
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.0.') ||
    hostname.endsWith('.local')
  );
}

/**
 * Returns the browser-side localhost check code as a string
 * This is used for inline scripts that need to check localhost in the browser
 * 
 * @returns JavaScript code string that evaluates to true if on localhost
 */
export function getLocalhostCheckCode(): string {
  return `window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.startsWith('192.168.') ||
          window.location.hostname.startsWith('10.0.') ||
          window.location.hostname.endsWith('.local')`;
}

