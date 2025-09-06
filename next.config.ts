import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Suppress deprecation warnings
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /url\.parse\(\)/ }
    ];
    return config;
  },
};

export default nextConfig;
