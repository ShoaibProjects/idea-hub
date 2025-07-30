import { SigninCredentials } from '../types/authTypes';
import apiClient from './apiClient'; 

export const deleteUserAccount = async ({username, password}: SigninCredentials) => {
  const response = await apiClient.delete(`/user/delete`, {
    data: { username, password },
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post('/user/logout', {});
  return response.data;
};
