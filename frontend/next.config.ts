import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "*",
            },
            {
                protocol: "https",
                hostname: "*",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    productionBrowserSourceMaps: true,
};

export default nextConfig;
