import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/authTypes';

const initialState: User = {
  username: null, 
  description: '',
  preferences: [],
  postedContent: [],
  followers: [],
  following: [],
  likedIdeas: [],
  dislikedIdeas: [],
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string; description: string; preferences: string[]; postedContent: string[]; followers : string[]; following : string[]; likedIdeas: string[]; dislikedIdeas: string[]; }>) => {
      state.username = action.payload.username;
      state.description = action.payload.description;
      state.preferences = action.payload.preferences;
      state.postedContent = action.payload.postedContent;
      state.followers = action.payload.followers;
      state.following = action.payload.following;
      state.likedIdeas = action.payload.likedIdeas;
      state.dislikedIdeas = action.payload.dislikedIdeas;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.username = null; 
      state.description = '';
      state.preferences = [];
      state.followers = [];
      state.following = [];
      state.likedIdeas = [];
      state.dislikedIdeas = [];
      state.isAuthenticated = false;
    },
    addLikedIdea: (state, action) => {
      state.likedIdeas.push(action.payload);
    },
    removeLikedIdea: (state, action) => {
      state.likedIdeas = state.likedIdeas.filter(
        (ideaId) => ideaId !== action.payload
      );
    },
    addDislikedIdea: (state, action) => {
      state.dislikedIdeas.push(action.payload);
    },
    removeDislikedIdea: (state, action) => {
      state.dislikedIdeas = state.dislikedIdeas.filter(
        (ideaId) => ideaId !== action.payload
      );
    },
    addPostedContent: (state, action) => {
      state.postedContent.push(action.payload);
    },
    removePostedContent: (state, action) => {
      state.postedContent = state.postedContent.filter(
        (ideaId) => ideaId !== action.payload
      );
    },
    updateDesc: (state, action) => {
      state.description = action.payload
    },
    updatePref: (state, action) => {
      state.preferences = action.payload
    },
    addToFollowing: (state, action) => {
      state.following.push(action.payload);
    },
    removeFromFollowing: (state, action) => {
      state.following = state.following.filter(
        (fusername) => fusername !== action.payload
      );
    },
  },
});

export const { setUser, logout, addLikedIdea, removeLikedIdea, addDislikedIdea, removeDislikedIdea, addPostedContent, removePostedContent, updateDesc, updatePref, addToFollowing, removeFromFollowing } = userSlice.actions;

export const selectUser = (state: { user: User }) => state.user; 
export const selectIsAuthenticated = (state: { user: User }) => state.user.isAuthenticated;


export default userSlice.reducer;
