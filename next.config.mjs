// /** @type {import('next').NextConfig} */

// const nextConfig = {
//   // output: 'export',
//   images: {
//     domains: ["ekyamm-images-backend.s3.ap-south-1.amazonaws.com"],
//   },
//   // Optional: Keep your custom domain if needed
//   // customDomain: "https://ekyamm-images-backend.s3.ap-south-1.amazonaws.com",

// };


import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      "protocol": "https",
      "hostname": "ekyamm-images-backend.s3.ap-south-1.amazonaws.com"
    }],
  },
  reactStrictMode: true,
  swcMinify: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            mangle: true,
            compress: true,
            output: {
              comments: false,
            },
          },
        })
      );
    }
    return config;
  },

  output: 'standalone',
};

export default nextConfig;
