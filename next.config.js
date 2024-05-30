/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
    // hostname: ["res.cloudinary.com"],
  },
  experimental: {
    runtime: 'edge',
  },
}

module.exports = nextConfig
