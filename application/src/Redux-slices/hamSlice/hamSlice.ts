import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
interface HamState {
  sharedState: boolean;
}

const initialState: HamState = {
  sharedState: false,
};

// Create the slice
const hamSlice = createSlice({
  name: 'ham',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.sharedState = !state.sharedState;
    },
  },
});

// Export actions
export const { toggleMenu } = hamSlice.actions;

// Export reducer
export default hamSlice.reducer;
