/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  },
  // This setting allows the Edge runtime to access environment variables
  serverRuntimeConfig: {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
}

export default nextConfig;