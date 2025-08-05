import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import fs from 'fs';
import path from 'path';

export const uploadCompanyLogo = asyncHandler(async (req, res) => {
  console.log('=== UPLOAD LOGO DEBUG ===');
  console.log('req.user:', req.user);
  console.log('req.userType:', req.userType);
  console.log('req.file:', req.file);
  
  if (!req.file) {
    return sendError(res, "Nu a fost selectat niciun fișier", 400);
  }

  // Find employer
  const employer = await Employer.findById(req.user._id);
  if (!employer) {
    return sendError(res, "Employer nu a fost găsit", 404);
  }

  console.log('Found employer:', employer.userId);

  // Delete old logo if exists
  if (employer.companyProfile?.logoUrl) {
    const oldLogoPath = path.join(process.cwd(), 'public', employer.companyProfile.logoUrl);
    try {
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    } catch (error) {
      console.error('Error deleting old logo:', error);
    }
  }

  // Update logo URL in company profile
  const logoUrl = `/companyLogos/${req.file.filename}`;
  
  if (!employer.companyProfile) {
    employer.companyProfile = {};
  }
  
  employer.companyProfile.logoUrl = logoUrl;
  await employer.save();

  sendSuccess(res, {
    logoUrl: logoUrl,
    message: "Logo-ul companiei a fost încărcat cu succes"
  }, "Logo încărcat cu succes");
});

export const deleteCompanyLogo = asyncHandler(async (req, res) => {
  console.log('=== DELETE LOGO DEBUG ===');
  console.log('req.user:', req.user);
  console.log('req.userType:', req.userType);
  
  // Find employer
  const employer = await Employer.findById(req.user._id);
  if (!employer) {
    return sendError(res, "Employer nu a fost găsit", 404);
  }

  console.log('Found employer:', employer.userId);

  // Delete logo file if exists
  if (employer.companyProfile?.logoUrl) {
    const logoPath = path.join(process.cwd(), 'public', employer.companyProfile.logoUrl);
    try {
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
    }
  }

  // Remove logo URL from company profile
  if (employer.companyProfile) {
    employer.companyProfile.logoUrl = undefined;
    await employer.save();
  }

  sendSuccess(res, null, "Logo-ul companiei a fost șters cu succes");
}); 