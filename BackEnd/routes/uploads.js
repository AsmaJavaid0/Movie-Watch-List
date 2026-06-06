const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');

// Multer uses Cloudinary as its storage engine
const upload = multer({ storage });

// POST /api/upload — Upload a single image to Cloudinary
router.post('/', upload.single('poster'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Cloudinary automatically gives us these after upload
    res.json({
      url:      req.file.path,       // public image URL
      publicId: req.file.filename,   // used for future deletion
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/upload/:publicId — Remove image from Cloudinary
router.delete('/:publicId', async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: '✅ Image deleted from Cloudinary' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;