import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import Comment from '../models/Comment.js';
import { validatePassword } from '../utils/validation.js';

export const getAllUsers = () => User.find().select('-password');

export const getUserByUsername = async (username) => {
  const user = await User.findOne({ username }).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

export const getInteractionStatus = async (username, ideaId, listField) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');
  return { status: user[listField].includes(ideaId) };
};

export const toggleIdeaInteraction = async (username, ideaId, listField, operation) => {
  const updateQuery = operation === 'add' 
    ? { $addToSet: { [listField]: ideaId } } 
    : { $pull: { [listField]: ideaId } };

  const user = await User.findOneAndUpdate({ username }, updateQuery, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

export const toggleFollow = async (currentUsername, targetUsername, operation) => {
  if (currentUsername === targetUsername) throw new Error('You cannot follow yourself.');
  
  const updateQuery = operation === 'add' ? '$addToSet' : '$pull';

  const currentUser = await User.findOneAndUpdate(
    { username: currentUsername },
    { [updateQuery]: { following: targetUsername } },
    { new: true }
  );
  if (!currentUser) throw new Error('Current user not found');

  await User.updateOne(
    { username: targetUsername },
    { [updateQuery]: { followers: currentUsername } }
  );

  return currentUser;
};

export const togglePostedIdea = async (username, ideaId, operation) => {
    const updateQuery = operation === 'add' 
      ? { $push: { postedContent: ideaId } } 
      : { $pull: { postedContent: ideaId } };
      
    const user = await User.findOneAndUpdate({ username }, updateQuery, { new: true });
    if (!user) throw new Error('User not found');
    return user;
};

export const updateUserDescription = async (username, description) => {
  const user = await User.findOneAndUpdate(
    { username },
    { description: description },
    { new: true }
  );
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserPreferences = async (username, preferences) => {
    const user = await User.findOneAndUpdate(
        { username },
        { preferences: preferences },
        { new: true }
    );
    if (!user) throw new Error('User not found');
    return user;
};

export const updateUserPassword = async (username, oldPassword, newPassword) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password');

  if (!validatePassword(newPassword)) {
    throw new Error('New password does not meet complexity requirements.');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: 'Password updated successfully' };
};

export const deleteUserAndCleanup = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  const deletedIdeaIds = (await Idea.find({ creator: user.username })).map(idea => idea._id);
  
  await Idea.deleteMany({ creator: user.username });
  await Comment.deleteMany({ creator: user.username });
  
  if (user.likedIdeas.length > 0) {
      await Idea.updateMany({ _id: { $in: user.likedIdeas } }, { $inc: { upvotes: -1 } });
  }
  if (user.dislikedIdeas.length > 0) {
      await Idea.updateMany({ _id: { $in: user.dislikedIdeas } }, { $inc: { downvotes: -1 } });
  }
  
  await User.updateMany({}, { $pull: { followers: user.username, following: user.username } });

  if (deletedIdeaIds.length > 0) {
      await User.updateMany({}, { $pull: { likedIdeas: { $in: deletedIdeaIds }, dislikedIdeas: { $in: deletedIdeaIds } } });
  }

  await User.deleteOne({ username });
  return { message: 'User and all associated data deleted successfully' };
};