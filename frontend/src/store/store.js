import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import favoriteReducer from './slices/favoriteSlice';
import historyReducer from './slices/historySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    favorites: favoriteReducer,
    history: historyReducer,
  },
});

export default store;
