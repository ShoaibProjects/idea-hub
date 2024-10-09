import mongoose from 'mongoose';

// Define the schema for the idea model
const CommentSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  creator: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true
});

// Create and export the model
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
