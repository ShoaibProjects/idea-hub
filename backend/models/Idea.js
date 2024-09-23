import mongoose from 'mongoose';

// Define the schema for the idea model
const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: String,
    trim: true
  },
  category: {
    type: [String],
    trim: true
  },
  tags: {
    type: [String],
    trim: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create and export the model
const Idea = mongoose.model('Idea', IdeaSchema);
export default Idea;
