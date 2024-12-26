import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
interface SearchState {
    isOpen: boolean;
}

const initialState: SearchState = {
    isOpen: false,
};

// Create the slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    openModal(state) {
        state.isOpen = true;
      },
      closeModal(state) {
        state.isOpen = false;
      },
      toggleModal(state) {
        state.isOpen = !state.isOpen;
      },
  },
});

// Export actions
export const { openModal, closeModal, toggleModal } = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;
