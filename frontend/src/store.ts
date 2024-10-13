// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import userReducer from './components/Auth/userSlice';
import categoryReducer from './Redux-slices/categories/categorySlices';
import { createSlice } from '@reduxjs/toolkit';

// Define a slice to manage remember me state
const rememberMeSlice = createSlice({
  name: 'rememberMe',
  initialState: false,
  reducers: {
    setRememberMe: (state, action) => {
      return action.payload;
    },
  },
});

// Export actions for rememberMe
export const { setRememberMe } = rememberMeSlice.actions;

// Selector to get rememberMe state
export const selectRememberMe = (state: RootState) => state.rememberMe;

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  categories: categoryReducer,
  rememberMe: rememberMeSlice.reducer,
});

// Create a function to get the persist configuration dynamically
const createPersistConfig = (rememberMe: boolean) => {
  const whitelist = rememberMe ? ['user'] : []; // Conditionally persist user state
  return {
    key: 'root',
    storage,
    whitelist: [...whitelist, 'rememberMe'], // Always persist rememberMe state
  };
};

// Initialize store based on localStorage rememberMe value
const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

// Create the store with the persisted reducer
export const configureAppStore = (rememberMe: boolean) => {
  const persistConfig = createPersistConfig(rememberMe);
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

// Infer the `RootState` type from the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Initialize store and persistor based on savedRememberMe value
const { store, persistor } = configureAppStore(savedRememberMe);

// Export the store and persistor
export { store, persistor };

// Infer the `AppDispatch` type from the store
export type AppDispatch = typeof store.dispatch;
