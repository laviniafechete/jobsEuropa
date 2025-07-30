import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import { sendVerificationEmail } from "./sendEmail.js";
import smsService from '../services/smsService.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, registerMethod } = req.body;

  // Validate input
  if (!registerMethod) {
    return sendError(res, "Metoda de înregistrare este obligatorie (email sau phone)", 400);
  }

  if (!name || name.trim().length < 2) {
    return sendError(res, "Numele trebuie să aibă cel puțin 2 caractere", 400);
  }

  if (registerMethod === "email") {
    if (!email || !password) {
      return sendError(res, "Email și parola sunt obligatorii", 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, "Format email invalid", 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, "Acest email este deja înregistrat", 409);
    }

    // Validate password
    if (password.length < 6) {
      return sendError(res, "Parola trebuie să aibă cel puțin 6 caractere", 400);
    }

    // Create user with email
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      emailVerified: false,
      phoneVerified: false
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    try {
      await sendVerificationEmail(user.email, verificationToken, 'user');
    } catch (e) {
      console.log(`Email verification token for ${email}: ${verificationToken}`);
    }

    sendSuccess(res, {
      message: "Cont creat cu succes. Verifică email-ul pentru a activa contul.",
      userId: user.userId,
      email: user.email,
      requiresEmailVerification: true
    }, "Înregistrare reușită");

  } else if (registerMethod === "phone") {
    if (!phone) {
      return sendError(res, "Numărul de telefon este obligatoriu", 400);
    }

    // Validate phone format (Romanian)
    const phoneRegex = /^(\+40|0)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return sendError(res, "Format număr telefon invalid. Folosește un număr românesc valid.", 400);
    }

    // Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return sendError(res, "Acest număr de telefon este deja înregistrat", 409);
    }

    // Create user with phone
    const user = new User({
      name: name.trim(),
      phone,
      password: crypto.randomBytes(32).toString('hex'), // Temporary password
      emailVerified: false,
      phoneVerified: false
    });

    // Generate SMS verification code
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.smsVerificationCode = smsCode;
    user.smsCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send SMS verification using Web2SMS
    try {
      const result = await smsService.sendVerificationCode(phone, `register_${user._id}`);
      
      if (result.success) {
        // Update user with the actual verification code sent
        user.smsVerificationCode = result.verificationCode;
        await user.save();
        console.log(`✅ SMS verification sent to ${phone}, MessageID: ${result.messageId}`);
      } else {
        console.error(`❌ Failed to send SMS to ${phone}:`, result.error);
        // Fallback to console log for development
        console.log(`[FALLBACK] SMS verification code for ${phone}: ${smsCode}`);
      }
    } catch (error) {
      console.error('SMS sending error during registration:', error);
      // Fallback to console log for development
      console.log(`[FALLBACK] SMS verification code for ${phone}: ${smsCode}`);
    }

    sendSuccess(res, {
      message: "Cont creat cu succes. Verifică telefonul pentru a activa contul.",
      userId: user.userId,
      phone: user.phone,
      requiresSmsVerification: true
    }, "Înregistrare reușită");

  } else {
    return sendError(res, "Metoda de înregistrare invalidă", 400);
  }
});

// New controller for phone verification during registration
export const verifyPhoneRegistration = asyncHandler(async (req, res) => {
  const { phone, smsCode, password } = req.body;

  if (!phone || !smsCode || !password) {
    return sendError(res, "Numărul de telefon, codul SMS și parola sunt obligatorii", 400);
  }

  // Validate password
  if (password.length < 6) {
    return sendError(res, "Parola trebuie să aibă cel puțin 6 caractere", 400);
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

  // Update user with real password and mark phone as verified
  user.password = password;
  user.phoneVerified = true;
  user.smsVerificationCode = undefined;
  user.smsCodeExpiry = undefined;
  await user.save();

  sendSuccess(res, {
    message: "Numărul de telefon a fost verificat cu succes. Contul tău este activ.",
    userId: user.userId,
    phone: user.phone
  }, "Verificare telefon reușită");
});
