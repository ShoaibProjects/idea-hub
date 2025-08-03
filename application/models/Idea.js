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
    default: '',
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
    default: 0,
    min: [0, 'Upvotes cannot be negative.']
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

IdeaSchema.index({ title: 'text', description: 'text' });

// Create and export the model
const Idea = mongoose.model('Idea', IdeaSchema);
export default Idea;
