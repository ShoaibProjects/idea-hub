export interface PasswordChangeCredentials {
  password: string;
  newPassword: string;
}

export interface DeleteAccountCredentials {
  username: string;
  password: string;
}

export interface PreferencesPayload {
  preferences: string[];
}

export interface DescriptionPayload {
  description: string;
}
