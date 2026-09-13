import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/kindergarten-marketing-v2",
  assetPrefix: "/kindergarten-marketing-v2",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["@phosphor-icons/react"] },
};

export default nextConfig;
