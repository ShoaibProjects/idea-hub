import Idea from "../models/Idea.js";
import { validateIdea } from "../utils/validateIdea.js";

export const createIdea = async (data) => {
  const { title, description, creator } = data;
  const validationError = validateIdea(title, description, creator);
  if (validationError) {
    const err = new Error(validationError);
    err.status = 400;
    throw err;
  }

  const newIdea = new Idea(data);
  return await newIdea.save();
};

export const getIdeaById = async (id) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Cannot find idea");
    err.status = 404;
    throw err;
  }
  return idea;
};

export const getAllIdeas = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const ideas = await Idea.find().skip(skip).limit(limit);
  const total = await Idea.countDocuments();
  return {
    ideas,
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const updateIdeaById = async (id, updateData, username) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Idea not found");
    err.status = 404;
    throw err;
  }

  if (idea.creator.toString() !== username) {
    const err = new Error("You are not authorized to update this idea");
    err.status = 403;
    throw err;
  }

  return await Idea.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteIdeaById = async (id, username) => {
  const idea = await Idea.findById(id);
  if (!idea) {
    const err = new Error("Idea not found");
    err.status = 404;
    throw err;
  }

  if (idea.creator.toString() !== username) {
    const err = new Error("You are not authorized to delete this idea");
    err.status = 403;
    throw err;
  }

  await Idea.findByIdAndDelete(id);
};
