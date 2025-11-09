import express from "express";
import { updateHasCompletedCv } from "../controllers/updateUserCvStatus.js";
import { getUserInfo } from "../controllers/getUserInfo.js";
import { sendApplicationEmail } from "../controllers/sendEmail.js";
import { updateAppliedJobs, getAppliedJobs } from "../controllers/updateAppliedJobs.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import { protectEmployer, checkEmployerSubscription } from "../middlewares/authMiddleware.js";
import Cv from "../models/Cv.js";

const router = express.Router();

// Protected routes - only authenticated users can access
router.patch("/update-cv-status", authMiddleware, updateHasCompletedCv);
router.patch("/cv-status", authMiddleware, updateHasCompletedCv);
router.get("/get-user-info", authMiddleware, getUserInfo);
router.get("/info", authMiddleware, getUserInfo);
router.get("/me", authMiddleware, getUserInfo); // Add this route for frontend compatibility
router.post("/send-application", authMiddleware, sendApplicationEmail);
router.put("/applied-jobs", authMiddleware, updateAppliedJobs);
router.get("/applied-jobs", authMiddleware, getAppliedJobs);

// List all users (for employer)
router.get("/", protectEmployer, checkEmployerSubscription, async (req, res) => {
  try {
    const users = await User.find({}, "name email phone hasCompletedCv experience skills location isActive lastLogin emailVerified phoneVerified")
      .lean();
    // Populez cu CV dacă există
    const usersWithCv = await Promise.all(users.map(async (u) => {
      const cv = await Cv.findOne({ user: u._id }).lean();
      return { ...u, cv };
    }));
    res.json({ success: true, data: usersWithCv });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
