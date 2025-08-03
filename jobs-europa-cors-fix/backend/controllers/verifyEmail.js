import User from "../models/User.js";
import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import crypto from "crypto";

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token, userType } = req.params;

  if (!token || !userType) {
    return sendError(res, "Token și tipul utilizatorului sunt obligatorii", 400);
  }

  if (!['user', 'employer'].includes(userType)) {
    return sendError(res, "Tip utilizator invalid", 400);
  }

  // Hash the token to compare with stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find user/employer by verification token
  const Model = userType === 'user' ? User : Employer;
  const user = await Model.findOne({
    verificationToken: tokenHash,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return sendError(res, "Token invalid sau expirat", 400);
  }

  // Verify email
  const isVerified = user.verifyEmail(token);
  if (!isVerified) {
    return sendError(res, "Token invalid sau expirat", 400);
  }

  await user.save();

  sendSuccess(res, {
    message: "Email verificat cu succes! Poți să te autentifici acum."
  }, "Verificare reușită");
});

// Temporary endpoint for manual email verification (for testing)
export const verifyEmailByUserId = asyncHandler(async (req, res) => {
  const { userId, userType } = req.params;

  if (!userId || !userType) {
    return sendError(res, "userId și tipul utilizatorului sunt obligatorii", 400);
  }

  if (!['user', 'employer'].includes(userType)) {
    return sendError(res, "Tip utilizator invalid", 400);
  }

  // Find user/employer by userId
  const Model = userType === 'user' ? User : Employer;
  const user = await Model.findOne({ userId });

  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  // Mark email as verified
  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  sendSuccess(res, {
    message: "Email verificat manual cu succes! Poți să te autentifici acum."
  }, "Verificare manuală reușită");
});

// Debug endpoint to see verification token (temporary)
export const getVerificationToken = asyncHandler(async (req, res) => {
  const { userId, userType } = req.params;

  if (!userId || !userType) {
    return sendError(res, "userId și tipul utilizatorului sunt obligatorii", 400);
  }

  if (!['user', 'employer'].includes(userType)) {
    return sendError(res, "Tip utilizator invalid", 400);
  }

  // Find user/employer by userId
  const Model = userType === 'user' ? User : Employer;
  const user = await Model.findOne({ userId });

  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  sendSuccess(res, {
    userId: user.userId,
    email: user.email,
    emailVerified: user.emailVerified,
    hasVerificationToken: !!user.verificationToken,
    verificationTokenExpires: user.verificationTokenExpires,
    isExpired: user.verificationTokenExpires ? user.verificationTokenExpires < Date.now() : null
  }, "Informații token verificare");
});

// Generate test token for debugging (temporary)
export const generateTestToken = asyncHandler(async (req, res) => {
  const { userId, userType } = req.params;

  if (!userId || !userType) {
    return sendError(res, "userId și tipul utilizatorului sunt obligatorii", 400);
  }

  if (!['user', 'employer'].includes(userType)) {
    return sendError(res, "Tip utilizator invalid", 400);
  }

  // Find user/employer by userId
  const Model = userType === 'user' ? User : Employer;
  const user = await Model.findOne({ userId });

  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
  
  user.verificationToken = verificationTokenHash;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  sendSuccess(res, {
    userId: user.userId,
    email: user.email,
    verificationToken: verificationToken,
    verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${userType}/verify-email?token=${verificationToken}`,
    apiUrl: `http://localhost:5001/api/auth/verify-email/${userType}/${verificationToken}`
  }, "Token de test generat");
}); 