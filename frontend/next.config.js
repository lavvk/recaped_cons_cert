/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // MetaMask SDK (pulled transitively by RainbowKit's metaMaskWallet) lists
    // @react-native-async-storage/async-storage as an optional peer dep. The
    // SDK never calls it in a browser context, but webpack still tries to
    // resolve the import. Aliasing to false silences the warning cleanly.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

module.exports = nextConfig;
