import apiClient from './apiClient'; 

export interface Comment {
  _id: string; 
  ideaId: string;
  creator: string;
  description: string;
  createdAt: string; 
  updatedAt: string; 
}

interface AddCommentData {
  ideaId: string;
  creator: string;
  description: string;
}

interface UpdateCommentData {
  commentId: string;
  creator: string;
  description: string;
}

interface DeleteCommentData {
  commentId: string;
  creator: string;
  ideaId: string;
}

export const fetchComments = async (ideaId: string): Promise<Comment[]> => {
  const response = await apiClient.get(`/idea/${ideaId}/comments`);
  return response.data;
};

export const addComment = async (data: AddCommentData): Promise<Comment> => {
  const response = await apiClient.post('/idea/comment/add', data);
  return response.data;
};

export const updateComment = async (data: UpdateCommentData): Promise<Comment> => {
  const response = await apiClient.patch('/idea/comment/update', data);
  return response.data;
};

export const deleteComment = async (data: DeleteCommentData): Promise<any> => {
  const response = await apiClient.delete('/idea/comment/delete', {
    data: { commentId: data.commentId, creator: data.creator, ideaId: data.ideaId },
  });
  return response.data;
};
