const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  tmdbId: {
    type: Number,
    default: null
  },
  posterUrl: {
    type: String,
    default: '/placeholder-movie.jpg'
  },
  backdropUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: 'Description not available'
  },
  releaseDate: {
    type: String,
    default: ''
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  genres: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie'
  },
  rating: {
    type: Number,
    default: 0
  },
  isCustom: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
