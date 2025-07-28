import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import User from "../models/User.js";
import { validatePassword, sanitizeInput } from "../utils/validation.js";

dotenv.config({ path: "../.env" });

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

export const registerUser = async ({ username, password, isGuest, preferences, description }) => {
  let sanitizedUsername = sanitizeInput(username);
  let rawPassword = password;

  if (!isGuest) {
    if (!sanitizedUsername || !rawPassword) {
      const err = new Error("Username and password are required.");
      err.status = 400;
      throw err;
    }

    if (!validatePassword(rawPassword)) {
      const err = new Error("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number.");
      err.status = 422;
      throw err;
    }
  } else {
    sanitizedUsername = `guest_${uuidv4().slice(0, 8)}`;
    rawPassword = `guest_${uuidv4().slice(0, 8)}`;
  }

  const existingUser = await User.findOne({ username: sanitizedUsername });
  if (existingUser) {
    const err = new Error("Username already exists.");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const newUser = new User({
    username: sanitizedUsername,
    password: hashedPassword,
    preferences: preferences || [],
    description: description || "",
    friends: [],
    following: [],
    followers: [],
    postedContent: [],
    chats: [],
    likedIdeas: [],
    dislikedIdeas: [],
  });

  return await newUser.save();
};

export const loginUser = async ({ username, password }) => {
  if (!username || !password) {
    const err = new Error("Username and password are required.");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ username });
  if (!user) {
    const err = new Error("Invalid credentials.");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials.");
    err.status = 401;
    throw err;
  }

  return user;
};

export const getUserFromToken = async (token) => {
  if (!token) {
    const err = new Error("Not authenticated.");
    err.status = 401;
    throw err;
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findOne({ username: decoded.username });

  if (!user) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }

  return user;
};
