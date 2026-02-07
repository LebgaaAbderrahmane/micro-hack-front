import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  // Allow overriding the build folder via environment variable
  distDir: process.env.DIST_DIR || ".next",
  allowedDevOrigins: ["172.35.1.15:3000", "localhost:3000"],
};


export default withNextIntl(nextConfig);
