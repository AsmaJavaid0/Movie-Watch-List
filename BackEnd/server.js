const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const vercelOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://movie-watch-list-lyart.vercel.app';
allowedOrigins.push(vercelOrigin);

// Lightweight CORS handler (explicit headers) to control allowed origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
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