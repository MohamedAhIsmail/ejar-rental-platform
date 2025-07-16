// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Missing or invalid token. Please log in again.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    // user info => { id, isLoggedIn, role }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  }
};

export default authMiddleware;
