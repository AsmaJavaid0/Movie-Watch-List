const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://movie-watch-list-phkh.vercel.app',
  'https://movie-watch-list-9l2m.vercel.app',
];

if (process.env.VERCEL_URL) {
  const url = process.env.VERCEL_URL.startsWith('http')
    ? process.env.VERCEL_URL
    : `https://${process.env.VERCEL_URL}`;
  if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
}

// Helper: check if origin is allowed (includes any movie-watch-list Vercel preview deploy)
function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow any Vercel preview/production deploy for this project
  if (/^https:\/\/movie-watch-list(-[a-z0-9]+)?\.vercel\.app$/.test(origin)) return true;
  return false;
}

// CORS handler — always respond to OPTIONS so preflight never fails silently
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
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