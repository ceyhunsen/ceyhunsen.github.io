import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    typedRoutes: true,
  }
};

export default nextConfig;
