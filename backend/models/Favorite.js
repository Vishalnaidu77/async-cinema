const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie'
  },
  title: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate favorites
favoriteSchema.index({ user: 1, movieId: 1, mediaType: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
