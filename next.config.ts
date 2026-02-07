import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  // Allow overriding the build folder via environment variable
  distDir: process.env.DIST_DIR || ".next",
};


export default withNextIntl(nextConfig);
