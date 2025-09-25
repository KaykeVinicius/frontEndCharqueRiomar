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

        destination: "http://192.168.100.51:3000/:path*", // Proxy para a API Rails
      },
    ];
  },
};

export default nextConfig;
