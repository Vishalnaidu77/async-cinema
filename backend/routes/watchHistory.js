const express = require('express');
const router = express.Router();
const WatchHistory = require('../models/WatchHistory');
const { protect } = require('../middleware/auth');

// @route   GET /api/history
// @desc    Get user's watch history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const history = await WatchHistory.find({ user: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(parseInt(limit));
    
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/history
// @desc    Add to watch history
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, mediaType, title, posterPath } = req.body;

    // Remove existing entry for this movie to avoid duplicates
    await WatchHistory.findOneAndDelete({
      user: req.user._id,
      movieId,
      mediaType
    });

    // Add new entry
    const history = await WatchHistory.create({
      user: req.user._id,
      movieId,
      mediaType,
      title,
      posterPath
    });

    res.status(201).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/history
// @desc    Clear watch history
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await WatchHistory.deleteMany({ user: req.user._id });
    res.json({ message: 'Watch history cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/history/:movieId
// @desc    Remove single item from history
// @access  Private
router.delete('/:movieId', protect, async (req, res) => {
  try {
    const { mediaType = 'movie' } = req.query;
    
    await WatchHistory.findOneAndDelete({
      user: req.user._id,
      movieId: req.params.movieId,
      mediaType
    });

    res.json({ message: 'Removed from history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
