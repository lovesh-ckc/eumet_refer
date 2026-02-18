/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@eumetise/ui', '@eumetise/state', '@eumetise/rbac', '@eumetise/security','@eumetise/api'],

  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
