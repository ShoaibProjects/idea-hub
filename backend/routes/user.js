// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import User from '../models/User.js';
import { addPostedIdea, deleteUserByUsername, dislikeIdea, following, getAll, getUser, isDisliked, isLiked, likeIdea, removePostedIdeas, undislikeIdea, unfollow, unlikeIdea} from "../controllers/users.js"
import { logout, signin, signupform } from '../controllers/auth.js';
import { verifyToken } from '../middleware/authMiddleware.js';

  
  // GET: Get all users
  // router.get('/', getAll);
  
  // GET: Get a single user by ID
  router.get('/:username', getUser, (req, res) => {
    res.json(res.user);
  });
  
  // POST: Create a new user
  router.post('/signup', signupform);

  router.post('/signin', signin);
  
  // PATCH: Update a user by ID
  // router.patch('/update/:id', getUser, async (req, res) => {
  //   if (req.body.username != null) {
  //     res.user.username = req.body.username;
  //   }
  //   if (req.body.password != null) {
  //     res.user.password = await bcrypt.hash(req.body.password, 10);
  //   }
  //   if (req.body.interactions != null) {
  //     res.user.interactions = req.body.interactions;
  //   }
  //   if (req.body.preferences != null) {
  //     res.user.preferences = req.body.preferences;
  //   }
  //   if (req.body.friends != null) {
  //     res.user.friends = req.body.friends;
  //   }
  //   if (req.body.following != null) {
  //     res.user.following = req.body.following;
  //   }
  //   if (req.body.followers != null) {
  //     res.user.followers = req.body.followers;
  //   }
  //   if (req.body.postedContent != null) {
  //     res.user.postedContent = req.body.postedContent;
  //   }
  
  //   try {
  //     const updatedUser = await res.user.save();
  //     res.json(updatedUser);
  //   } catch (err) {
  //     res.status(400).json({ message: err.message });
  //   }
  // });

  router.put('/:username/add-posted-idea', verifyToken, addPostedIdea);

  router.put('/:username/remove-posted-idea', verifyToken, removePostedIdeas);

  
  // DELETE: Delete a user by ID
  router.delete('/delete/:username', verifyToken, deleteUserByUsername);

  // router.put('/:username/isLiked', verifyToken, isLiked);
  router.put('/:username/liked/add', verifyToken, likeIdea)
  router.put('/:username/liked/remove', verifyToken, unlikeIdea)

  // router.put('/:username/isDisliked', verifyToken, isDisliked);
  router.put('/:username/disliked/add', verifyToken, dislikeIdea)
  router.put('/:username/disliked/remove', verifyToken, undislikeIdea)

  router.post('/follow/add', verifyToken, following);
  router.post('/follow/remove', verifyToken, unfollow);

  router.post('/logout',logout);
  

export default router;
