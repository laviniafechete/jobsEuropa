import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/jobs-europa',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
  // File upload configuration
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadPath: './uploads/',
  },
  
  // Validation
  validation: {
    passwordMinLength: 6,
    phoneRegex: /^\+[1-9]\d{1,14}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_xxx',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_xxx',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // OAuth configuration
  googleClientID: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
  facebookClientID: process.env.FACEBOOK_CLIENT_ID || '',
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  facebookCallbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5001/api/auth/facebook/callback',

  // Web2SMS configuration
  web2sms: {
    username: process.env.WEB2SMS_USERNAME,
    authKey: process.env.WEB2SMS_AUTH_KEY,
    sender: process.env.WEB2SMS_SENDER || 'JobsEuropa',
    wsdlUrl: 'https://www.web2sms.ro/api?wsdl',
  },
};

export default config;
