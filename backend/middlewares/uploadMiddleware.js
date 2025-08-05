import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Ensure companyLogos directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Configure storage for company logos
const companyLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/companyLogos/';
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Doar fișiere imagine sunt permise!'), false);
  }
};

// Configure multer for company logo upload
export const uploadCompanyLogo = multer({
  storage: companyLogoStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Fișierul este prea mare. Dimensiunea maximă este 5MB.'
        }
      });
    }
  }
  
  if (error.message === 'Doar fișiere imagine sunt permise!') {
    return res.status(400).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
  
  next(error);
}; 