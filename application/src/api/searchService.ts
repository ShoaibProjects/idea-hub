import apiClient from '../api/apiClient';
import { SearchParams, SearchResults } from '../types/ideaTypes';

const searchContent = async (params: SearchParams): Promise<SearchResults> => {
  const response = await apiClient.get<SearchResults>('/idea/explore/search', {
    params: {
      limit: 10,
      ...params,
    },
  });
  return response.data;
};

const searchService = {
  searchContent,
};

export default searchService;
