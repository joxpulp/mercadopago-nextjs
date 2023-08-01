/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com']
  },
  experimental: {
    nextScriptWorkers: true
  },
  transpilePackages: ['@mercadopago/sdk-react']
}

module.exports = nextConfig
