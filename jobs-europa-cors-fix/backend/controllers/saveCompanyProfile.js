import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import { validateLength, sanitizeInput } from "../utils/validation.js";

export const saveCompanyProfile = asyncHandler(async (req, res) => {
  const {
    name,
    cui,
    location,
    domain,
    description,
    logoUrl,
    contactPerson,
    position,
    email,
    phone,
    website
  } = req.body;

  // Find and update employer
  const employer = await Employer.findById(req.user._id);
  if (!employer) {
    return sendError(res, "Employer nu a fost găsit", 404);
  }

  // Update root fields if needed
  if (name) employer.companyName = name;
  if (email) employer.email = email;
  if (phone) employer.phone = phone;

  // Update company profile with all fields
  employer.companyProfile = {
    ...employer.companyProfile,
    name: name || employer.companyProfile?.name,
    cui: cui || employer.companyProfile?.cui,
    location: location || employer.companyProfile?.location,
    domain: domain || employer.companyProfile?.domain,
    description: description || employer.companyProfile?.description,
    logoUrl: logoUrl || employer.companyProfile?.logoUrl,
    contactPerson: contactPerson || employer.companyProfile?.contactPerson,
    position: position || employer.companyProfile?.position,
    email: email || employer.companyProfile?.email,
    phone: phone || employer.companyProfile?.phone,
    website: website || employer.companyProfile?.website
  };

  employer.hasProfileCompleted = true;
  await employer.save();

  sendSuccess(res, employer.toPublicJSON(), "Profilul companiei a fost actualizat cu succes");
});
