/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'via.placeholder.com'],
    dangerouslyAllowSVG: true
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
}

module.exports = nextConfig
