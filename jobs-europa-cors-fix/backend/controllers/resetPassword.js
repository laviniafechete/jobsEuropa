import User from "../models/User.js";
import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import { validateEmail } from "../utils/validation.js";
import { sendResetEmail, sendResetSms } from "./sendEmail.js";
// Presupunem că vei crea o funcție sendResetSms în sendEmail.js sau un alt util

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, phone, userType } = req.body;

  // Validation
  if ((!email && !phone) || !userType) {
    return sendError(res, "Email, telefon și tipul utilizatorului sunt obligatorii (cel puțin unul dintre email sau telefon)", 400);
  }

  if (!['user', 'employer'].includes(userType)) {
    return sendError(res, "Tip utilizator invalid", 400);
  }

  let user = null;
  let Model = userType === 'user' ? User : Employer;

  if (email) {
    if (!validateEmail(email)) {
      return sendError(res, "Format email invalid", 400);
    }
    user = await Model.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, "Email-ul nu a fost găsit", 404);
    }
  } else if (phone) {
    // Normalizează telefonul (poți adăuga validare suplimentară)
    const normalizedPhone = phone.replace(/\s+/g, '');
    user = await Model.findOne({ phone: normalizedPhone });
    if (!user) {
      return sendError(res, "Numărul de telefon nu a fost găsit", 404);
    }
  }

  // Generate reset token
  const resetToken = user.generateResetToken();
  await user.save();

  // Send reset email or SMS
  try {
    if (email) {
      await sendResetEmail(user.email, resetToken, userType);
    } else if (phone) {
      // Trebuie să implementezi sendResetSms (vezi sendEmail.js sau creează sendSms.js)
      await sendResetSms(user.phone, resetToken, userType);
    }
    sendSuccess(res, null, email ? "Email de resetare trimis cu succes" : "SMS de resetare trimis cu succes");
  } catch (error) {
    // Remove reset token if sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return sendError(res, email ? "Eroare la trimiterea email-ului" : "Eroare la trimiterea SMS-ului", 500);
  }
});

export const changeEmployerPassword = asyncHandler(async (req, res) => {
  const employerId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return sendError(res, "Toate câmpurile sunt obligatorii", 400);
  }
  if (newPassword.length < 6) {
    return sendError(res, "Parola nouă trebuie să aibă minim 6 caractere", 400);
  }
  const employer = await Employer.findById(employerId);
  if (!employer) {
    return sendError(res, "Angajatorul nu a fost găsit", 404);
  }
  const isMatch = await employer.comparePassword(oldPassword);
  if (!isMatch) {
    return sendError(res, "Parola veche este incorectă", 401);
  }
  employer.password = newPassword;
  await employer.save();
  sendSuccess(res, null, "Parola a fost schimbată cu succes");
}); 