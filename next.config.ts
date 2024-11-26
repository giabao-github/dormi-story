import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    domains: [
      
    ]
  }
};

export default nextConfig;
