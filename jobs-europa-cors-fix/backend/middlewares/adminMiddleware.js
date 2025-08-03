import jwt from 'jsonwebtoken';
import config from '../config.js';
import Admin from '../models/Admin.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'Acces refuzat. Token lipsă.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    if (!decoded.adminId) {
      return res.status(401).json({ success: false, message: 'Token invalid pentru admin.' });
    }

    const admin = await Admin.findById(decoded.adminId).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin nu a fost găsit.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ success: false, message: 'Token invalid.' });
  }
};

export default adminAuth; 