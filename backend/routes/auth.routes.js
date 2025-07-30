import express from "express";
import { registerUser, verifyPhoneRegistration } from "../controllers/registerUser.js";
import { loginUser, verifySmsCode } from "../controllers/loginUser.js";
import { registerEmployer } from "../controllers/registerEmployer.js";
import { loginEmployer } from "../controllers/loginEmployer.js";
import { resetPassword } from "../controllers/resetPassword.js";
import { verifyEmail, verifyEmailByUserId, getVerificationToken, generateTestToken } from "../controllers/verifyEmail.js";
import { getUserInfo } from "../controllers/getUserInfo.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config.js';

const router = express.Router();

// Public routes
router.post("/register-user", registerUser);
router.post("/verify-phone-registration", verifyPhoneRegistration);
router.post("/login-user", loginUser);
router.post("/verify-sms", verifySmsCode);
router.post("/register-employer", registerEmployer);
router.post("/login-employer", loginEmployer);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:userType/:token", verifyEmail);
router.get("/verify-email-manual/:userType/:userId", verifyEmailByUserId); // Temporary for testing
router.get("/debug-token/:userType/:userId", getVerificationToken); // Temporary for debugging
router.get("/generate-test-token/:userType/:userId", generateTestToken); // Temporary for debugging

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user.userId, userType: 'user' }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.redirect(`${config.frontendUrl}/employee/oauth-success?token=${token}&provider=Google`);
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user.userId, userType: 'user' }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.redirect(`${config.frontendUrl}/employee/oauth-success?token=${token}&provider=Facebook`);
});

// Protected routes
router.get("/me", authMiddleware, getUserInfo);

export default router;
