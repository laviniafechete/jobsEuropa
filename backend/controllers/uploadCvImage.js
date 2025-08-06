import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/errorHandler.js';
import fs from 'fs';
import path from 'path';

export const uploadCvImage = async (req, res) => {
  try {
    console.log('=== CV IMAGE UPLOAD DEBUG ===');
    console.log('User:', req.user);
    console.log('UserType:', req.userType);
    console.log('File:', req.file);

    if (!req.file) {
      return sendError(res, 'Nu a fost selectat niciun fișier', 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'Utilizatorul nu a fost găsit', 404);
    }

    // Delete old image if it exists
    if (user.cvImageUrl) {
      const oldImagePath = path.join(process.cwd(), 'public', user.cvImageUrl.replace('/public/', ''));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Deleted old CV image:', oldImagePath);
      }
    }

    // Save new image URL
    const imageUrl = `/public/cvImages/${req.file.filename}`;
    user.cvImageUrl = imageUrl;
    await user.save();

    console.log('Updated user CV image URL:', user.cvImageUrl);

    sendSuccess(res, { imageUrl }, 'Imagine CV încărcată cu succes');
  } catch (error) {
    console.error('Error uploading CV image:', error);
    sendError(res, 'Eroare la încărcarea imaginii CV', 500);
  }
};

export const deleteCvImage = async (req, res) => {
  try {
    console.log('=== CV IMAGE DELETE DEBUG ===');
    console.log('User:', req.user);

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'Utilizatorul nu a fost găsit', 404);
    }

    if (!user.cvImageUrl) {
      return sendError(res, 'Nu există o imagine CV de șters', 404);
    }

    // Delete file from server
    const imagePath = path.join(process.cwd(), 'public', user.cvImageUrl.replace('/public/', ''));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('Deleted CV image file:', imagePath);
    }

    // Remove URL from database
    user.cvImageUrl = undefined;
    await user.save();

    console.log('Removed CV image URL from user');

    sendSuccess(res, null, 'Imagine CV ștearsă cu succes');
  } catch (error) {
    console.error('Error deleting CV image:', error);
    sendError(res, 'Eroare la ștergerea imaginii CV', 500);
  }
}; 