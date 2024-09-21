// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import User from '../models/User.js';
const bcrypt = require('bcrypt');
// Use Text.find(), Text.findById(), and Text.findByIdAndDelete() methods


// Create text
router.post('/add', async (req, res) => {
    const { title, description } = req.body;  // Destructure title and description
  
    // Create a new Text document with title and description
    const newIdea = new Idea({ title, description });
  
    try {
      await newIdea.save();  // Save to the database
      res.status(201).json(newIdea);  // Success response
    } catch (err) {
      res.status(400).json('Error: ' + err);  // Error response
    }
  });




  // To handle password hashing
  
  // GET: Get all users
  router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // GET: Get a single user by ID
  router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
  });
  
  // POST: Create a new user
  router.post('/', async (req, res) => {
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
  router.patch('/:id', getUser, async (req, res) => {
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
  router.delete('/:id', getUser, async (req, res) => {
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
  
  module.exports = router;
  




// Get all text entries
// Get all ideas
// backend/routes/idea.js
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 ideas per page
  const skip = (page - 1) * limit;

  try {
    const ideas = await Idea.find().skip(skip).limit(limit);
    const total = await Idea.countDocuments();  // Total number of ideas
    res.json({
      ideas,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


// Update an idea by ID
router.put('/update/:id', async (req, res) => {
  const { title, description } = req.body;
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json('Idea not found');
    
    idea.title = title;
    idea.description = description;
    await idea.save();
    res.json('Idea updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete an idea by ID
router.delete('/:id', async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.json('Idea deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


export default router;
