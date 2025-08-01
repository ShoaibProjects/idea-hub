export interface PasswordChangeCredentials {
  username: string;
  password: string;
  newPassword: string;
}

export interface DeleteAccountCredentials {
  username: string;
  password: string;
}

export interface PreferencesPayload {
  username: string;
  preferences: string[];
}

export interface DescriptionPayload {
  username: string;
  description: string;
}
