/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "nextgen.smartgreenovation.com",
      "nextgen.dev.smartgreenovation.com",
      "asset.kompas.com",
      "telegra.ph",
      "https://telegra.ph/file/f854ba4dc39e3d29696bb.jpg",
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
