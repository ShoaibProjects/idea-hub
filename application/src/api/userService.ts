import apiClient from '../api/apiClient';
import { DescriptionPayload, PasswordChangeCredentials, PreferencesPayload } from '../types/settingsTypes';

const updatePassword = async (credentials: PasswordChangeCredentials): Promise<void> => {
  await apiClient.patch('/user/update/password', credentials);
};

const updateUserPreferences = (data: PreferencesPayload): Promise<any> => {
  return apiClient.patch('/user/update/preferences', data);
};

const updateUserDescription = (data: DescriptionPayload): Promise<any> => {
  return apiClient.patch('/user/update/description', data);
};

const userService = {
  updatePassword,
  updateUserPreferences,
  updateUserDescription
};

export default userService;


