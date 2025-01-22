import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Match the protocol (e.g., 'http' or 'https').
        hostname: "**", // Wildcard to allow all hostnames.
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set a larger limit for file uploads, e.g., 10 MB.
    },
  },
};

export default nextConfig;
