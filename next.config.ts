import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  productionBrowserSourceMaps: true,
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["@tabler/icons-react"],
  },
};

export default nextConfig;
