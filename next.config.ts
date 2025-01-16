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
  /* config options here */
};

export default nextConfig;
