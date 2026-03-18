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
  eslint: {
    // Skip linting during production builds (already done in CI)
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
}

// Only wrap with Sentry when auth token is available (avoids extra memory usage during Docker builds)
if (process.env.SENTRY_AUTH_TOKEN) {
  module.exports = withSentryConfig(nextConfig, {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  });
} else {
  module.exports = nextConfig;
}
