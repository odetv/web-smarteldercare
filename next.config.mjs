/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "nextgen.smartgreenovation.com",
      "nextgen.dev.smartgreenovation.com",
      "asset.kompas.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
