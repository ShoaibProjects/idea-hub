import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';  // For generating random guest usernames

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';  // Use a secure key in production
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;  // 7 days in milliseconds

// Signup Controller
export const signupform = async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    // Handle guest signup
    if (req.body.isGuest) {
      username = `guest_${uuidv4().slice(0, 8)}`;  // Generate random guest username
      password = `guest_${uuidv4().slice(0, 8)}`;  // Generate random password for guest
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      password: hashedPassword,
      preferences: req.body.preferences || [],  // Default preferences for guest if any
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
    const token = jwt.sign({ username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

    // Store the token in a secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Secure cookie in production (HTTPS)
      maxAge: COOKIE_MAX_AGE,  // 7 days expiration
      sameSite: 'Strict'  // Prevent CSRF attacks
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Signin Controller
export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password with hashed password in the database
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    // If the password doesn't match
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    // Store the token in a secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Secure cookie in production
      maxAge: COOKIE_MAX_AGE,  // 7 days expiration
      sameSite: 'Strict'  // Prevent CSRF attacks
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout Controller (to clear the cookie)
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
