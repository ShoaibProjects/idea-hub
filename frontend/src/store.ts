import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux'; // Import combineReducers
import userReducer from './components/Auth/userSlice';
import categoryReducer from './Redux-slices/categories/categorySlices';

// Create a persist configuration
const persistConfig = {
  key: 'root', // Key for the persisted state
  storage, // Storage method
};

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  categories: categoryReducer,
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create a persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
