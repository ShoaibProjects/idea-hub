import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Idea from "../models/Idea.js";
import Comment from "../models/Comment.js";

const validatePassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // at least one digit, one lowercase, one uppercase, min length 8
  return regex.test(password);
};

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

export const isDisliked = async (req, res) => {
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

export const deleteUserByUsername = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // *** Step 1: Delete user's ideas ***
    const deletedIdeas = await Idea.find({ creator: user.username }); // Fetch the ideas to be deleted
    const deletedIdeaIds = deletedIdeas.map((idea) => idea._id); // Get the idea IDs to remove from other users
    await Idea.deleteMany({ creator: user.username }); // Delete the user's ideas

    // *** Step 2: Delete user's comments ***
    await Comment.deleteMany({ creator: user.username }); // Delete the user's comments

    // *** Step 3: Decrease likes and dislikes on associated ideas ***
    if (user.likedIdeas.length > 0) {
      await Idea.updateMany(
        { _id: { $in: user.likedIdeas } },
        { $inc: { upvotes: -1 } } // Decrease the upvotes count on liked ideas
      );
    }

    if (user.dislikedIdeas.length > 0) {
      await Idea.updateMany(
        { _id: { $in: user.dislikedIdeas } },
        { $inc: { downvotes: -1 } } // Decrease the downvotes count on disliked ideas
      );
    }

    // *** Step 4: Remove user from followers/following lists ***
    await User.updateMany(
      { $or: [{ followers: user.username }, { following: user.username }] },
      { $pull: { followers: user.username, following: user.username } } // Remove the user from followers/following arrays
    );

    // *** Step 5: Remove deleted ideas from other users' likedIdeas and dislikedIdeas ***
    if (deletedIdeaIds.length > 0) {
      await User.updateMany(
        { $or: [{ likedIdeas: { $in: deletedIdeaIds } }, { dislikedIdeas: { $in: deletedIdeaIds } }] },
        { $pull: { likedIdeas: { $in: deletedIdeaIds }, dislikedIdeas: { $in: deletedIdeaIds } } }
      );
    }

    // Finally, remove the user
    await User.deleteOne({ username });

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addPostedIdea = async (req, res) => {
  const { username } = req.params;
  const { ideaId } = req.body;

  try {
      await User.updateOne(
          { username },
          { $push: { postedContent: ideaId } }
      );
      res.status(200).send({ message: 'Posted content updated' });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
}

export const removePostedIdeas = async (req, res) => {
  const { username } = req.params;
  const { ideaId } = req.body;

  try {
      await User.updateOne(
          { username },
          { $pull: { postedContent: ideaId } }
      );
      res.status(200).send({ message: 'Posted content updated' });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
}

export const updateDesc = async (req, res) => {
  let user;
  try {
    if(req.user.username!=req.body.username){
      return res.status(403).json({ message: 'not authorized' });
    }
    user = await User.findOne({ username: req.body.username });
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    if (req.body.description != null) {
          user.description = req.body.description;
          await user.save();
          res.status(200).json({ message: 'success'});
        }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const updatePassword = async (req, res) => {
  const { username, password, newPassword } = req.body;

  try {
    // Check if the authenticated user is the same as the one being updated
    if (req.user.username !== username) {
      return res.status(403).json({ message: 'Not authorized to update password for this user' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the current password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Check if the new password is provided
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // Validate new password (length, complexity, etc.)
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Return success response
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    // Return server error response
    res.status(500).json({ message: err.message });
  }
};

export const updatePref = async (req, res) => {
  let user;
  try {
    if(req.user.username!=req.body.username){
      return res.status(403).json({ message: 'not authorized' });
    }
    user = await User.findOne({ username: req.body.username });
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    if (req.body.preferences != null) {
          user.preferences = req.body.preferences;
          await user.save();
          res.status(200).json({ message: 'success'});
        }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
