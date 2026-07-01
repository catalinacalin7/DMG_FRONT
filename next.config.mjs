import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.100.55",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-pn.vevdev.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.carlogos.org",
        port: "",
        pathname: "/logo/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
