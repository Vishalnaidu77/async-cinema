const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
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
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
watchHistorySchema.index({ user: 1, watchedAt: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
