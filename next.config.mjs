/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",

        destination: "http://127.0.0.1:3002/:path*", // Proxy para a API Rails
      },
    ];
  },
};

export default nextConfig;
