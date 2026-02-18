/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@eumetise/ui', '@eumetise/state', '@eumetise/rbac', '@eumetise/security'],

  typescript: {
    ignoreBuildErrors: true, // For scaffold demonstration
  }
};

export default nextConfig;