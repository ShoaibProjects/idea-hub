// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './components/Auth/userSlice';
import categoryReducer from './Redux-slices/categories/categorySlices';
import themeReducer from './Redux-slices/themeSlice/themeSlice'

export const store = configureStore({
  reducer: {
    user : userReducer,
    categories: categoryReducer,
    theme: themeReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;