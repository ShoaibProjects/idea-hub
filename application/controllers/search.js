import { performSearch } from '../services/searchService.js';

export const getSearch = async (req, res) => {
  try {
    const { query, page, limit } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'A search query is required.' });
    }

    const results = await performSearch(query, parseInt(page), parseInt(limit));

    res.status(200).json(results);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'An error occurred during the search.' });
  }
};