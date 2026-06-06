const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    genre: {
      type: String,
      enum: ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Horror', 'Romance', 'Thriller'],
      required: true,
    },
    releaseYear: {
      type: Number,
      min: 1900,
      max: 2030,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    watched: {
      type: Boolean,
      default: false,
    },
    posterUrl: {
      type: String,          // Cloudinary image URL stored here
      default: '',
    },
    posterPublicId: {
      type: String,          // Cloudinary public ID (needed to delete image later)
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', MovieSchema);