/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  },
  experimental: {
    runtime: 'experimental-edge',
  },
  // This setting allows the Edge runtime to access environment variables
  serverRuntimeConfig: {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  },
}

export default nextConfig;