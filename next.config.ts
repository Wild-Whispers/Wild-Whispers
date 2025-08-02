import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/images/**"
            },
            {
                protocol: "https",
                hostname: "api.wildwhispers.xyz",
                pathname: "/images/**",
            },
        ]
    }
};

export default nextConfig;
