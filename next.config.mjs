import userNextConfig from './user-next.config.mjs'; // Directly import user-next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    ...userNextConfig?.experimental, // Merge experimental config
  },
  output: userNextConfig?.output, // Use output from user-next.config.mjs if defined
};

export default nextConfig;
