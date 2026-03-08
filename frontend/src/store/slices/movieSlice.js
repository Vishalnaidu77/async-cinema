import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbService from '../../services/tmdbService';

const initialState = {
  trending: [],
  popular: [],
  movies: [],
  tvShows: [],
  people: [],
  searchResults: [],
  currentMovie: null,
  videos: [],
  isLoading: false,
  isError: false,
  message: '',
  page: 1,
  totalPages: 1,
  searchQuery: '',
};

// Get trending
export const getTrending = createAsyncThunk('movies/getTrending', async (_, thunkAPI) => {
  try {
    return await tmdbService.getTrending();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get popular movies
export const getPopular = createAsyncThunk('movies/getPopular', async (page = 1, thunkAPI) => {
  try {
    return await tmdbService.getPopular(page);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get movies
export const getMovies = createAsyncThunk('movies/getMovies', async (page = 1, thunkAPI) => {
  try {
    return await tmdbService.getMovies(page);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get TV shows
export const getTVShows = createAsyncThunk('movies/getTVShows', async (page = 1, thunkAPI) => {
  try {
    return await tmdbService.getTVShows(page);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get people
export const getPeople = createAsyncThunk('movies/getPeople', async (page = 1, thunkAPI) => {
  try {
    return await tmdbService.getPeople(page);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Search
export const search = createAsyncThunk('movies/search', async ({ query, page = 1 }, thunkAPI) => {
  try {
    return await tmdbService.search(query, page);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get movie details
export const getMovieDetails = createAsyncThunk('movies/getDetails', async ({ id, mediaType }, thunkAPI) => {
  try {
    return await tmdbService.getDetails(id, mediaType);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get videos
export const getVideos = createAsyncThunk('movies/getVideos', async ({ id, mediaType }, thunkAPI) => {
  try {
    return await tmdbService.getVideos(id, mediaType);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    resetMovies: (state) => {
      state.movies = [];
      state.tvShows = [];
      state.searchResults = [];
      state.page = 1;
      state.totalPages = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
      state.videos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(getTrending.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrending.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trending = action.payload.results;
      })
      .addCase(getTrending.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Popular
      .addCase(getPopular.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPopular.fulfilled, (state, action) => {
        state.isLoading = false;
        state.popular = action.payload.results;
      })
      .addCase(getPopular.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Movies
      .addCase(getMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg === 1) {
          state.movies = action.payload.results;
        } else {
          state.movies = [...state.movies, ...action.payload.results];
        }
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // TV Shows
      .addCase(getTVShows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTVShows.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg === 1) {
          state.tvShows = action.payload.results;
        } else {
          state.tvShows = [...state.tvShows, ...action.payload.results];
        }
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(getTVShows.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // People
      .addCase(getPeople.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPeople.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg === 1) {
          state.people = action.payload.results;
        } else {
          state.people = [...state.people, ...action.payload.results];
        }
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(getPeople.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Search
      .addCase(search.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page === 1) {
          state.searchResults = action.payload.results;
        } else {
          state.searchResults = [...state.searchResults, ...action.payload.results];
        }
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(search.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Movie Details
      .addCase(getMovieDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(getMovieDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Videos
      .addCase(getVideos.fulfilled, (state, action) => {
        state.videos = action.payload.results;
      });
  },
});

export const { resetMovies, setSearchQuery, clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer;
