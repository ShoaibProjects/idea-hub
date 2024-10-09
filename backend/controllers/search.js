import Idea from "../models/Idea.js";
import User from "../models/User.js";

export const getSearch = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    // 1. Full-text search for ideas based on title and description
    const ideas = await Idea.find(
      {
        $text: { $search: query }
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" }, _id: 1 }) // Sort by relevance
    .skip(skip)
    .limit(limit);

    // Check if full-text search returned fewer results than the limit and is on the first page
    const useFuzzy = ideas.length < limit && page == 1;
    let combinedIdeas = ideas;

    // If using fuzzy search, retrieve fuzzy results
    if (useFuzzy) {
      // Split query into words for fuzzy search
      const queryWords = query.split(' ').filter(Boolean);

      // 2. Fuzzy search for ideas excluding exact matches
      const fuzzyConditions = queryWords.map(word => ({
        $or: [
          { title: { $regex: word, $options: 'i' } },
          { description: { $regex: word, $options: 'i' } }
        ]
      }));

      const fuzzyIdeas = await Idea.find({
        $and: [
          { $or: fuzzyConditions },
          { _id: { $nin: ideas.map(idea => idea._id) } } // Exclude exact matches from full-text search
        ]
      })
      .limit(limit - ideas.length); // Limit fuzzy results to fill the gap

      // Combine results without duplicates
      combinedIdeas = [...ideas, ...fuzzyIdeas].filter((value, index, self) =>
        index === self.findIndex((t) => (t._id === value._id))
      );
    }

    // 3. Split query into words for fuzzy search on users
    const queryWords = query.split(' ').filter(Boolean);

    // Perform a fuzzy search for creators based on username
    const userConditions = queryWords.map(word => ({
      username: { $regex: word, $options: 'i' }
    }));

    const users = await User.find({
      $or: userConditions
    })
    .skip(skip)
    .limit(limit);

    res.status(200).json({ ideas: combinedIdeas, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during search' });
  }
};
