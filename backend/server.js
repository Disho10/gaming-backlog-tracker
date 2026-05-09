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

// Completion rate by genre
app.get('/api/stats/completion-by-genre', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        genre,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        ROUND(
          100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 1
        ) as completion_rate
      FROM backlog
      WHERE genre IS NOT NULL
      GROUP BY genre
      ORDER BY completion_rate DESC
    `).all();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Average personal rating by platform
app.get('/api/stats/rating-by-platform', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        platform,
        ROUND(AVG(personal_rating), 1) as avg_rating,
        COUNT(*) as total_rated
      FROM backlog
      WHERE personal_rating IS NOT NULL
      GROUP BY platform
      ORDER BY avg_rating DESC
    `).all();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Backlog growth rate — games added vs completed per week
app.get('/api/stats/growth-rate', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        strftime('%Y-%W', added_at) as week,
        COUNT(*) as added,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM backlog
      GROUP BY week
      ORDER BY week ASC
    `).all();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Most abandoned genre
app.get('/api/stats/abandoned-genre', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        genre,
        COUNT(*) as dropped_count
      FROM backlog
      WHERE status = 'dropped'
        AND genre IS NOT NULL
      GROUP BY genre
      ORDER BY dropped_count DESC
      LIMIT 1
    `).all();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Overall summary numbers
app.get('/api/stats/summary', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'currently_playing' THEN 1 ELSE 0 END) as playing,
        SUM(CASE WHEN status = 'want_to_play' THEN 1 ELSE 0 END) as want_to_play,
        SUM(CASE WHEN status = 'dropped' THEN 1 ELSE 0 END) as dropped,
        ROUND(AVG(personal_rating), 1) as avg_rating,
        SUM(hours_played) as total_hours
      FROM backlog
    `).get();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// app.listen always goes last
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});