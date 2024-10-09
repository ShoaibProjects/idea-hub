
import Comment from '../models/Comment.js';
import Idea from '../models/Idea.js';

export const addComment = async (req, res) => {
    const { ideaId, creator, description } = req.body;  // Destructure title and description
  
    // Create a new Text document with title and description
    const newComment = new Comment({ ideaId, creator, description });
      const newerComment = await newComment.save();  // Save to the database
      res.status(201).json(newerComment);  // Success response
    try {
        const idea = await Idea.findOneAndUpdate(
            { _id: ideaId }, // Find the user by their username
            { $addToSet: { comments: newerComment._id } }, // Add the ideaId to the likedIdeas array, if it doesn't already exist
            { new: true } // Return the updated user document
          );
          if (!idea) {
            return res.status(404).json({ message: 'Cannot find idea' });
          }
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }

  export const updateComment = async (req, res) => {
    const dislikes = req.body.dislikes;
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return res.status(404).json('Idea not found');
      
      idea.downvotes = dislikes;
      await idea.save();
      res.json(idea.downvotes);
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }

  export const getComments = async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id).populate('comments'); // Populate the comments
      if (!idea) return res.status(404).json('Idea not found');
      res.json(idea.comments); // Return the populated comments
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  };
  

  export const deleteComment = async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return res.status(404).json('Idea not found');
      res.json(idea.downvotes);
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }