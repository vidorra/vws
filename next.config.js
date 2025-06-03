/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config) => {
    // Fix for undici module issue
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "undici": false,
    };
    
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
}

module.exports = nextConfig