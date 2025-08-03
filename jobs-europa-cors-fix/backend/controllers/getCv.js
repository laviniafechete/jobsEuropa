import Cv from "../models/Cv.js";
import User from "../models/User.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";

export const getCv = asyncHandler(async (req, res) => {
  const userId = req.user.userId; // From auth middleware

  // Check if user exists
  const user = await User.findOne({ userId });
  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  // Get CV for this user
  const cv = await Cv.findOne({ user: user._id });

  if (!cv) {
    return sendError(res, "CV-ul nu a fost găsit", 404);
  }

  sendSuccess(res, {
    cv: cv.toObject()
  }, "CV obținut cu succes");
}); 