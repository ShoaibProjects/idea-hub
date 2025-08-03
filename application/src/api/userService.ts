import apiClient from '../api/apiClient';
import { DescriptionPayload, PasswordChangeCredentials, PreferencesPayload } from '../types/settingsTypes';

const updatePassword = async (username: string, credentials: PasswordChangeCredentials): Promise<void> => {
  await apiClient.patch(`/user/${username}/update/password`, credentials);
};

const updateUserPreferences = (username: string, data: PreferencesPayload): Promise<any> => {
  return apiClient.patch(`/user/${username}/update/preferences`, data);
};

const updateUserDescription = (username: string, data: DescriptionPayload): Promise<any> => {
  return apiClient.patch(`/user/${username}/update/description`, data);
};

const userService = {
  updatePassword,
  updateUserPreferences,
  updateUserDescription
};

export default userService;


