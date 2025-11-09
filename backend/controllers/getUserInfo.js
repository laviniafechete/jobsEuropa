import User from "../models/User.js";
import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";

export const getUserInfo = asyncHandler(async (req, res) => {
  // Get user from middleware
  const user = req.user;

  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  if (req.userType === "user") {
    // Get user with populated applied jobs
    const userWithJobs = await User.findById(user._id)
      .select(
        "-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires -smsVerificationCode -smsCodeExpiry"
      )
      .populate({
        path: "appliedJobs.job",
        populate: {
          path: "employer",
          select: "companyName email phone location",
        },
      });

    if (!userWithJobs) {
      return sendError(res, "Utilizatorul nu a fost găsit", 404);
    }

    if (!userWithJobs.appliedJobs) {
      userWithJobs.appliedJobs = [];
    }

    return sendSuccess(
      res,
      userWithJobs,
      "Informațiile utilizatorului au fost obținute"
    );
  }

  if (req.userType === "employer") {
    const employer = await Employer.findById(user._id).select(
      "-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires"
    );

    if (!employer) {
      return sendError(res, "Angajatorul nu a fost găsit", 404);
    }

    return sendSuccess(
      res,
      employer.toPublicJSON ? employer.toPublicJSON() : employer,
      "Informațiile angajatorului au fost obținute"
    );
  }

  return sendError(res, "Tip utilizator necunoscut", 400);
});
