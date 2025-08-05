import Cv from "../models/Cv.js";
import User from "../models/User.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";

export const saveCv = asyncHandler(async (req, res) => {
  const {
    experience,
    skills,
    education,
    languages,
    availability,
    location,
    phone,
    birthDate,
    gender,
    drivingLicense,
    hasPassport,
    willingToRelocate,
    salaryExpectation,
    additionalInfo,
    interestDomains,
    userId
  } = req.body;

  const userIdFromToken = req.user.userId; // From auth middleware

  // Check if user exists
  const user = await User.findOne({ userId: userIdFromToken });
  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  // Prepare CV data with new structure
  const cvData = {
    user: user._id,
    personalInfo: {
      name: user.name,
      email: user.email || "",
      phone: phone || "",
      location: location || "",
      dateOfBirth: birthDate ? new Date(birthDate) : undefined,
      nationality: "Romanian", // Default
      gender: gender || undefined
    },
    professional: {
      summary: additionalInfo || "",
      experience: experience || "",
      education: education || undefined
    },
    skills: {
      technical: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      soft: [],
      languages: Array.isArray(languages) ? languages : []
    },
    preferences: {
      desiredSalary: {
        min: undefined, // Will be calculated based on salaryExpectation if needed
        max: undefined,
        currency: 'EUR'
      },
      salaryExpectation: salaryExpectation || undefined,
      workType: ['full-time'], // Default to full-time
      availability: availability || 'immediate',
      preferredLocations: location ? [location] : [],
      industries: [],
      interestDomains: Array.isArray(interestDomains) ? interestDomains : []
    },
    documents: {
      drivingLicense: drivingLicense || false,
      hasPassport: hasPassport || false,
      willingToRelocate: willingToRelocate || false
    },
    additionalInfo: additionalInfo || ""
  };

  // Check if a CV already exists for this user
  let cv = await Cv.findOne({ user: user._id });

  if (cv) {
    // Update existing CV
    Object.assign(cv, cvData);
    await cv.save();
  } else {
    // Create new CV entry
    cv = new Cv(cvData);
    await cv.save();
  }

  // Update user's hasCompletedCv status
  user.hasCompletedCv = true;
  await user.save();

  sendSuccess(res, {
    message: "CV salvat cu succes",
    cv: cv.toObject(),
    hasCompletedCv: true
  }, "CV salvat", 201);
});
