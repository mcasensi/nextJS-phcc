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
};

module.exports = nextConfig;
