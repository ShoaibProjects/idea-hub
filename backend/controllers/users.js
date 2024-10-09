import mongoose from "mongoose";
import User from '../models/User.js';

export const getAll = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

export const getUser = async (req, res, next) => {
  let user;
  try {
    // Use findOne to search for a user by the username field
    user = await User.findOne({ username: req.params.username });
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

export const isLiked = async (req, res) => {
  try {
    // Use findOne to search for a user by the username field
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    
    // Check if the idea is liked by the user
    const isLiked = user.likedIdeas.includes(req.body.ideaId);
    return res.json({ isLiked });
    
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const likeIdea = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOneAndUpdate(
      { username: req.params.username }, // Find the user by their username
      { $addToSet: { likedIdeas: req.body.ideaId } }, // Add the ideaId to the likedIdeas array, if it doesn't already exist
      { new: true } // Return the updated user document
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    return res.status(200).json({ message: 'Idea liked successfully', likedIdeas: user.likedIdeas });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const unlikeIdea = async (req, res) => {
  try {

    // Find the user by username and remove the ideaId from the likedIdeas array
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { likedIdeas: req.body.ideaId } }, // Remove ideaId from likedIdeas array
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    return res.status(200).json({ message: 'Idea unliked successfully', likedIdeas: user.likedIdeas });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const isDisiked = async (req, res) => {
  try {
    // Use findOne to search for a user by the username field
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    
    // Check if the idea is liked by the user
    const isDisliked = user.dislikedIdeas.includes(req.body.ideaId);
    return res.json({ isDisliked });
    
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const dislikeIdea = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOneAndUpdate(
      { username: req.params.username }, // Find the user by their username
      { $addToSet: { dislikedIdeas: req.body.ideaId } }, // Add the ideaId to the likedIdeas array, if it doesn't already exist
      { new: true } // Return the updated user document
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    return res.status(200).json({ message: 'Idea disliked successfully', likedIdeas: user.likedIdeas });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const undislikeIdea = async (req, res) => {
  try {

    // Find the user by username and remove the ideaId from the likedIdeas array
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { dislikedIdeas: req.body.ideaId } }, // Remove ideaId from likedIdeas array
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    return res.status(200).json({ message: 'Idea undisliked successfully', likedIdeas: user.likedIdeas });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const following = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOneAndUpdate(
      { username: req.body.currentUser }, // Find the user by their username
      { $addToSet: { following: req.body.followedUser } }, // Add the ideaId to the likedIdeas array, if it doesn't already exist
      { new: true } // Return the updated user document
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    const FollowedUser = await User.findOneAndUpdate(
      { username: req.body.followedUser }, // Find the user by their username
      { $addToSet: { followers: req.body.currentUser } }, // Add the ideaId to the likedIdeas array, if it doesn't already exist
      { new: true } // Return the updated user document
    );
    
    if (!FollowedUser) {
      return res.status(404).json({ message: 'Cannot find followed user' });
    }

    return res.status(200).json({ message: 'following added successfully', following: user.following });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const unfollow = async (req, res) => {
  try {

    // Find the user by username and remove the ideaId from the likedIdeas array
    const user = await User.findOneAndUpdate(
      { username: req.body.currentUser },
      { $pull: { following: req.body.followedUser } }, // Remove ideaId from likedIdeas array
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    const FollowedUser = await User.findOneAndUpdate(
      { username: req.body.followedUser },
      { $pull: { followers: req.body.currentUser } }, // Remove ideaId from likedIdeas array
      { new: true }
    );

    if (!FollowedUser) {
      return res.status(404).json({ message: 'Cannot find followed user' });
    }

    return res.status(200).json({ message: 'unfollowed successfully', following: user.following });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
