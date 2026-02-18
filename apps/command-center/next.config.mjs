/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@eumetise/ui', '@eumetise/state', '@eumetise/rbac', '@eumetise/security'],

  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;