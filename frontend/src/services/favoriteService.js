import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/favorites';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get favorites
const getFavorites = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Add to favorites
const addFavorite = async (movieData, token) => {
  const response = await axios.post(API_URL, movieData, getAuthHeader(token));
  return response.data;
};

// Remove from favorites
const removeFavorite = async (movieId, mediaType, token) => {
  const response = await axios.delete(`${API_URL}/${movieId}?mediaType=${mediaType}`, getAuthHeader(token));
  return response.data;
};

// Check if favorite
const checkFavorite = async (movieId, mediaType, token) => {
  const response = await axios.get(`${API_URL}/check/${movieId}?mediaType=${mediaType}`, getAuthHeader(token));
  return response.data;
};

const favoriteService = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};

export default favoriteService;
