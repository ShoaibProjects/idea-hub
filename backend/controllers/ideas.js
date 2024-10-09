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
  
    res.json(idea)
    next();
  }

export const upadateIdea =  async (req, res) => {
  try {
    const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedIdea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export const deleteIdea = async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.json('Idea deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
}