const { withSentryConfig } = require('@sentry/nextjs');

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

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,
});
