export const productionConfig = {
  APP_ENV: 'production',
  API_BASE_URL: 'https://www.jobs-europa.com/api',
  APP_BASE_URL: 'https://www.jobs-europa.com',
  BACKEND_URL: 'https://www.jobs-europa.com',
  
  // OAuth URLs
  GOOGLE_OAUTH_URL: 'https://www.jobs-europa.com/api/auth/google',
  FACEBOOK_OAUTH_URL: 'https://www.jobs-europa.com/api/auth/facebook',
  
  // Contact Information
  CONTACT_PHONE: '+40757758647',
  CONTACT_EMAIL: 'contact@jobs-europa.com',
  WHATSAPP_NUMBER: '40757758647',
  
  // Feature Flags
  ENABLE_PASSWORD_GATE: false, // Disable in production when ready
  ENABLE_ANALYTICS: true,
  
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