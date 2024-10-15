import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String},
    preferences: [String],
    friends: [{ type: String }], // Store usernames instead of ObjectId
    following: [{ type: String }], // Store usernames of followed users
    followers: [{ type: String }], // Store usernames of followers
    postedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    likedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }], // Ideas liked by user
    dislikedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }] // Links to chat sessions
  }, { timestamps: true });
  

  userSchema.index({ username: 'text' });
// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;
