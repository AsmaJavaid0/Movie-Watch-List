const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // You can replace this later with your exact live Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (Vercel serverless approach: let the connection execute globally)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/movies', require('./routes/movies'));
app.use('/api/uploads', require('./routes/uploads'));

// Base Route just to test if the API is working
app.get('/', (req, res) => {
  res.send('🎬 Movie Watchlist API is running smoothly!');
});

// ONLY listen to a port if NOT running on Vercel (e.g., local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));
}

// CRITICAL FOR VERCEL: Export the app instance
module.exports = app;
