/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client", "prisma"],
}

export default nextConfig
