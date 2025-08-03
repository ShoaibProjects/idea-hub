import User from '../models/User.js';
import Idea from '../models/Idea.js';
import { weights } from '../config/recommendationConfig.js';

export const getRecommendations = async (username, page = 1, limit = 20) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const likedIdeasDetails = await Idea.find({ _id: { $in: user.likedIdeas || [] } }, 'tags');
  const likedTags = [...new Set(likedIdeasDetails.flatMap(idea => idea.tags))];

  const seenIdeaIds = [...(user.likedIdeas || []), ...(user.dislikedIdeas || [])];
  const startIndex = (page - 1) * limit;

  const recommendations = await Idea.aggregate([
    { $match: { _id: { $nin: seenIdeaIds } } },
    {
      $addFields: {
        newnessScore: { $divide: [1, { $add: [{ $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] }, 1] }] },
        
        popularityScore: { $log10: { $add: [{ $max: ["$upvotes", 0] }, 1] } },
        
        ratioScore: { 
          $divide: [
            { $max: ["$upvotes", 0] }, 
            { $add: [{ $max: ["$upvotes", 0] }, { $max: ["$downvotes", 0] }, 1] }
          ] 
        },
        
        followingScore: { $cond: { if: { $in: ["$creator", user.following] }, then: 1, else: 0 } },
        contentScore: { $size: { $setIntersection: ["$tags", user.preferences || []] } },
        likedSimilarityScore: { $size: { $setIntersection: ["$tags", likedTags] } }
      }
    },
    {
      $addFields: {
        totalScore: {
          $add: [
            { $multiply: ["$newnessScore", weights.newness] },
            { $multiply: ["$popularityScore", weights.upvoteCount] },
            { $multiply: ["$ratioScore", weights.upvoteDownvoteRatio] },
            { $multiply: ["$followingScore", weights.following] },
            { $multiply: ["$contentScore", weights.content] },
            { $multiply: ["$likedSimilarityScore", weights.likedSimilarity] }
          ]
        }
      }
    },
    { $sort: { totalScore: -1 } },
    { $skip: startIndex },
    { $limit: limit },
    { 
      $project: {
        totalScore: 0, newnessScore: 0, popularityScore: 0, ratioScore: 0,
        followingScore: 0, contentScore: 0, likedSimilarityScore: 0
      }
    }
  ]);

  return recommendations;
};