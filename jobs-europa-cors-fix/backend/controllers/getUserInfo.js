// backend/controllers/getUserInfo.js
import User from "../models/User.js";
import { asyncHandler, sendSuccess } from "../utils/errorHandler.js";

export const getUserInfo = async (req, res) => {
  try {
    // Get user from middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, error: { message: "User not found" } });
  }

    console.log("User from middleware:", user);

    // Get user with populated applied jobs
    const userWithJobs = await User.findById(user._id)
      .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires -smsVerificationCode -smsCodeExpiry')
      .populate({
        path: 'appliedJobs.job',
        populate: {
          path: 'employer',
          select: 'companyName email phone location'
        }
      });

    console.log("User with jobs:", userWithJobs);

    // Ensure appliedJobs is an array
    if (!userWithJobs.appliedJobs) {
      userWithJobs.appliedJobs = [];
    }

    res.json({
      success: true,
      message: "User information retrieved successfully",
      data: userWithJobs
    });
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};
