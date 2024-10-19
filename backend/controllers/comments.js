
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
    const { commentId, creator, description } = req.body;
    try {
      if(req.user.username!=creator){
        return res.status(403).json({ message: 'not authorized' });
      }
      
      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json('Comment not found');
      
      comment.description = description;
      comment.isEdited = true;
      await comment.save();
      res.json(comment);
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
    const { commentId, creator, ideaId } = req.query; // Assuming you pass the ideaId in the query
    try {
      // Check if the user is authorized to delete the comment
      if (req.user.username !== creator) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      // Use $pull to remove the comment reference from the idea's comments array
      const updatedIdea = await Idea.findByIdAndUpdate(
        ideaId,
        { $pull: { comments: commentId } }, // Remove the commentId from the comments array
        { new: true } // Return the updated document after modification
      );
      if (!updatedIdea) return res.status(404).json({ message: 'Idea not found' });
  
      // Now delete the actual comment
      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
  
      // Respond with success
      res.status(200).json({ message: 'Comment deleted and removed from the idea' });
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  };
  