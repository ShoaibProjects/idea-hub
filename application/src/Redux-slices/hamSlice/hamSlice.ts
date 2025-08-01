import { createSlice } from '@reduxjs/toolkit';
interface HamState {
  sharedState: boolean;
}

const initialState: HamState = {
  sharedState: false,
};

const hamSlice = createSlice({
  name: 'ham',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.sharedState = !state.sharedState;
    },
  },
});

export const { toggleMenu } = hamSlice.actions;

export default hamSlice.reducer;
