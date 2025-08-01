import apiClient from '../api/apiClient';

interface FollowPayload {
  currentUser: string;
  followedUser: string;
}

export const followUser = (data: FollowPayload): Promise<any> => {
  return apiClient.post('/user/follow/add', data);
};

export const unfollowUser = (data: FollowPayload): Promise<any> => {
  return apiClient.post('/user/follow/remove', data);
};
