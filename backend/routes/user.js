// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { getAll} from "../controllers/users.js"
// Use Text.find(), Text.findById(), and Text.findByIdAndDelete() methods


  // To handle password hashing
  
  // GET: Get all users
  router.get('/', getAll);
  
  // GET: Get a single user by ID
  router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
  });
  
  // POST: Create a new user
  router.post('/signup', async (req, res) => {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        interactions: req.body.interactions || {},
        preferences: req.body.preferences || [],
        friends: [],
        following: [],
        followers: [],
        postedContent: []
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // PATCH: Update a user by ID
  router.patch('/update/:id', getUser, async (req, res) => {
    if (req.body.username != null) {
      res.user.username = req.body.username;
    }
    if (req.body.password != null) {
      res.user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.interactions != null) {
      res.user.interactions = req.body.interactions;
    }
    if (req.body.preferences != null) {
      res.user.preferences = req.body.preferences;
    }
    if (req.body.friends != null) {
      res.user.friends = req.body.friends;
    }
    if (req.body.following != null) {
      res.user.following = req.body.following;
    }
    if (req.body.followers != null) {
      res.user.followers = req.body.followers;
    }
    if (req.body.postedContent != null) {
      res.user.postedContent = req.body.postedContent;
    }
  
    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // DELETE: Delete a user by ID
  router.delete('/delete/:id', getUser, async (req, res) => {
    try {
      await res.user.remove();
      res.json({ message: 'Deleted user' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Middleware to get a user by ID
  async function getUser(req, res, next) {
    let user;
    try {
      user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.user = user;
    next();
  }
  
  





export default router;
