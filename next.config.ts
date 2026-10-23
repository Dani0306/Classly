import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "Contents" was renamed to "Materials"; keep old links and bookmarks working.
  async redirects() {
    return [
      { source: "/app/contents", destination: "/app/materials", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "disdpqeogqiwjupnryqp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
