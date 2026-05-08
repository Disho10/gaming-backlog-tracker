// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '..'))); // serves your HTML files

// Test route — just to confirm server works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Search games from RAWG
app.get('/api/games/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await fetch(
      `https://api.rawg.io/api/games?search=${query}&key=${process.env.RAWG_API_KEY}`
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error('RAWG search error:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});