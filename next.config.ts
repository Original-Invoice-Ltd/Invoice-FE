import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
  },
  // Disable source maps to speed up build
  productionBrowserSourceMaps: false,
};

export default nextConfig;
