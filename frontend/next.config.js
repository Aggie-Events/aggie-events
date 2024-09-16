/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    // webpack: (config, _) => ({
    //   ...config,
    //   watchOptions: {
    //     ...config.watchOptions,
    //     poll: 800,
    //     aggregateTimeout: 300,
    //   },
    // }),
  }