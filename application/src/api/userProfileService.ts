import apiClient from '../api/apiClient';
import { Idea } from '../types/ideaTypes';
import { UserProfileData } from '../types/authTypes';

const fetchUserProfileData = async (username: string): Promise<UserProfileData> => {
    const response = await apiClient.get(`/user/${username}`);
    const userData = response.data;
    return {
        username: userData.username,
        postedIdeas: userData.postedContent,
        followersCount: userData.followers?.length || 0,
        description: userData.description || 'No description provided',
    };
};

const fetchIdeas = async (ideaIds: string[]): Promise<Idea[]> => {
    const ideaPromises = ideaIds.map(ideaId =>
        apiClient.get<Idea>(`/idea/${ideaId}`)
    );
    const ideaResponses = await Promise.all(ideaPromises);
    return ideaResponses.map(res => res.data);
};

export const userProfileService = {
    fetchUserProfileData,
    fetchIdeas,
};
