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

      console.log(page,' p')
  
      // // Array of already shown ideas passed from the frontend
      // const shownIdeaIds = req.query.shown ? req.query.shown.split(',') : [];
   
    //       // Step 1: Fetch liked and disliked ideas by their IDs
    const likedIdeasDetails = await Idea.find({ _id: { $in: user.likedIdeas || [] } });
    const dislikedIdeasDetails = await Idea.find({ _id: { $in: user.dislikedIdeas || [] } });
  
      // Step 1: Fetch all recommendations
      const recommendedIdeaIds = hybridRecommendation(user.username, user, await Idea.find(), likedIdeasDetails, dislikedIdeasDetails);
  
  
      // // Step 2: Filter out already shown ideas from recommendations
      // let remainingRecommendedIdeas = recommendedIdeaIds.filter(id => !shownIdeaIds.includes(id));
      
      // let ideasToShow = remainingRecommendedIdeas;
      // // Step 3: Determine how many ideas to show in this page (up to limit)
      // if(ideasToShow.length>limit){ // Calculate how many ideas to skip based on the page number
      //   ideasToShow = remainingRecommendedIdeas.slice(0, limit);
      // }
      // // Step 4: If there are not enough recommended ideas to fill this page, fetch random ideas to fill the gap
      // if (ideasToShow.length < limit) {
      //   const remaining = limit - ideasToShow.length;
  
      //   const randomIdeas = await Idea.aggregate([
      //     { $match: { _id: { $nin: [...shownIdeaIds.map(id => new mongoose.Types.ObjectId(id)), // Correct usage with 'new'
      //       ...recommendedIdeaIds.map(id => new mongoose.Types.ObjectId(id))] } } },  // Exclude already shown and recommended ideas
      //     { $sample: { size: remaining } }
      //   ]);
      //   console.log(randomIdeas.length, 'random')


      //   ideasToShow = [...ideasToShow, ...randomIdeas.map(idea => idea._id)]; // Add random ideas if needed
      // }
      const startIndex = (page - 1) * limit;  // Calculate the starting index
      const paginatedRecommendedIdeas = recommendedIdeaIds.slice(startIndex, startIndex + limit);  // Get only the ideas for the current page

    // Step 3: Fetch full details of the paginated ideas
      
  
      // Step 5: Fetch full details of the ideas to be shown in this page
      const AlmostfinalIdeas = await Idea.find({ _id: { $in: paginatedRecommendedIdeas } });
      const finalIdeas = paginatedRecommendedIdeas.map(id => AlmostfinalIdeas.find(idea => idea._id.toString() === id.toString()));
      // Step 6: Return the combined list of recommended and random ideas
      res.json(finalIdeas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  // Hybrid Recommendation System (same logic as before)
  // Hybrid Recommendation System with multiple factors
function hybridRecommendation(username ,user, ideas, likedIdeasDetails, dislikedIdeasDetails) {
  const recommendationScores = {};
  const contentWeight = 0.2;  // Weight for tag and preference-based recommendations
  const upvoteDownvoteWeight = 0.2;  // Weight for upvote-downvote ratio
  const followingWeight = 0.2;  // Weight for ideas from followed creators
  const upvoteCountWeight = 0.1;  // Weight for popularity (upvote count)
  const newnessWeight = 0.1;  // Weight for newness
  const likedSimilarityWeight = 0.2;  // Weight for similarity to liked ideas

  // Fetch the user's liked and disliked ideas
  const likedIdeas = user.likedIdeas || [];
  const dislikedIdeas = user.dislikedIdeas || [];

  ideas.forEach(idea => {
    // Initialize score for this idea
    let score = 0;

    // 1. Content-based recommendation (based on shared tags and user preferences)
    const sharedTags = idea.tags.filter(tag => user.preferences.includes(tag));
    if (sharedTags.length > 0) {
      score += contentWeight * sharedTags.length;
    }

    // 2. Upvote-Downvote Ratio
    const upvoteDownvoteRatio = idea.upvotes / (idea.upvotes + idea.downvotes + 1);  // Avoid division by zero
    score += upvoteDownvoteWeight * upvoteDownvoteRatio;

    // 3. Following/Creator Weight
  
    if (user.following.includes(idea.creator.toString())) {
      score += followingWeight;
    }

    // 4. Upvote Count (popularity)
    score += upvoteCountWeight * Math.log(idea.upvotes + 1);  // Logarithmic scale to dampen very popular ideas

    // 5. Newness (more recent ideas get a higher score)
    const ageInDays = (new Date() - new Date(idea.createdAt)) / (1000 * 60 * 60 * 24);
    score += newnessWeight / (ageInDays + 1);  // More recent ideas get a higher score

    // 6. Similarity to liked ideas (boost for ideas similar to ones the user already liked)
    likedIdeasDetails.forEach(likedIdea => {
      const similarityScore = idea.tags.filter(tag => likedIdea.tags.includes(tag)).length;
      score += likedSimilarityWeight * similarityScore;
    });

    // Exclude ideas similar to disliked ideas
    // const isSimilarToDisliked = dislikedIdeasDetails.some(dislikedIdea =>
    //   idea.tags.some(tag => dislikedIdea.tags.includes(tag))
    // );
    // if (isSimilarToDisliked) {
    //   return;  // Skip this idea as it's similar to a disliked idea
    // }

    // Store the score
    recommendationScores[idea._id] = (recommendationScores[idea._id] || 0) + score;
  });

  // Sort ideas by their final score
  return Object.keys(recommendationScores).sort((a, b) => recommendationScores[b] - recommendationScores[a]);
}

// Content-Based Recommendations (Tag and Preference based)

