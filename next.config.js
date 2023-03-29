/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for both client and server bundles
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Add a rule for loading WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },
}

module.exports = nextConfig
