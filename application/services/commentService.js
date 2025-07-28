import Comment from "../models/Comment.js";
import Idea from "../models/Idea.js";

export const createCommentService = async ({ ideaId, creator, description }) => {
  const newComment = new Comment({ ideaId, creator, description });
  const savedComment = await newComment.save();

  const idea = await Idea.findByIdAndUpdate(
    ideaId,
    { $addToSet: { comments: savedComment._id } },
    { new: true }
  );

  if (!idea) throw new Error("Idea not found");

  return savedComment;
};

export const updateCommentService = async ({ commentId, creator, description }, user) => {
  if (user.username !== creator) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  comment.description = description;
  comment.isEdited = true;
  return await comment.save();
};

export const getCommentsService = async (ideaId) => {
  const idea = await Idea.findById(ideaId).populate("comments");
  if (!idea) throw new Error("Idea not found");

  return idea.comments;
};

export const deleteCommentService = async ({ commentId, creator, ideaId }, user) => {
  if (user.username !== creator) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  const updatedIdea = await Idea.findByIdAndUpdate(
    ideaId,
    { $pull: { comments: commentId } },
    { new: true }
  );

  if (!updatedIdea) throw new Error("Idea not found");

  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) throw new Error("Comment not found");
};
