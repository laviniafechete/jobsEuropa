import jwt from 'jsonwebtoken';
import config from '../config.js';
import { AuthenticationError, AuthorizationError } from '../utils/errorHandler.js';
import User from '../models/User.js';
import Employer from '../models/Employer.js';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log("Auth middleware - token:", token ? "exists" : "missing");

    // Check if token exists
    if (!token) {
      throw new AuthenticationError('Access denied. No token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    console.log("Decoded token:", decoded);
    const user = await User.findOne({ userId: decoded.userId }).select('-password');
    console.log("Found user:", user ? "yes" : "no");
    if (user) {
      req.user = user;
      req.userType = 'user';
      console.log("User authenticated:", user.userId);
      return next();
    }

    // Check if it's an employer
    const employer = await Employer.findOne({ userId: decoded.userId }).select('-password');
    if (employer) {
      req.user = employer;
      req.userType = 'employer';
      console.log("Employer authenticated:", employer.userId);
      return next();
    }

    throw new AuthenticationError('User not found');
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    next(error);
  }
};

// Alias for protect - used in routes
export const authMiddleware = protect;

// Protect routes for users only
export const protectUser = async (req, res, next) => {
  try {
    await protect(req, res, () => {});
    
    if (req.userType !== 'user') {
      throw new AuthorizationError('Access denied. User account required');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Protect routes for employers only
export const protectEmployer = async (req, res, next) => {
  try {
    await protect(req, res, () => {});
    console.log('--- DEBUG protectEmployer ---');
    console.log('req.userType:', req.userType);
    console.log('req.user:', req.user);
    if (req.userType !== 'employer') {
      throw new AuthorizationError('Access denied. Employer account required');
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't throw error if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      
      const user = await User.findOne({ userId: decoded.userId }).select('-password');
      if (user) {
        req.user = user;
        req.userType = 'user';
        return next();
      }

      const employer = await Employer.findOne({ userId: decoded.userId }).select('-password');
      if (employer) {
        req.user = employer;
        req.userType = 'employer';
        return next();
      }
    }

    next();
  } catch (error) {
    // Don't throw error for optional auth
    next();
  }
};

// Middleware pentru subscripție/trial angajator
export const checkEmployerSubscription = (req, res, next) => {
  if (req.userType !== 'employer') {
    return res.status(403).json({
      success: false,
      error: { message: 'Doar angajatorii pot accesa această funcție.' }
    });
  }
  const employer = req.user;
  const now = new Date();
  // Trial activ
  if (employer.trialEnd && now < new Date(employer.trialEnd)) {
    return next();
  }
  // Abonament activ
  if (employer.subscriptionActive) {
    return next();
  }
  // Nici trial, nici abonament
  return res.status(403).json({
    success: false,
    error: { message: 'Acces restricționat. Activează un abonament pentru a folosi această funcție.' }
  });
};

// Rate limiting helper
export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    } else {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests. Please try again later.'
        }
      });
    }

    userRequests.push(now);
    next();
  };
};
