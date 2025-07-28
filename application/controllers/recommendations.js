import { getRecommendations } from '../services/recommendationService.js';

export const recomm = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const finalIdeas = await getRecommendations(userId, page, limit);

    res.json(finalIdeas);
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ message: err.message });
    }
    console.error("Recommendation Error:", err);
    res.status(500).json({ message: 'An error occurred while fetching recommendations.' });
  }
};