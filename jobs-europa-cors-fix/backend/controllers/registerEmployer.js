import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { sendVerificationEmail } from "./sendEmail.js";
import crypto from "crypto";

export const registerEmployer = asyncHandler(async (req, res) => {
  const { companyName, email, password, confirm } = req.body;

  // Validation
  if (!companyName || !email || !password || !confirm) {
    return sendError(res, "Toate câmpurile sunt obligatorii", 400);
  }

  if (password !== confirm) {
    return sendError(res, "Parolele nu se potrivesc", 400);
  }

  if (!validateEmail(email)) {
    return sendError(res, "Format email invalid", 400);
  }

  if (!validatePassword(password)) {
    return sendError(res, "Parola trebuie să aibă cel puțin 6 caractere", 400);
  }

  if (companyName.trim().length < 2) {
    return sendError(res, "Numele companiei trebuie să aibă cel puțin 2 caractere", 400);
  }

  // Check if employer already exists
  const existingEmployer = await Employer.findOne({ email: email.toLowerCase() });

  if (existingEmployer) {
    return sendError(res, "Un cont cu acest email există deja", 409);
  }

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

  // Create new employer
  const newEmployer = new Employer({
    companyName: companyName.trim(),
    email: email.toLowerCase(),
    password,
    emailVerified: false,
    verificationToken: verificationTokenHash,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  await newEmployer.save();

  // Log the token for debugging (remove in production)
  console.log('=== DEBUG: Email Verification Token (Employer) ===');
  console.log('Email:', newEmployer.email);
  console.log('UserId:', newEmployer.userId);
  console.log('Verification Token:', verificationToken);
  console.log('Verification URL:', `${process.env.FRONTEND_URL || 'http://localhost:5173'}/employer/verify-email?token=${verificationToken}`);
  console.log('API URL:', `http://localhost:5001/api/auth/verify-email/employer/${verificationToken}`);
  console.log('=====================================');

  // Send verification email
  try {
    await sendVerificationEmail(newEmployer.email, verificationToken, 'employer');
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Don't fail registration if email fails
  }

  sendSuccess(res, {
    employerId: newEmployer.userId,
    message: "Cont de angajator creat cu succes. Verifică email-ul pentru a activa contul.",
    debugToken: verificationToken, // Remove in production
    debugUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/employer/verify-email?token=${verificationToken}` // Remove in production
  }, "Înregistrare reușită", 201);
});
