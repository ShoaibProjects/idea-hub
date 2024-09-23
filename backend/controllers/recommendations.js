import User from "../models/User.js";
import Idea from "../models/Idea.js";
import mongoose from "mongoose";

// API to fetch recommendations for a specific user
export const recomm = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.userId });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const page = parseInt(req.query.page) || 1;  // Current page (default 1)
      const limit = parseInt(req.query.limit) || 20;  // Number of ideas per request
  
      // Array of already shown ideas passed from the frontend
      const shownIdeaIds = req.query.shown ? req.query.shown.split(',') : [];

  
      // Step 1: Fetch all recommendations
      const recommendedIdeaIds = hybridRecommendation(user.username, user, await Idea.find());

  
      // Step 2: Filter out already shown ideas from recommendations
      let remainingRecommendedIdeas = recommendedIdeaIds.filter(id => !shownIdeaIds.includes(id));


  
      // Step 3: Determine how many ideas to show in this page (up to limit)
      const skip = (page - 1) * limit;  // Calculate how many ideas to skip based on the page number
      let ideasToShow = remainingRecommendedIdeas.slice(skip, skip + limit);

  
  
      // Step 4: If there are not enough recommended ideas to fill this page, fetch random ideas to fill the gap
      if (ideasToShow.length < limit) {
        const remaining = limit - ideasToShow.length;
  
        const randomIdeas = await Idea.aggregate([
          { $match: { _id: { $nin: [...shownIdeaIds.map(id => new mongoose.Types.ObjectId(id)), // Correct usage with 'new'
            ...recommendedIdeaIds.map(id => new mongoose.Types.ObjectId(id))] } } },  // Exclude already shown and recommended ideas
          { $sample: { size: remaining } }
        ]);
  
        ideasToShow = [...ideasToShow, ...randomIdeas.map(idea => idea._id)]; // Add random ideas if needed
      }
      
  
      // Step 5: Fetch full details of the ideas to be shown in this page
      const AlmostfinalIdeas = await Idea.find({ _id: { $in: ideasToShow } });
      const finalIdeas = ideasToShow.map(id => AlmostfinalIdeas.find(idea => idea._id.toString() === id.toString()));
      // Step 6: Return the combined list of recommended and random ideas
      res.json(finalIdeas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  // Hybrid Recommendation System (same logic as before)
  function hybridRecommendation(username, user, ideas) {
    const contentRecommendations = contentBasedRecommendations(user, ideas);
    const recommendationScores = {};
    const contentWeight = 1.0;
  
    contentRecommendations.forEach(ideaId => {
      recommendationScores[ideaId] = (recommendationScores[ideaId] || 0) + contentWeight;
    });
  
    return Object.keys(recommendationScores).sort((a, b) => recommendationScores[b] - recommendationScores[a]);
  }
  
  function contentBasedRecommendations(user, ideas) {
    const userPreferences = user.preferences;
    const recommendations = [];
  
    ideas.forEach(idea => {
      const sharedTags = idea.tags.filter(tag => userPreferences.includes(tag));
      if (sharedTags.length > 0) {
        recommendations.push({ ideaId: idea._id, score: sharedTags.length });
      }
    });
    return recommendations.sort((a, b) => b.score - a.score).map(rec => rec.ideaId);
  }