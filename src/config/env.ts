import { developmentConfig } from './env.development';
import { productionConfig } from './env.production';

// Detect environment
const isDevelopment = import.meta.env.MODE === 'development' || 
                     import.meta.env.DEV || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

const isProduction = import.meta.env.MODE === 'production' || 
                    import.meta.env.PROD ||
                    window.location.hostname === 'jobs-europa.com';

// Select configuration based on environment
const config = isDevelopment ? developmentConfig : productionConfig;

// Environment detection utilities
export const ENV = {
  isDevelopment,
  isProduction,
  mode: import.meta.env.MODE || 'development'
};

// Export configuration
export const {
  APP_ENV,
  API_BASE_URL,
  APP_BASE_URL,
  BACKEND_URL,
  GOOGLE_OAUTH_URL,
  FACEBOOK_OAUTH_URL,
  CONTACT_PHONE,
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  ENABLE_PASSWORD_GATE,
  ENABLE_ANALYTICS,
  API
} = config;

// Utility functions
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const getFullUrl = (path: string) => {
  return `${APP_BASE_URL}${path}`;
};

// Console logging for debugging
if (isDevelopment) {
  console.log('🔧 Environment:', {
    mode: ENV.mode,
    isDevelopment,
    isProduction,
    API_BASE_URL,
    APP_BASE_URL,
    hostname: window.location.hostname
  });
}

export default config; 