import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get all users
const getUsers = async (token) => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeader(token));
  return response.data;
};

// Ban/Unban user
const toggleBanUser = async (userId, token) => {
  const response = await axios.put(`${API_URL}/users/${userId}/ban`, {}, getAuthHeader(token));
  return response.data;
};

// Delete user
const deleteUser = async (userId, token) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeader(token));
  return response.data;
};

// Get all movies (custom)
const getMovies = async (token) => {
  const response = await axios.get(`${API_URL}/movies`);
  return response.data;
};

// Add movie
const addMovie = async (movieData, token) => {
  const response = await axios.post(`${API_URL}/movies`, movieData, getAuthHeader(token));
  return response.data;
};

// Update movie
const updateMovie = async (movieId, movieData, token) => {
  const response = await axios.put(`${API_URL}/movies/${movieId}`, movieData, getAuthHeader(token));
  return response.data;
};

// Delete movie
const deleteMovie = async (movieId, token) => {
  const response = await axios.delete(`${API_URL}/movies/${movieId}`, getAuthHeader(token));
  return response.data;
};

const adminService = {
  getUsers,
  toggleBanUser,
  deleteUser,
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
};

export default adminService;
