import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages deployment
  ...(isGithubPages && {
    output: "export",
    basePath: "/English-LearningHub",
    assetPrefix: "/English-LearningHub/",
    trailingSlash: true,
  }),
};

export default nextConfig;
