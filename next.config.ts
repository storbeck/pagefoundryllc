import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/insights",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/startups",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/insights/:slug",
        destination: "/writing/:slug",
        permanent: true,
      },
      {
        source: "/capnweb-batch-demo.html",
        destination:
          "/writing/reducing-frontend-latency-by-collapsing-chatty-request-chains",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
