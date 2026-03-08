import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/history';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get history
const getHistory = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Add to history
const addToHistory = async (movieData, token) => {
  const response = await axios.post(API_URL, movieData, getAuthHeader(token));
  return response.data;
};

// Clear history
const clearHistory = async (token) => {
  const response = await axios.delete(API_URL, getAuthHeader(token));
  return response.data;
};

const historyService = {
  getHistory,
  addToHistory,
  clearHistory,
};

export default historyService;
