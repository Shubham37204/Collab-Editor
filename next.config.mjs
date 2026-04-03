/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    turbo: {
      enabled: false,
    },
  },
}

export default nextConfig