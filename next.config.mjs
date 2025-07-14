/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ["ekyamm-images-backend.s3.ap-south-1.amazonaws.com"],
  },
  // Optional: Keep your custom domain if needed
  customDomain: "https://ekyamm-images-backend.s3.ap-south-1.amazonaws.com",
};

export default nextConfig;
