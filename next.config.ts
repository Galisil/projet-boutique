import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclure bcrypt et autres modules natifs du bundle côté client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };

      // Exclure bcrypt du bundle côté client
      config.externals = config.externals || [];
      config.externals.push("bcrypt");
    }
    return config;
  },
};

export default nextConfig;
