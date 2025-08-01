import apiClient from './apiClient';

export const updateIdeaCount = async (
  ideaId: string,
  type: 'likes' | 'dislikes',
  count: number
): Promise<number> => {
  const response = await apiClient.put(`/idea/update/${ideaId}/${type}/update`, { [type]: count });
  return response.data;
};

export const updateUserIdeaList = async (
  username: string,
  ideaId: string,
  listType: 'liked' | 'disliked',
  action: 'add' | 'remove'
): Promise<any> => {
  const response = await apiClient.put(`/user/${username}/${listType}/${action}`, { ideaId });
  return response.data;
};
