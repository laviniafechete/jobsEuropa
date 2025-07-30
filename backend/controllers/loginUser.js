import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import config from "../config.js";

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, phone, loginMethod } = req.body;

  // Validate input
  if (!loginMethod) {
    return sendError(res, "Metoda de login este obligatorie (email sau phone)", 400);
  }

  let user;

  if (loginMethod === "email") {
    if (!email || !password) {
      return sendError(res, "Email și parola sunt obligatorii", 400);
    }

    // Find user by email
    user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Email sau parolă incorectă", 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Email sau parolă incorectă", 401);
    }
  } else if (loginMethod === "phone") {
    if (!phone) {
      return sendError(res, "Numărul de telefon este obligatoriu", 400);
    }

    // Find user by phone
    user = await User.findOne({ phone });
    if (!user) {
      return sendError(res, "Numărul de telefon nu este înregistrat", 401);
    }

    // Generate SMS verification code (6 digits)
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    const smsCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save SMS code to user
    user.smsVerificationCode = smsCode;
    user.smsCodeExpiry = smsCodeExpiry;
    await user.save();

    // TODO: Integrate with SMS service (Twilio, etc.)
    // For now, we'll just return the code in development
    console.log(`SMS Code for ${phone}: ${smsCode}`);

    return sendSuccess(res, {
      message: "Cod de verificare trimis prin SMS",
      phone: phone,
      requiresSmsVerification: true
    }, "Cod SMS trimis cu succes");
  } else {
    return sendError(res, "Metoda de login invalidă", 400);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.userId, userType: "user" },
    process.env.JWT_SECRET,
    { expiresIn: config.jwtExpiresIn }
  );

  // Remove sensitive data
  const userResponse = {
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    hasCompletedCv: user.hasCompletedCv,
    createdAt: user.createdAt,
    userType: "user"
  };

  sendSuccess(res, {
    user: userResponse,
    token
  }, "Login realizat cu succes");
});

// New controller for SMS verification
export const verifySmsCode = asyncHandler(async (req, res) => {
  const { phone, smsCode } = req.body;

  if (!phone || !smsCode) {
    return sendError(res, "Numărul de telefon și codul SMS sunt obligatorii", 400);
  }

  // Find user by phone
  const user = await User.findOne({ phone });
  if (!user) {
    return sendError(res, "Numărul de telefon nu este înregistrat", 401);
  }

  // Check if SMS code exists and is not expired
  if (!user.smsVerificationCode || !user.smsCodeExpiry) {
    return sendError(res, "Codul SMS nu a fost solicitat sau a expirat", 400);
  }

  if (new Date() > user.smsCodeExpiry) {
    return sendError(res, "Codul SMS a expirat", 400);
  }

  // Verify SMS code
  if (user.smsVerificationCode !== smsCode) {
    return sendError(res, "Codul SMS este incorect", 400);
  }

  // Clear SMS code after successful verification
  user.smsVerificationCode = undefined;
  user.smsCodeExpiry = undefined;
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.userId, userType: "user" },
    process.env.JWT_SECRET,
    { expiresIn: config.jwtExpiresIn }
  );

  // Remove sensitive data
  const userResponse = {
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    hasCompletedCv: user.hasCompletedCv,
    createdAt: user.createdAt,
    userType: "user"
  };

  sendSuccess(res, {
    user: userResponse,
    token
  }, "Verificare SMS realizată cu succes");
});
