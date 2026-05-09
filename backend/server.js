require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database(path.join(__dirname, 'database.db'));

// Create table when server starts
db.exec(`
  CREATE TABLE IF NOT EXISTS backlog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rawg_id TEXT NOT NULL,
    title TEXT NOT NULL,
    cover_art TEXT,
    genre TEXT,
    platform TEXT,
    status TEXT DEFAULT 'want_to_play',
    personal_rating INTEGER,
    hours_played INTEGER DEFAULT 0,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
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

// Add game to backlog
app.post('/api/backlog', (req, res) => {
  try {
    const { rawg_id, title, cover_art, genre, platform } = req.body;

    const existing = db.prepare(
      'SELECT id FROM backlog WHERE rawg_id = ?'
    ).get(rawg_id);

    if (existing) {
      return res.status(400).json({ error: 'Game already in backlog' });
    }

    const stmt = db.prepare(`
      INSERT INTO backlog (rawg_id, title, cover_art, genre, platform)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(rawg_id, title, cover_art, genre, platform);
    res.json({ success: true, message: 'Game added to backlog' });
  } catch (error) {
    console.error('Add to backlog error:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

// Get all backlog entries
app.get('/api/backlog', (req, res) => {
  try {
    const entries = db.prepare(
      'SELECT * FROM backlog ORDER BY added_at DESC'
    ).all();
    res.json(entries);
  } catch (error) {
    console.error('Get backlog error:', error);
    res.status(500).json({ error: 'Failed to get backlog' });
  }
});

// Update game
app.patch('/api/backlog/:id', (req, res) => {
  try {
    const { status, personal_rating, hours_played } = req.body;
    db.prepare(`
      UPDATE backlog 
      SET status = ?, personal_rating = ?, hours_played = ?
      WHERE id = ?
    `).run(status, personal_rating, hours_played, req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update backlog error:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// Delete game
app.delete('/api/backlog/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM backlog WHERE id = ?')
      .run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// app.listen always goes last
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});