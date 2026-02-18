// In a real project, install 'zod' and use it here. 
// Since I cannot install packages, this is a vanilla JS implementation of the pattern.

export const validateEnv = () => {
  const requiredKeys = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_APP_NAME',
  ];

  const missing = requiredKeys.filter(key => !process.env[key] && !process.env.NEXT_PUBLIC_MOCK_ENV);

  if (missing.length > 0) {
    // Only throw in production or if not mocking
    if (process.env.NODE_ENV === 'production') {
       throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    } else {
       console.warn(`⚠️ Missing env vars: ${missing.join(', ')}. Using defaults for dev.`);
    }
  }

  return {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Eumetise Dev',
  };
};

export const env = validateEnv();