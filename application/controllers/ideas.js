import Idea from "../models/Idea.js";

const validateIdea = (title, description, creator) => {
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return "Title must be a string and at least 5 characters long.";
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return "Description must be at least 10 characters long.";
  }
  if (!creator || typeof creator !== 'string' || creator.trim().length === 0) {
    return "Creator is required.";
  }
  return null;
};


export const getIdea = async (req, res, next) => {
    let idea;
    try {
      // Use findOne to search for a user by the username field
      idea = await Idea.findOne({ _id: req.params.id });
      if (idea == null) {
        return res.status(404).json({ message: 'Cannot find idea' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.json(idea)
    next();
  }

export const addIdea = async (req, res) => {
  const { title, description, creator, category, tags, upvotes, downvotes } = req.body;  // Destructure title and description

    // Validate fields
    const validationError = validateIdea(title, description, creator);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    
  // Create a new Text document with title and description
  const newIdea = new Idea({ title, description, creator, category, tags, upvotes, downvotes });

  try {
    const newerIdea = await newIdea.save();  // Save to the database
    res.status(201).json(newerIdea);  // Success response
  } catch (err) {
    res.status(400).json('Error: ' + err);  // Error response
  }
}

export const updateIdea = async (req, res) => {
  try {
    // Fetch the idea from the database by ID
    const idea = await Idea.findById(req.params.id);
    
    // Check if the idea exists
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the logged-in user is the creator of the idea
    if (idea.creator.toString() !== req.user.username) {  // assuming creator is stored as username
      return res.status(403).json({ message: "You are not authorized to update this idea" });
    }

    // Perform the update
    const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedIdea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteIdea = async (req, res) => {
  try {
    // Fetch the idea from the database by ID
    const idea = await Idea.findById(req.params.id);
    
    // Check if the idea exists
    if (!idea) {
      return res.status(404).json({ message: "oh no" });
    }

    // Check if the logged-in user is the creator of the idea
    if (idea.creator.toString() !== req.user.username) {  // assuming creator is stored as username
      return res.status(403).json({ message: "You are not authorized to delete this idea" });
    }

    // Perform the deletion
    await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: "Idea deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getMany = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 ideas per page
  const skip = (page - 1) * limit;

  try {
    const ideas = await Idea.find().skip(skip).limit(limit);
    const total = await Idea.countDocuments();  // Total number of ideas
    res.json({
      ideas,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
}