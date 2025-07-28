import { Router } from 'express';
const router = Router();
import {
    // getAll,
    getUser,
    // isLiked,
    likeIdea,
    unlikeIdea,
    // isDisliked,
    dislikeIdea,
    undislikeIdea,
    follow,
    unfollow,
    addPostedIdea,
    removePostedIdea,
    updateDesc,
    updatePref,
    updatePassword,
    deleteUserByUsername
} from '../controllers/users.js';
import { getCurrentUser, logout, signin, signupform } from '../controllers/auth.js';
import { verifyToken } from '../middleware/authMiddleware.js';

// router.get('/', getAll);

router.get('/:username', getUser);

router.get('/getUser/current', verifyToken, getCurrentUser);

router.post('/signup', signupform);

router.post('/signin', signin);

router.post('/logout', verifyToken, logout);

router.put('/:username/add-posted-idea', verifyToken, addPostedIdea);

router.put('/:username/remove-posted-idea', verifyToken, removePostedIdea);

router.patch('/:username/update/description', verifyToken, updateDesc);

router.patch('/:username/update/preferences', verifyToken, updatePref);

router.patch('/:username/update/password', verifyToken, updatePassword);

router.delete('/delete', verifyToken, deleteUserByUsername);

// router.put('/:username/isLiked', verifyToken, isLiked);

router.put('/:username/liked/add', verifyToken, likeIdea);

router.put('/:username/liked/remove', verifyToken, unlikeIdea);

// router.put('/:username/isDisliked', verifyToken, isDisliked);

router.put('/:username/disliked/add', verifyToken, dislikeIdea);

router.put('/:username/disliked/remove', verifyToken, undislikeIdea);

router.post('/follow/add', verifyToken, follow);

router.post('/follow/remove', verifyToken, unfollow);

export default router;
