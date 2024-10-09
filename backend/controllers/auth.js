import User from "../models/User.js";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // For generating random usernames

export const signupform = async (req, res) => {
    try {
      let username = req.body.username;
      let password = req.body.password;

      // Handle guest signup
      if (req.body.isGuest) {
        username = `guest_${uuidv4().slice(0, 8)}`; // Generate random guest username
        password = `guest_${uuidv4().slice(0, 8)}`; // Generate random password for guest
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username: username,
        password: hashedPassword,
        preferences: req.body.preferences || [], // Default preferences for guest if any
        friends: [],
        following: [],
        followers: [],
        postedContent: [],
        chats: [],
        likedIdeas: [],
        dislikedIdeas: []
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
}

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
  
      // // Create a token (optional: JWT for authentication)
      // const token = jwt.sign(
      //   { userId: user._id, username: user.username }, 
      //   process.env.JWT_SECRET, 
      //   { expiresIn: "1h" }  // Token expires in 1 hour (optional)
      // );
  
      // Send back the user details and token
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };