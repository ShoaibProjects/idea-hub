// backend/routes/text.js
import { Router } from 'express';  // Correct import
const router = Router();
import Text from '../models/Text.js';

// Use Text.find(), Text.findById(), and Text.findByIdAndDelete() methods


// Create text
router.post('/add', async (req, res) => {
  const content = req.body.content;
  const newText = new Text({ content });

  try {
    await newText.save();
    res.status(201).json('Text added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get all text entries
router.get('/', async (req, res) => {
  try {
    const texts = await Text.find();
    res.json(texts);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update text by ID
router.put('/update/:id', async (req, res) => {
  try {
    const text = await Text.findById(req.params.id);
    text.content = req.body.content;
    await text.save();
    res.json('Text updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete text by ID
router.delete('/:id', async (req, res) => {
  try {
    await Text.findByIdAndDelete(req.params.id);
    res.json('Text deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

export default router;
