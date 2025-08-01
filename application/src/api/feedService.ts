import apiClient from './apiClient';
import { Idea, TrendingIdeasParams } from '../types/ideaTypes';

export const fetchRecommendedIdeas = async ({ username, page, shownIdeas }: { username: string; page: number; shownIdeas: string[] }): Promise<Idea[]> => {
  const response = await apiClient.get(`/idea/recommendations/${username}`, {
    params: {
      page,
      limit: 20,
      shown: shownIdeas.join(','),
    },
  });
  return response.data;
};

const getTrendingIdeas = async (params: TrendingIdeasParams): Promise<Idea[]> => {
  const response = await apiClient.get<Idea[]>('/idea/trending/ideas', {
    params: {
      limit: 20,
      ...params,
    },
  });
  return response.data;
};

const ideaService = {
  getTrendingIdeas,
};

export default ideaService;