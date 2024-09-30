
import Idea from '../models/Idea.js';

export const updateLikes = async (req, res) => {
    const likes = req.body.likes;
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return res.status(404).json('Idea not found');
      console.log(likes,'ln')
      idea.upvotes = likes;
      await idea.save();
      console.log(idea.upvotes)
      res.json(idea.upvotes);
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }

  export const updateDislikes = async (req, res) => {
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

  export const getLikes = async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return res.status(404).json('Idea not found');
      res.json(idea.upvotes);
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }

  export const getDisikes = async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return res.status(404).json('Idea not found');
      res.json(idea.downvotes);
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }