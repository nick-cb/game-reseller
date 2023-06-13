/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/",
        headers: [
          { key: "cache", value: "no-store" },
          // {
          //   "Cache-Control": "no-store",
          // },
        ],
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
