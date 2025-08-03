import {
  createCommentService,
  updateCommentService,
  getCommentsService,
  deleteCommentService,
} from "../services/commentService.js";

export const addComment = async (req, res) => {
  try {
    const comment = await createCommentService(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await updateCommentService(req.body, req.user);
    res.json(comment);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await getCommentsService(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await deleteCommentService(req.body, req.user);
    res.status(200).json({ message: "Comment deleted and removed from the idea" });
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};
