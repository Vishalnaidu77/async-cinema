import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import historyService from '../../services/historyService';

const initialState = {
  history: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get watch history
export const getHistory = createAsyncThunk('history/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await historyService.getHistory(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Add to history
export const addToHistory = createAsyncThunk('history/add', async (movieData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await historyService.addToHistory(movieData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Clear history
export const clearHistory = createAsyncThunk('history/clear', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    await historyService.clearHistory(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    resetHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        // Remove existing entry if present
        state.history = state.history.filter(
          (item) => item.movieId !== action.payload.movieId
        );
        // Add to beginning
        state.history.unshift(action.payload);
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.history = [];
      });
  },
});

export const { resetHistory } = historySlice.actions;
export default historySlice.reducer;
