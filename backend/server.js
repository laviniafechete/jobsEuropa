import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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

// Security middleware - CORS
app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.corsOrigin,
      'https://jobs-europa.com',
      'https://www.jobs-europa.com',
      'http://localhost:5173', // for development
      'http://localhost:3000'  // for development
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// CORS debugging middleware
app.use((req, res, next) => {
  if (config.nodeEnv === 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
  }
  next();
});

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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files from the React app build directory
if (config.nodeEnv === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(frontendBuildPath));
  
  // Catch all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

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
  
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
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
