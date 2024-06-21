/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
    // hostname: ["res.cloudinary.com"],
  },
  redirects: async () => {
    return [
      {
        has: [{ type: 'header', key: 'host', value: 'www.artsbyart.com' }],
        destination: 'https://www.artsbyart.com',
        permanent: true,
      },
    ];
  },
  experimental: {
    runtime: 'edge',
  },
}

module.exports = nextConfig
