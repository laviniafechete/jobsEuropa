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

  // Determin dacă este abonament sau plată one-time
  const isSubscription = priceId.includes('Basic') || priceId.includes('Premium');
  const isOneTime = priceId.includes('Single') || priceId.includes('Promotion');

  const sessionConfig = {
    payment_method_types: ['card'],
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
      priceId: priceId,
    },
  };

  // Adaug mode-ul în funcție de tipul de plată
  if (isSubscription) {
    sessionConfig.mode = 'subscription';
  } else if (isOneTime) {
    sessionConfig.mode = 'payment';
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);
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
    const priceId = session.metadata.priceId;
    
    // Determin tipul de abonament din price ID
    let subscriptionType = 'basic'; // default
    if (priceId.includes('Basic')) {
      subscriptionType = 'basic';
    } else if (priceId.includes('Premium')) {
      subscriptionType = 'premium';
    } else if (priceId.includes('Single')) {
      subscriptionType = 'single';
    } else if (priceId.includes('Promotion')) {
      subscriptionType = 'promotion';
    }
    
    // Activez abonamentul în DB
    const updateData = { 
      subscriptionActive: true, 
      subscriptionType: subscriptionType
    };
    
    // Pentru abonamentele one-time, setăm o dată de expirare
    if (subscriptionType === 'single' || subscriptionType === 'promotion') {
      updateData.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 zile
    }
    
    await Employer.findOneAndUpdate(
      { userId: employerId },
      updateData
    );
  }
  
  res.json({ received: true });
});

// GET /profile - returnează datele employerului curent
router.get("/profile", authMiddleware, asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.user._id);
  if (!employer) return sendError(res, "Angajatorul nu a fost găsit", 404);
  
  console.log('=== PROFILE ROUTE DEBUG ===');
  console.log('Employer found:', employer.userId);
  console.log('Company profile:', employer.companyProfile);
  console.log('Logo URL:', employer.companyProfile?.logoUrl);
  
  const publicData = employer.toPublicJSON();
  console.log('Public data company profile:', publicData.companyProfile);
  
  sendSuccess(res, publicData, "Profil companie găsit");
}));

export default router;
