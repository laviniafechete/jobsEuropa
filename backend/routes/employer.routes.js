import express from "express";
import { registerEmployer } from "../controllers/registerEmployer.js";
import { saveCompanyProfile } from "../controllers/saveCompanyProfile.js";
import { uploadCompanyLogo, deleteCompanyLogo } from "../controllers/uploadCompanyLogo.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { changeEmployerPassword } from "../controllers/resetPassword.js";
import { uploadCompanyLogo as uploadMiddleware, handleUploadError } from "../middlewares/uploadMiddleware.js";
import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import stripePackage from 'stripe';
import config from '../config.js';

const stripe = stripePackage(config.stripeSecretKey);

const router = express.Router();

// Public routes
router.post("/register", registerEmployer);

// Protected routes - only authenticated employers can access
router.post("/save-profile", authMiddleware, saveCompanyProfile);
router.post("/change-password", authMiddleware, changeEmployerPassword);

// Logo upload routes
router.post("/upload-logo", authMiddleware, uploadMiddleware.single('logo'), handleUploadError, uploadCompanyLogo);
router.delete("/delete-logo", authMiddleware, deleteCompanyLogo);

// Inițiere sesiune Stripe Checkout
router.post('/stripe/create-checkout-session', authMiddleware, asyncHandler(async (req, res) => {
  const { priceId } = req.body;
  const employer = req.user;
  if (!employer) return sendError(res, 'Employer not found', 404);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: employer.email,
    success_url: `${config.frontendUrl}/employer/subscription-success`,
    cancel_url: `${config.frontendUrl}/employer/subscription-cancel`,
    metadata: {
      employerId: employer.userId,
    },
  });
  res.json({ url: session.url });
}));

// Webhook Stripe pentru confirmare plată
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const employerId = session.metadata.employerId;
    // Activez abonamentul în DB
    await Employer.findOneAndUpdate(
      { userId: employerId },
      { subscriptionActive: true, subscriptionType: 'basic' }
    );
  }
  res.json({ received: true });
});

// GET /profile - returnează datele employerului curent
router.get("/profile", authMiddleware, asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.user._id);
  if (!employer) return sendError(res, "Angajatorul nu a fost găsit", 404);
  sendSuccess(res, employer.toPublicJSON(), "Profil companie găsit");
}));

export default router;
