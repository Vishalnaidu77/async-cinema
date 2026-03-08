const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/auth');

// @route   GET /api/favorites
// @desc    Get user's favorites
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/favorites
// @desc    Add to favorites
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, mediaType, title, posterPath, releaseDate, rating } = req.body;

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      movieId,
      mediaType
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      movieId,
      mediaType,
      title,
      posterPath,
      releaseDate,
      rating
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/favorites/:movieId
// @desc    Remove from favorites
// @access  Private
router.delete('/:movieId', protect, async (req, res) => {
  try {
    const { mediaType = 'movie' } = req.query;
    
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      movieId: req.params.movieId,
      mediaType
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/favorites/check/:movieId
// @desc    Check if movie is in favorites
// @access  Private
router.get('/check/:movieId', protect, async (req, res) => {
  try {
    const { mediaType = 'movie' } = req.query;
    
    const favorite = await Favorite.findOne({
      user: req.user._id,
      movieId: req.params.movieId,
      mediaType
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
