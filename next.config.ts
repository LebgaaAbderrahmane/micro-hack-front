import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  trailingSlash: true,
  // Allow overriding the build folder via environment variable
  distDir: process.env.DIST_DIR || ".next",
  allowedDevOrigins: ["127.0.0.1:3000", "0.0.0.0:3000", "localhost:3000"],
};

export default withNextIntl(nextConfig);
