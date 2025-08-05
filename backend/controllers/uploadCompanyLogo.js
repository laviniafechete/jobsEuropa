import Employer from "../models/Employer.js";
import { asyncHandler, sendSuccess, sendError } from "../utils/errorHandler.js";
import fs from 'fs';
import path from 'path';

// Ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

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
  console.log('Employer ID:', employer._id);
  console.log('Current companyProfile:', employer.companyProfile);

  // Ensure directory exists before operations
  const uploadDir = path.join(process.cwd(), 'public', 'companyLogos');
  ensureDirectoryExists(uploadDir);

  // Delete old logo if exists
  if (employer.companyProfile?.logoUrl) {
    const oldLogoPath = path.join(process.cwd(), 'public', employer.companyProfile.logoUrl);
    try {
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
        console.log('Deleted old logo:', oldLogoPath);
      }
    } catch (error) {
      console.error('Error deleting old logo:', error);
    }
  }

  // Update logo URL in company profile
  const logoUrl = `/companyLogos/${req.file.filename}`;
  
  console.log('Saving logo URL:', logoUrl);
  console.log('Current employer.companyProfile:', employer.companyProfile);
  
  if (!employer.companyProfile) {
    employer.companyProfile = {};
    console.log('Created new companyProfile object');
  }
  
  employer.companyProfile.logoUrl = logoUrl;
  console.log('Updated employer.companyProfile:', employer.companyProfile);
  
  // Mark as modified to ensure save
  employer.markModified('companyProfile');
  
  const savedEmployer = await employer.save();
  console.log('Employer saved successfully');
  console.log('Saved employer companyProfile:', savedEmployer.companyProfile);
  
  // Verify the save by fetching again
  const verifyEmployer = await Employer.findById(req.user._id);
  console.log('Verification - employer companyProfile:', verifyEmployer.companyProfile);
  console.log('Verification - logo URL:', verifyEmployer.companyProfile?.logoUrl);

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

  // Ensure directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'companyLogos');
  ensureDirectoryExists(uploadDir);

  // Delete logo file if exists
  if (employer.companyProfile?.logoUrl) {
    const logoPath = path.join(process.cwd(), 'public', employer.companyProfile.logoUrl);
    try {
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
        console.log('Deleted logo file:', logoPath);
      } else {
        console.log('Logo file not found:', logoPath);
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