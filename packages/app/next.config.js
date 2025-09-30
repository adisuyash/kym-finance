/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Faster builds
  swcMinify: true,
  
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
