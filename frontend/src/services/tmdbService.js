import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Get trending
const getTrending = async (timeWindow = 'day') => {
  const response = await tmdbApi.get(`/trending/all/${timeWindow}`);
  return response.data;
};

// Get popular movies
const getPopular = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', { params: { page } });
  return response.data;
};

// Get movies (now playing)
const getMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
  return response.data;
};

// Get TV shows
const getTVShows = async (page = 1) => {
  const response = await tmdbApi.get('/tv/popular', { params: { page } });
  return response.data;
};

// Get people
const getPeople = async (page = 1) => {
  const response = await tmdbApi.get('/person/popular', { params: { page } });
  return response.data;
};

// Search multi
const search = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/multi', { params: { query, page } });
  return response.data;
};

// Get movie/tv details
const getDetails = async (id, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,images,similar,recommendations' }
  });
  return response.data;
};

// Get videos
const getVideos = async (id, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/${mediaType}/${id}/videos`);
  return response.data;
};

// Get person details
const getPersonDetails = async (id) => {
  const response = await tmdbApi.get(`/person/${id}`, {
    params: { append_to_response: 'combined_credits,images' }
  });
  return response.data;
};

// Get genres
const getGenres = async (mediaType = 'movie') => {
  const response = await tmdbApi.get(`/genre/${mediaType}/list`);
  return response.data;
};

// Discover by genre
const discoverByGenre = async (mediaType, genreId, page = 1) => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: { with_genres: genreId, page }
  });
  return response.data;
};

const tmdbService = {
  getTrending,
  getPopular,
  getMovies,
  getTVShows,
  getPeople,
  search,
  getDetails,
  getVideos,
  getPersonDetails,
  getGenres,
  discoverByGenre,
};

export default tmdbService;
