export interface User {
    _id?: string;
    username: string | null;
    description: string | null;
    preferences: string[];
    postedContent: string[];
    followers: string[];
    following: string[];
    likedIdeas: string[];
    dislikedIdeas: string[];
    chats?: string[];
    createdAt?: string;
    updatedAt?: string;
    isAuthenticated: boolean;
}

export interface SigninCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface SignupData {
    username?: string;
    password?: string;
    preferences: string[];
    isGuest: boolean;
    rememberMe: boolean;
}

export interface UserProfileData {
  username: string;
  postedIdeas: string[];
  followersCount: number;
  description?: string;
}
