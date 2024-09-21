import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interactions: Object,
    preferences: [String],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }] // Links to chat sessions
  }, { timestamps: true });
  

// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;
