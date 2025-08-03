import { Router } from "express";
const router = Router();
import { recomm } from "../controllers/recommendations.js";
import { getTrendingIdeas } from "../controllers/trending.js";
import {
  // getDislikes, getLikes,
  updateDislikes,
  updateLikes,
} from "../controllers/likeDislike.js";
import {
  addIdea,
  deleteIdea,
  getIdea,
  // getMany,
  updateIdea,
} from "../controllers/ideas.js";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comments.js";
import { getSearch } from "../controllers/search.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.post("/add", verifyToken, addIdea);

// router.get('/', getMany);

router.put("/update/:id", verifyToken, updateIdea);

router.delete("/delete/:id", verifyToken, deleteIdea);

router.get("/recommendations/:username", verifyToken, recomm);

router.get("/trending/ideas", getTrendingIdeas);

router.put("/update/:id/likes/update", verifyToken, updateLikes);

router.put("/update/:id/dislikes/update", verifyToken, updateDislikes);

router.get("/:id", getIdea);

// router.get('/:id/likes', getLikes)

// router.get('/:id/dislikes', getDislikes)

router.post("/comment/add", verifyToken, addComment);

router.get("/:id/comments", getComments);

router.patch("/comment/update", verifyToken, updateComment);

router.delete("/comment/delete", verifyToken, deleteComment);

router.get("/explore/search", getSearch);

export default router;
