// Production Environment Configuration
export const productionConfig = {
  NODE_ENV: 'production',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobs-europa-prod',
  
  // Server
  PORT: process.env.PORT || 5001,
  HOST: process.env.HOST || '0.0.0.0',
  
  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://jobs-europa.com',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://jobs-europa.com',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'CHANGE-THIS-IN-PRODUCTION-SUPER-SECRET-JWT-KEY',
  
  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true' || false,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  // OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'https://jobs-europa.com/api/auth/google/callback',
  
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || 'https://jobs-europa.com/api/auth/facebook/callback',
  
  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Web2SMS Configuration
  WEB2SMS_USERNAME: process.env.WEB2SMS_USERNAME,
  WEB2SMS_PASSWORD: process.env.WEB2SMS_PASSWORD,
  WEB2SMS_WSDL_URL: process.env.WEB2SMS_WSDL_URL || 'https://www.web2sms.ro/soap/soap.php?wsdl',
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  SESSION_SECRET: process.env.SESSION_SECRET,
  
  // Debug
  DEBUG: process.env.DEBUG === 'true' || false,
  ENABLE_LOGGING: process.env.ENABLE_LOGGING === 'true' || false
}; 