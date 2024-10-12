// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import Idea from '../models/Idea.js';
import { recomm } from '../controllers/recommendations.js';
import { getTrendingIdeas } from '../controllers/trending.js';
import { getDislikes, getLikes, updateDislikes, updateLikes } from '../controllers/likeDislike.js';
import { addIdea, deleteIdea, getIdea, getMany, updateIdea } from '../controllers/ideas.js';
import { addComment, getComments } from '../controllers/comments.js';
import { getSearch } from '../controllers/search.js';
import { verifyToken } from '../middleware/authMiddleware.js';



router.post('/add', verifyToken, addIdea);

// router.get('/', getMany);

router.put('/update/:id', verifyToken, updateIdea);

router.delete('/delete/:id', verifyToken, deleteIdea);

router.get('/recommendations/:userId', verifyToken, recomm);

router.get('/trending', getTrendingIdeas);

router.put('/update/:id/likes/update', verifyToken, updateLikes);

router.put('/update/:id/dislikes/update', verifyToken, updateDislikes);

router.get('/:id', getIdea);

// router.get('/:id/likes', getLikes)

// router.get('/:id/dislikes', getDislikes)

router.post('/comment/add', verifyToken, addComment)

router.get('/:id/comments', getComments)

router.get('/explore/search', getSearch)

export default router;
