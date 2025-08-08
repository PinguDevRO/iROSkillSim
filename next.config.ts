import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      new URL('https://db.irowiki.org/image/skill/**'),
    ],
  },
};

export default nextConfig;
