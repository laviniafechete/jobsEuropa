import { developmentConfig } from './env.development.js';
import { productionConfig } from './env.production.js';

// Detect environment
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     !process.env.NODE_ENV ||
                     process.env.NODE_ENV === 'dev';

const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.NODE_ENV === 'prod';

// Select configuration based on environment
const config = isDevelopment ? developmentConfig : productionConfig;

// Environment detection utilities
export const ENV = {
  isDevelopment,
  isProduction,
  mode: process.env.NODE_ENV || 'development'
};

// Export all configuration
export const {
  MONGODB_URI,
  PORT,
  HOST,
  FRONTEND_URL,
  CORS_ORIGIN,
  JWT_SECRET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK_URL,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  WEB2SMS_USERNAME,
  WEB2SMS_PASSWORD,
  WEB2SMS_WSDL_URL,
  BCRYPT_ROUNDS,
  SESSION_SECRET,
  DEBUG,
  ENABLE_LOGGING
} = config;

// Utility functions
export const getFullFrontendUrl = (path = '') => {
  return `${FRONTEND_URL}${path}`;
};

export const getBackendUrl = () => {
  const protocol = isProduction ? 'https' : 'http';
  const host = isProduction ? 'jobs-europa.com' : `${HOST}:${PORT}`;
  return `${protocol}://${host}`;
};

// Console logging for debugging
if (isDevelopment && DEBUG) {
  console.log('🔧 Backend Environment:', {
    mode: ENV.mode,
    isDevelopment,
    isProduction,
    PORT,
    HOST,
    FRONTEND_URL,
    MONGODB_URI: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
  });
}

export default config; 