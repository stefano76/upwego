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
};

export default nextConfig;
