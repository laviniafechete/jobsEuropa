import express from "express";
import mongoose from "mongoose";
// import cors from "cors"; // REMOVED - doing manual CORS
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";
import { rateLimit } from "./middlewares/authMiddleware.js";
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import cvRoutes from "./routes/cv.routes.js";
import userRoutes from "./routes/user.routes.js";
import employerRoutes from "./routes/employer.routes.js";
import jobRoutes from "./routes/job.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== ULTIMATE CORS FIX - MULTIPLE LOCATIONS =====
console.log('🔥 ULTIMATE CORS FIX LOADED - TIMESTAMP:', new Date().toISOString());

// Method 1: Pre-middleware headers
app.use((req, res, next) => {
  console.log(`🔥 ULTIMATE CORS PRE: ${req.method} ${req.url} from origin: ${req.get('Origin') || 'none'}`);
  
  // Set headers multiple ways
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Also set with res.header
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.log('🔥 ULTIMATE CORS headers set with BOTH setHeader and header');
  
  // Handle OPTIONS immediately
  if (req.method === 'OPTIONS') {
    console.log('🔥 ULTIMATE CORS: OPTIONS handled immediately');
    res.status(200);
    res.end();
    return;
  }
  
  next();
});

// Passport session setup (required for OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'jobs-europa-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: config.googleCallbackURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: Math.random().toString(36).slice(-8), // random pass
        emailVerified: true
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: config.facebookClientID,
  clientSecret: config.facebookClientSecret,
  callbackURL: config.facebookCallbackURL,
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let email = profile.emails && profile.emails[0] && profile.emails[0].value;
    if (!email) return done(new Error('No email from Facebook'), null);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        password: Math.random().toString(36).slice(-8),
        emailVerified: true
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// CORS Test endpoint
app.get('/api/cors-test', (req, res) => {
  console.log('🧪 CORS Test endpoint hit!');
  console.log(`Origin: ${req.get('Origin') || 'none'}`);
  console.log(`User-Agent: ${req.get('User-Agent')}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  
  res.set('X-Debug-CORS', 'test-endpoint');
  res.json({
    success: true,
    message: 'CORS test endpoint working',
    origin: req.get('Origin'),
    timestamp: new Date().toISOString(),
    corsDebug: true
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files from the React app build directory
const frontendBuildPath = path.join(__dirname, '..', 'dist');

// Serve static files in both development and production
app.use(express.static(frontendBuildPath));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, config.mongoOptions);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  mongoose.connection.close().then(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  });
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
