import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */

  transpilePackages: ["@drum-scheduler/sdk", "@drum-scheduler/config"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      // Force a single @tanstack/react-query instance across workspace packages
      // to avoid QueryClient context mismatches ("No QueryClient set" error).
      "@tanstack/react-query": path.resolve(
        __dirname,
        "node_modules/@tanstack/react-query",
      ),
    };
    return config;
  },
};

export default nextConfig;
