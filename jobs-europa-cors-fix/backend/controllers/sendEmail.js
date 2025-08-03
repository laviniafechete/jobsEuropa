import nodemailer from "nodemailer";
import dotenv from "dotenv";
import smsService from '../services/smsService.js';

dotenv.config();

// Create nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send verification email
export const sendVerificationEmail = async (email, verificationToken, userType) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${userType === 'user' ? 'employee' : 'employer'}/verify-email?token=${verificationToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Jobs Europa - Verificare Email</h2>
      <p>Bună!</p>
      <p>Mulțumim că te-ai înregistrat pe Jobs Europa!</p>
      <p>Pentru a activa contul tău, apasă pe butonul de mai jos:</p>
      <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Verifică Email-ul
      </a>
      <p>Link-ul este valid timp de 24 de ore.</p>
      <p>Dacă nu ai creat acest cont, poți ignora acest email.</p>
      <p>Cu stimă,<br>Echipa Jobs Europa</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Jobs Europa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verificare Email - Jobs Europa",
      html,
    });

    return info;
  } catch (error) {
    console.error("Eroare la trimiterea email-ului de verificare:", error);
    throw error;
  }
};

// Send reset password email
export const sendResetEmail = async (email, resetToken, userType) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${userType}/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Jobs Europa - Resetare Parolă</h2>
      <p>Ai solicitat resetarea parolei pentru contul tău.</p>
      <p>Apasă pe link-ul de mai jos pentru a reseta parola:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Resetează Parola
      </a>
      <p>Link-ul este valid timp de 10 minute.</p>
      <p>Dacă nu ai solicitat această resetare, poți ignora acest email.</p>
      <p>Cu stimă,<br>Echipa Jobs Europa</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Jobs Europa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Resetare Parolă - Jobs Europa",
      html,
    });

    return info;
  } catch (error) {
    console.error("Eroare la trimiterea email-ului de resetare:", error);
    throw error;
  }
};

// Send reset password SMS using Web2SMS
export const sendResetSms = async (phone, resetToken, userType) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${userType}/reset-password?token=${resetToken}`;
    const message = `Codul pentru resetarea parolei Jobs Europa. Link: ${resetUrl}. Valabil 10 minute.`;
    
    const result = await smsService.sendSMS(phone, message, {
      userData: `password_reset_${Date.now()}`,
      validity: 10 // 10 minutes validity
    });
    
    if (result.success) {
      console.log(`✅ Reset SMS sent to ${phone}, MessageID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } else {
      console.error(`❌ Failed to send SMS to ${phone}:`, result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send job application notification to employer
export const sendJobApplicationNotification = async (employerEmail, jobTitle, candidateName, candidateContact, jobLocation) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Jobs Europa - Aplicare Nouă</h2>
      <p>Bună!</p>
      <p>Ai primit o aplicare nouă pentru jobul tău.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Detalii Job:</h3>
        <p><strong>Poziție:</strong> ${jobTitle}</p>
        <p><strong>Locație:</strong> ${jobLocation}</p>
      </div>
      
      <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Detalii Candidat:</h3>
        <p><strong>Nume:</strong> ${candidateName}</p>
        <p><strong>Contact:</strong> ${candidateContact}</p>
        <p><strong>Data aplicării:</strong> ${new Date().toLocaleString('ro-RO')}</p>
      </div>
      
      <p>Poți gestiona aplicațiile din panoul tău de angajator.</p>
      <p>Cu stimă,<br>Echipa Jobs Europa</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Jobs Europa" <${process.env.EMAIL_USER}>`,
      to: employerEmail,
      subject: `Aplicare nouă la job: ${jobTitle}`,
      html,
    });

    console.log('Email de notificare aplicare trimis către angajator:', employerEmail);
    return info;
  } catch (error) {
    console.error("Eroare la trimiterea email-ului de notificare aplicare:", error);
    // Nu aruncăm eroarea pentru a nu afecta procesul de aplicare
    return null;
  }
};

// Send job application email and update user's appliedJobs array
export const sendApplicationEmail = async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({
      message: "Toate câmpurile (to, subject, html) sunt obligatorii",
    });
  }

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Jobs Europa" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return res.status(200).json({
      message: "Email trimis cu succes",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Eroare la trimiterea email-ului:", error);
    return res.status(500).json({
      message: "Eroare la trimiterea email-ului",
      error: error.message,
    });
  }
};
