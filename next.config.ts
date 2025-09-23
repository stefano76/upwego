import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
