import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from the .env file in the parent directory
dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(440).json({ message: 'Session expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
