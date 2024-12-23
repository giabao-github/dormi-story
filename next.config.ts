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
    remotePatterns: [
      {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
      },
      {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
      },
    ],
  }
};

export default nextConfig;
