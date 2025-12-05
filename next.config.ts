import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize CSS chunking to reduce preload warnings
  // 'strict' ensures CSS files are loaded in the exact order they are imported
  experimental: {
    cssChunking: 'strict',
  },
  webpack: (config) => {
    // Suppress deprecation warnings from node_modules
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /url\.parse\(\)/ },
      { message: /DeprecationWarning/ },
      { message: /DEP0169/ }
    ];
    return config;
  },
  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://cdn-cookieyes.com", // 'unsafe-eval' and 'unsafe-inline' needed for Next.js, Google Analytics, reCAPTCHA and CookieYes domains added
              "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for Tailwind CSS
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://log.cookieyes.com https://cdn-cookieyes.com", // Google Analytics, reCAPTCHA and CookieYes domains added
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-src 'self' https://www.google.com https://www.gstatic.com", // reCAPTCHA iframes
              "manifest-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
    ];
  },
};

export default nextConfig;
