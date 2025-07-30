import Employer from "../models/Employer.js";
import { generateToken } from "../middlewares/authMiddleware.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import { validateEmail, validatePassword } from "../utils/validation.js";

export const loginEmployer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return sendError(res, "Email și parola sunt obligatorii", 400);
  }

  if (!validateEmail(email)) {
    return sendError(res, "Format email invalid", 400);
  }

  if (!validatePassword(password)) {
    return sendError(res, "Parola trebuie să aibă cel puțin 6 caractere", 400);
  }

  // Find employer
  const employer = await Employer.findOne({ email: email.toLowerCase() });
  if (!employer) {
    return sendError(res, "Email sau parolă incorectă", 401);
  }

  // Check if employer is active
  if (!employer.isActive) {
    return sendError(res, "Contul este dezactivat", 401);
  }

  // Check if email is verified
  if (!employer.emailVerified) {
    return sendError(res, "Contul nu este verificat. Verifică email-ul pentru a activa contul.", 401);
  }

  // Verify password
  const isPasswordValid = await employer.comparePassword(password);
  if (!isPasswordValid) {
    return sendError(res, "Email sau parolă incorectă", 401);
  }

  // Update last login
  employer.lastLogin = new Date();
  await employer.save();

  // Generate token
  const token = generateToken({ userId: employer.userId }); // config.jwtExpiresIn e deja folosit în generateToken

  // Get employer data without password
  const employerData = employer.toPublicJSON();

  sendSuccess(res, {
    employer: employerData,
    token,
  }, "Autentificare reușită");
});
