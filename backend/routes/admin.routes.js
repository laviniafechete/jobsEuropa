import express from 'express';
import adminAuth from '../middlewares/adminMiddleware.js';
import {
  loginAdmin,
  getDashboardAnalytics,
  getUserAnalytics,
  getEmployerAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// Admin login (no auth required)
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/dashboard', adminAuth, getDashboardAnalytics);
router.get('/users', adminAuth, getUserAnalytics);
router.get('/employers', adminAuth, getEmployerAnalytics);

export default router; 