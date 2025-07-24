import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    esmExternals: 'loose', // <- allows ESM modules to be imported
  },
}

module.exports = nextConfig

