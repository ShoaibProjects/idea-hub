// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { dislikeIdea, following, getAll, getUser, isDisiked, isLiked, likeIdea, undislikeIdea, unfollow, unlikeIdea} from "../controllers/users.js"
import { signin, signupform } from '../controllers/auth.js';
// Use Text.find(), Text.findById(), and Text.findByIdAndDelete() methods


  // To handle password hashing
  
  // GET: Get all users
  router.get('/', getAll);
  
  // GET: Get a single user by ID
  router.get('/:username', getUser, (req, res) => {
    res.json(res.user);
  });
  
  // POST: Create a new user
  router.post('/signup', signupform);

  router.post('/signin', signin);
  
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

  router.put('/:username/add-posted-idea', async (req, res) => {
    const { username } = req.params;
    const { ideaId } = req.body;

    try {
        await User.updateOne(
            { username },
            { $push: { postedContent: ideaId } }
        );
        res.status(200).send({ message: 'Posted content updated' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.put('/:username/remove-posted-idea', async (req, res) => {
  const { username } = req.params;
  const { ideaId } = req.body;

  try {
      await User.updateOne(
          { username },
          { $pull: { postedContent: ideaId } }
      );
      res.status(200).send({ message: 'Posted content updated' });
  } catch (err) {
      res.status(500).send({ message: err.message });
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

  router.put('/:username/isLiked',isLiked);
  router.put('/:username/liked/add',likeIdea)
  router.put('/:username/liked/remove',unlikeIdea)

  router.put('/:username/isDisliked',isDisiked);
  router.put('/:username/disliked/add',dislikeIdea)
  router.put('/:username/disliked/remove',undislikeIdea)

  router.post('/follow/add',following);
  router.post('/follow/remove',unfollow);
  
  // Middleware to get a user by ID

  





export default router;
