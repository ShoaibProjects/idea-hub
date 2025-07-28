import Idea from '../models/Idea.js'; 

const createDateFilter = (period) => {
  if (!period || !['7days', '30days'].includes(period)) {
    return {}; 
  }
  const days = period === '7days' ? 7 : 30;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return { createdAt: { $gte: date } };
};

export const fetchTrendingIdeas = async (queryParams) => {
  const { period, category } = queryParams;
  const limit = parseInt(queryParams.limit) || 20;
  const page = parseInt(queryParams.page) || 1;
  const skip = (page - 1) * limit;
  let filter = { ...createDateFilter(period) };
  if (category) {
    filter.category = category;
  }

  const sort = { upvotes: -1, _id: 1 };

  const trendingIdeas = await Idea.find(filter)
    .sort(sort)
    .skip(skip)   
    .limit(limit);

  return trendingIdeas;
};