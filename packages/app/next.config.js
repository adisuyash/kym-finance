/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Skip type checking during build (types are checked in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    }
    
    return config
  },
  
  images: {
    remotePatterns: [{ hostname: '*' }],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'react-icons'],
  },
}

module.exports = nextConfig
