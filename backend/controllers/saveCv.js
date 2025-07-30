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
    preferredJobs,
    additionalInfo,
    interestDomains // New field
  } = req.body;

  const userId = req.user.userId; // From auth middleware

  // Check if user exists
  const user = await User.findOne({ userId });
  if (!user) {
    return sendError(res, "Utilizatorul nu a fost găsit", 404);
  }

  // Prepare CV data
  const cvData = {
    user: user._id,
    personalInfo: {
      name: user.name,
      email: user.email || "",
      phone: phone || "",
      location: location || "",
      dateOfBirth: birthDate ? new Date(birthDate) : undefined,
      nationality: "Romanian" // Default
    },
    professional: {
      summary: additionalInfo || "",
      experience: experience ? [{
        company: "Experiență personală",
        position: "Angajat",
        startDate: new Date(),
        current: true,
        description: experience
      }] : [],
      education: education ? [{
        institution: "Educație",
        degree: "Diplomă",
        field: education,
        startDate: new Date(),
        current: true
      }] : []
    },
    skills: {
      technical: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      soft: [],
      languages: Array.isArray(languages) ? languages : (languages ? languages.split(',').map(lang => ({
        language: lang.trim(),
        level: 'intermediate'
      })) : [])
    },
    preferences: {
      desiredSalary: {
        min: salaryExpectation ? parseInt(salaryExpectation) : undefined,
        currency: 'EUR'
      },
      workType: ['full-time'], // Default to full-time, can be updated based on user preferences
      availability: availability || 'immediate',
      preferredLocations: location ? [location] : [],
      industries: preferredJobs ? preferredJobs.split(',').map(job => job.trim()) : [],
      interestDomains: Array.isArray(interestDomains) ? interestDomains : (interestDomains ? interestDomains.split(',').map(domain => domain.trim()) : [])
    }
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
