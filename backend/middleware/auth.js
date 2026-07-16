const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes – verifies Bearer JWT in Authorization header.
 * Attaches req.user on success.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorised – no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password) to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Token expired – please log in again' : 'Invalid token';
    return res.status(401).json({ success: false, message });
  }
};

/**
 * Admin-only guard – must be used AFTER protect.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { protect, adminOnly };
