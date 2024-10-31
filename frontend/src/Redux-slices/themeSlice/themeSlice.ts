// themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface ThemeState {
  isDarkMode: boolean;
}

// Initial state with type
const initialState: ThemeState = {
  isDarkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const selectIsDarkMode = (state: RootState) => state.theme.isDarkMode;

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
