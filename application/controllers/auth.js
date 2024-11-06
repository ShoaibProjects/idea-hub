import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';  // For generating random guest usernames
import dotenv from 'dotenv';

// Load environment variables from the .env file in the parent directory
dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';  // Use a secure key in production
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;  // 7 days in milliseconds
const COOKIE_MAX_AGE_30_MINUTES = 30 * 60 * 1000;  // 30 minutes in milliseconds


const validatePassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // at least one digit, one lowercase, one uppercase, min length 8
  return regex.test(password);
};

// Signup Controller
export const signupform = async (req, res) => {
  try {
    let username = req.body.username;
    let ReqPassword = req.body.password;

    if (!req.body.isGuest) {
      if (!username || !ReqPassword) {
        return res.status(400).json({ message: "Username and password are required." });
      }
      
      if (!validatePassword(ReqPassword)) {
        return res.status(422).json({ message: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number." });
      }
    }

    // Handle guest signup
    if (req.body.isGuest) {
      username = `guest_${uuidv4().slice(0, 8)}`;  // Generate random guest username
      ReqPassword = `guest_${uuidv4().slice(0, 8)}`;  // Generate random password for guest
    }
    const ISuser = await User.findOne({ username});
    if (ISuser) {
      return res.status(409).json({ message: "Username taken" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(ReqPassword, 10);

    const user = new User({
      username: username,
      password: hashedPassword,
      preferences: req.body.preferences || [],  // Default preferences for guest if any
      description: req.body.description || '',
      friends: [],
      following: [],
      followers: [],
      postedContent: [],
      chats: [],
      likedIdeas: [],
      dislikedIdeas: []
    });

    const newUser = await user.save();

    // Create a JWT token
    const token = jwt.sign({ username: newUser.username }, JWT_SECRET, { expiresIn: req.body.rememberMe ? '7d' : '30m' });

    // Store the token in a secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Secure cookie in production (HTTPS)
      maxAge: req.body.rememberMe ? COOKIE_MAX_AGE : COOKIE_MAX_AGE_30_MINUTES,
      sameSite: 'Strict'  // Prevent CSRF attacks
    });

    // Set the "Remember Me" cookie if the option is checked
    if (req.body.rememberMe) {
      res.cookie('rememberMe', 'true', {
        httpOnly: false, // Can be accessed from the frontend
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE, // 7 days expiration for the rememberMe cookie
        sameSite: 'Strict'
      });
    }

    const {password, ...others} = newUser._doc;

    res.status(201).json(others);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Signin Controller
export const signin = async (req, res) => {
  try {

    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    const user = await User.findOne({ username: req.body.username });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    // If the password doesn't match
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: req.body.rememberMe ? '7d' : '30m'  // 7 days for remember me, 30 minutes otherwise
    });

    // Set the JWT cookie expiration based on "Remember Me" checkbox
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: req.body.rememberMe ? COOKIE_MAX_AGE : COOKIE_MAX_AGE_30_MINUTES,
      sameSite: 'Lax',
      domain: 'https://idea-hub-app.vercel.app'
    });

    // Set the "Remember Me" cookie if the option is checked
    if (req.body.rememberMe) {
      res.cookie('rememberMe', 'true', {
        httpOnly: false, // Can be accessed from the frontend
        secure: true,
        maxAge: COOKIE_MAX_AGE, // 7 days expiration for the rememberMe cookie
        sameSite: 'Lax',
        domain: 'https://idea-hub-app.vercel.app'
      });
    }
    
    const {password, ...others} = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout Controller (to clear the cookie)
export const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('rememberMe');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Middleware to get the user info from the token
export const getCurrentUser = async (req, res) => {
  console.log('ok')
  try {
    const token = req.cookies.token;

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);


    // Find the user based on the decoded username
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {password, ...others} = user._doc;
    // Send back the user details
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
