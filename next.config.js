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
        {
          source: "/:slug/order",
          has: [
            {
              type: "query",
              key: "type",
              value: "modal",
            },
          ],
          destination: "/:slug/order-modal",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/signup",
        has: [
          {
            type: "cookie",
            key: "refresh_token",
          },
        ],
        destination: "/",
        permanent: true,
      },
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key: "refresh_token",
          },
        ],
        destination: "/",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
