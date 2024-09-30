import Idea from "../models/Idea.js";

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
  
    res.json(idea._id)
    next();
  }