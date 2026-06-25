const express   = require('express');
const router    = express.Router();
const Movie     = require('../models/movie');
const { cloudinary } = require('../config/cloudinary');

// GET — Fetch all movies (newest first)
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — Add a new movie
router.post('/', async (req, res) => {
  try {
    const movie = new Movie({
      title:         req.body.title,
      genre:         req.body.genre,
      releaseYear:   req.body.releaseYear,
      rating:        req.body.rating,
      watched:       req.body.watched,
      description:   req.body.description,
      posterUrl:     req.body.posterUrl,      // URL from Cloudinary
      posterPublicId:req.body.posterPublicId, // for future deletion
    });
    const saved = await movie.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT — Update a movie (e.g. toggle watched)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — Remove movie and also delete image from Cloudinary
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    // Delete image from Cloudinary if it exists
    if (movie.posterPublicId) {
      await cloudinary.uploader.destroy(movie.posterPublicId);
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;