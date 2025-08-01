import apiClient from './apiClient';
import { Idea } from '../types/ideaTypes';

export interface UpdateIdeaData {
  title: string;
  description: string;
}

type CreateIdeaPayload = Omit<Idea, '_id' | 'likes' | 'dislikes' | 'createdAt' | 'upvotes' | 'downvotes' | 'comments'>;

export const deleteIdea = async (ideaId: string): Promise<any> => {
  const response = await apiClient.delete(`/idea/delete/${ideaId}`);
  return response.data;
};

export const updateIdea = async (ideaId: string, data: UpdateIdeaData): Promise<Idea> => {
  const response = await apiClient.put(`/idea/update/${ideaId}`, data);
  return response.data;
};

export const removeUserPostedIdea = async (username: string, ideaId: string): Promise<any> => {
  const response = await apiClient.put(`/user/${username}/remove-posted-idea`, { ideaId });
  return response.data;
};

export const fetchIdeaDetails = async (ideaId: string) => {
  const response = await apiClient.get(`/idea/${ideaId}`);
  return response.data;
};

export const createIdea = async (ideaData: CreateIdeaPayload) => {
  const response = await apiClient.post('/idea/add', ideaData);
  return response.data;
};

export const addUserPostedIdea = async (username: string, ideaId: string) => {
    const response = await apiClient.put(`/user/${username}/add-posted-idea`, { ideaId });
    return response.data;
};

export const fetchIdeaById = (ideaId: string): Promise<any> => {
  return apiClient.get(`/idea/${ideaId}`);
};