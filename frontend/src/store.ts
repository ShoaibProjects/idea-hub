// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './components/Auth/userSlice';
import categoryReducer from './Redux-slices/categories/categorySlices';

export const store = configureStore({
  reducer: {
    user : userReducer,
    categories: categoryReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;