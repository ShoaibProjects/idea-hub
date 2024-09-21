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
  }
}, {
  timestamps: true
});

// Create and export the model
const Idea = mongoose.model('Idea', IdeaSchema);
export default Idea;
