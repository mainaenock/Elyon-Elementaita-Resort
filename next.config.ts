import type { NextConfig } from "next";

const nextConfig: NextConfig = process.env.ELYON_GITHUB_PAGES === "1"
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_ELYON_BASE_PATH ?? "",
      trailingSlash: true,
    }
  : {};

export default nextConfig;
