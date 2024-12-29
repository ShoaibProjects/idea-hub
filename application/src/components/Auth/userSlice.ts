import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the User state
interface UserState {
  username: string | null; // Allow username to be null
  description: string;
  preferences: string[];
  postedContent: string[];
  followers : string[];
  following : string[];
  likedIdeas: string[];
  dislikedIdeas: string[];
  isAuthenticated: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  username: null, // Set username to null initially
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
    // Set user data on signup/signin
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
    // Logout user (clear the state)
    logout: (state) => {
      state.username = null; // Set to null on logout
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

// Export actions
export const { setUser, logout, addLikedIdea, removeLikedIdea, addDislikedIdea, removeDislikedIdea, addPostedContent, removePostedContent, updateDesc, updatePref, addToFollowing, removeFromFollowing } = userSlice.actions;

// Selector to get the user state
export const selectUser = (state: { user: UserState }) => state.user; // Return the entire user state
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;


export default userSlice.reducer;
