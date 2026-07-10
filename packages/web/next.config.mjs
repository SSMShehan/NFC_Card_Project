/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for catching potential issues
  reactStrictMode: true,

  // Allow serving profile images from the backend dev server + Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Fallback avatar service
        pathname: '/**',
      },
    ],
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    NEXT_PUBLIC_APP_NAME: 'NEXUS',
  },
};

export default nextConfig;
