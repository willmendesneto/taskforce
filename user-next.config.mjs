/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // This is optional, but recommended for better tree-shaking
    serverComponentsExternalPackages: ['bcryptjs'],
  },
};

export default nextConfig;
