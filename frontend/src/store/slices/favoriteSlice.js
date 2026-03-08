import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoriteService from '../../services/favoriteService';

const initialState = {
  favorites: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get favorites
export const getFavorites = createAsyncThunk('favorites/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await favoriteService.getFavorites(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Add to favorites
export const addFavorite = createAsyncThunk('favorites/add', async (movieData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await favoriteService.addFavorite(movieData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Remove from favorites
export const removeFavorite = createAsyncThunk('favorites/remove', async ({ movieId, mediaType }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    await favoriteService.removeFavorite(movieId, mediaType, token);
    return { movieId, mediaType };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.unshift(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (fav) => !(fav.movieId === action.payload.movieId && fav.mediaType === action.payload.mediaType)
        );
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
