import {
  updateUpvotes,
  updateDownvotes,
  getUpvotes,
  getDownvotes,
} from "../services/voteService.js";

export const updateLikes = async (req, res) => {
  try {
    const count = await updateUpvotes(req.params.id, req.body.likes);
    res.json(count);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};

export const updateDislikes = async (req, res) => {
  try {
    const count = await updateDownvotes(req.params.id, req.body.dislikes);
    res.json(count);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};

export const getLikes = async (req, res) => {
  try {
    const count = await getUpvotes(req.params.id);
    res.json(count);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};

export const getDislikes = async (req, res) => {
  try {
    const count = await getDownvotes(req.params.id);
    res.json(count);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};
