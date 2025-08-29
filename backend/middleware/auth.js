import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // Extract the Authorization header
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('Protect middleware: No Authorization header provided');
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  let token;
  // Check if it starts with 'Bearer '
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  // Ensure token is present
  if (!token) {
    console.log('Protect middleware: Invalid token format');
    return res.status(401).json({ success: false, message: 'Invalid token format' });
  }

  try {
    // Verify the token
    console.log('Protect middleware: Verifying token:', token); // Debug: remove in production
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Protect middleware: Decoded token:', decoded); // Debug: remove in production

    // Fetch user from database, excluding password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('Protect middleware: User not found for ID:', decoded.id);
      return res.status(404).json({ success: false, message: 'User not found for provided token' });
    }

    // Attach user to request object
    req.user = user;
    console.log('Protect middleware: User set:', user.email); // Debug: remove in production
    next();
  } catch (error) {
    console.error('Protect middleware error:', error.message, error.stack);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};