/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve = config.resolve || {};
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            canvas: false,
        };
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
