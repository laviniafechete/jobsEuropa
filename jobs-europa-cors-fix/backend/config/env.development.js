// Development Environment Configuration
export const developmentConfig = {
  NODE_ENV: 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobs-europa-dev',
  
  // Server
  PORT: process.env.PORT || 5001,
  HOST: process.env.HOST || 'localhost',
  
  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-development',
  
  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true' || false,
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password',
  
  // OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
  
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || 'your-facebook-client-id',
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || 'your-facebook-client-secret',
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5001/api/auth/facebook/callback',
  
  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_your-stripe-secret-key',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your-webhook-secret',
  
  // Web2SMS Configuration
  WEB2SMS_USERNAME: process.env.WEB2SMS_USERNAME || 'your-web2sms-username',
  WEB2SMS_PASSWORD: process.env.WEB2SMS_PASSWORD || 'your-web2sms-password',
  WEB2SMS_WSDL_URL: process.env.WEB2SMS_WSDL_URL || 'https://www.web2sms.ro/soap/soap.php?wsdl',
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-for-development',
  
  // Debug
  DEBUG: process.env.DEBUG === 'true' || true,
  ENABLE_LOGGING: process.env.ENABLE_LOGGING === 'true' || true
}; 