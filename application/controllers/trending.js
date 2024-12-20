import Idea from '../models/Idea.js'; // Import the Idea model

// Controller to handle fetching trending ideas
export const getTrendingIdeas = async (req, res) => {
  try {
    const { period, category } = req.query;
    const limit = parseInt(req.query.limit) || 20; // Default to 20 ideas per request
    const page = parseInt(req.query.page) || 1;    // Current page (default 1)

    console.log(category, period)
    let filter = {};
    let sort = { upvotes: -1, _id: 1  }; // Sort by upvotes in descending order

    // Step 1: Handle time-based filtering (Last 30 days or All time)
    if (period === '30days') {
      const currentDate = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);
      filter.createdAt = { $gte: thirtyDaysAgo }; // Only fetch ideas from the last 30 days
    }

    if (period === '7days') {
      const currentDate = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
      filter.createdAt = { $gte: sevenDaysAgo }; // Only fetch ideas from the last 30 days
    }

    // // Step 2: Handle category-based filtering (if a category is provided)
    if (category!='') {
      console.log(category)
      filter.category = category;
    }


    // Step 4: Fetch the ideas based on the filter and sort by upvotes (trending), with pagination
    const trendingIdeas = await Idea.find(filter)
      .sort(sort)
    console.log(trendingIdeas.length)
      const startIndex = (page - 1) * limit;  // Calculate the starting index
      const paginatedTrendIdeas = trendingIdeas.slice(startIndex, startIndex + limit);
    // Step 5: Return the trending ideas
    res.json(paginatedTrendIdeas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
