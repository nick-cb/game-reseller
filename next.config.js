const { redirect } = require("next/dist/server/api-utils");

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
        hostname: "**",
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
      {
        source: "/login",
        headers: [{ key: "type", value: "modal" }],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/login",
          has: [
            {
              type: "query",
              key: "type",
              value: "modal",
            },
          ],
          destination: "/login-modal",
        },
        {
          source: "/signup",
          has: [
            {
              type: "query",
              key: "type",
              value: "modal",
            },
          ],
          destination: "/signup-modal",
        },
      ],
    };
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
