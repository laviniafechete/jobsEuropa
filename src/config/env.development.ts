export const developmentConfig = {
  APP_ENV: 'development',
  API_BASE_URL: 'http://localhost:5001/api',
  APP_BASE_URL: 'http://localhost:5173',
  BACKEND_URL: 'http://localhost:5001',
  
  // OAuth URLs
  GOOGLE_OAUTH_URL: 'http://localhost:5001/api/auth/google',
  FACEBOOK_OAUTH_URL: 'http://localhost:5001/api/auth/facebook',
  
  // Contact Information
  CONTACT_PHONE: '+40757758647',
  CONTACT_EMAIL: 'contact@jobs-europa.com',
  WHATSAPP_NUMBER: '40757758647',
  
  // Feature Flags
  ENABLE_PASSWORD_GATE: true,
  ENABLE_ANALYTICS: false,
  
  // API Endpoints
  API: {
    AUTH: '/auth',
    USERS: '/users',
    EMPLOYERS: '/employer',
    JOBS: '/jobs',
    CV: '/cv',
    ADMIN: '/admin'
  }
}; 