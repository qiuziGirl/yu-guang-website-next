import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yu-guang-website.oss-ap-southeast-1.aliyuncs.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
