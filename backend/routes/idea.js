// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import Idea from '../models/Idea.js';
import { recomm } from '../controllers/recommendations.js';
import { getTrendingIdeas } from '../controllers/trending.js';
import { getDisikes, getLikes, updateDislikes, updateLikes } from '../controllers/likeDislike.js';
import { deleteIdea, getIdea, upadateIdea } from '../controllers/ideas.js';
import { addComment, getComments } from '../controllers/comments.js';
import { getSearch } from '../controllers/search.js';

// Use Text.find(), Text.findById(), and Text.findByIdAndDelete() methods


// Create text
router.post('/add', async (req, res) => {
    const { title, description, creator, category, tags, upvotes, downvotes } = req.body;  // Destructure title and description
  
    // Create a new Text document with title and description
    const newIdea = new Idea({ title, description, creator, category, tags, upvotes, downvotes });
  
    try {
      const newerIdea = await newIdea.save();  // Save to the database
      res.status(201).json(newerIdea);  // Success response
    } catch (err) {
      res.status(400).json('Error: ' + err);  // Error response
    }
  });

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
// router.put('/update/:id', async (req, res) => {
//   const { title, description } = req.body;
//   try {
//     const idea = await Idea.findById(req.params.id);
//     if (!idea) return res.status(404).json('Idea not found');
    
//     idea.title = title;
//     idea.description = description;
//     await idea.save();
//     res.json('Idea updated!');
//   } catch (err) {
//     res.status(400).json('Error: ' + err);
//   }
// });

router.put('/update/:id', upadateIdea);


// Delete an idea by ID
router.delete('/delete/:id', deleteIdea);

router.get('/recommendations/:userId', recomm);

router.get('/trending', getTrendingIdeas);

router.put('/update/:id/likes/update', updateLikes);

router.put('/update/:id/dislikes/update', updateDislikes);

router.get('/:id', getIdea);

router.get('/:id/likes', getLikes)

router.get('/:id/dislikes', getDisikes)

router.post('/comment/add',addComment)

router.get('/:id/comments', getComments)

router.get('/explore/search', getSearch)

export default router;
