import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "u0hw2s7onu.ufs.sh",
        pathname: "/f/*",
      },
      // {
      //   protocol: "https",
      //   hostname: "utfs.io",
      // },
    ],
  },
};

export default nextConfig;
