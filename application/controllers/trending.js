import { fetchTrendingIdeas } from "../services/trendingService.js";

export const getTrendingIdeas = async (req, res) => {
  try {
    const ideas = await fetchTrendingIdeas(req.query);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};