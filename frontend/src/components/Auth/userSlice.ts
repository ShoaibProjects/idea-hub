import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the User state
interface UserState {
  username: string | null; // Allow username to be null
  preferences: string[];
  likedIdeas: string[];
  dislikedIdeas: string[];
  isAuthenticated: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  username: null, // Set username to null initially
  preferences: [],
  likedIdeas: [],
  dislikedIdeas: [],
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user data on signup/signin
    setUser: (state, action: PayloadAction<{ username: string; preferences: string[]; likedIdeas: string[]; dislikedIdeas: string[]; }>) => {
      state.username = action.payload.username;
      state.preferences = action.payload.preferences;
      state.likedIdeas = action.payload.likedIdeas;
      state.dislikedIdeas = action.payload.dislikedIdeas;
      state.isAuthenticated = true;
    },
    // Logout user (clear the state)
    logout: (state) => {
      state.username = null; // Set to null on logout
      state.preferences = [];
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
  },
});

// Export actions
export const { setUser, logout, addLikedIdea, removeLikedIdea, addDislikedIdea, removeDislikedIdea } = userSlice.actions;

// Selector to get the user state
export const selectUser = (state: { user: UserState }) => state.user; // Return the entire user state

export default userSlice.reducer;
