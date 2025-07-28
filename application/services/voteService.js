import Idea from "../models/Idea.js";

export const updateUpvotes = async (id, upvotes) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Idea not found");
    err.status = 404;
    throw err;
  }
  idea.upvotes = upvotes;
  await idea.save();
  return idea.upvotes;
};

export const updateDownvotes = async (id, downvotes) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Idea not found");
    err.status = 404;
    throw err;
  }
  idea.downvotes = downvotes;
  await idea.save();
  return idea.downvotes;
};

export const getUpvotes = async (id) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Idea not found");
    err.status = 404;
    throw err;
  }
  return idea.upvotes;
};

export const getDownvotes = async (id) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Idea not found");
    err.status = 404;
    throw err;
  }
  return idea.downvotes;
};
