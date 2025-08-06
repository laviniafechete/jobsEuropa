import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  const fullPath = path.join(process.cwd(), '..', dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
};

// Create directories
ensureDirectoryExists('public');
ensureDirectoryExists('public/companyLogos');
ensureDirectoryExists('public/cvImages');
ensureDirectoryExists('public/favicons');

// Company logo storage
const companyLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), '..', 'public', 'companyLogos'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// CV image storage
const cvImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), '..', 'public', 'cvImages');
    console.log('CV Image upload path:', uploadPath);
    console.log('Current working directory:', process.cwd());
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    console.log('CV Image filename:', uniqueName);
    cb(null, uniqueName);
  }
});

// Image filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Doar fișiere imagine sunt permise (JPEG, PNG, GIF, WebP)'), false);
  }

  if (file.size > maxSize) {
    return cb(new Error('Fișierul este prea mare. Dimensiunea maximă este 5MB'), false);
  }

  cb(null, true);
};

// Multer instances
export const uploadCompanyLogo = multer({
  storage: companyLogoStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadCvImage = multer({
  storage: cvImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Error handling middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fișierul este prea mare. Dimensiunea maximă este 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Eroare la upload: ' + err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
}; 