import { createSlice } from '@reduxjs/toolkit';
interface SearchState {
    isOpen: boolean;
}

const initialState: SearchState = {
    isOpen: false,
};

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

export const { openModal, closeModal, toggleModal } = searchSlice.actions;

export default searchSlice.reducer;
