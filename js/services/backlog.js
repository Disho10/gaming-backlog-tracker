import { 
  addGameToBacklog, 
  getBacklog, 
  updateGame, 
  deleteGame 
} from '../data/db.js';

// Dynamic base URL — works locally and in production
const STATS_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api/stats'
  : `${window.location.origin}/api/stats`;

// Add game — business logic lives here
export async function addToBacklog(gameData) {
  if (!gameData.rawg_id || !gameData.title) {
    return { error: 'Missing required game data' };
  }
  return await addGameToBacklog(gameData);
}

// Get full backlog
export async function fetchBacklog() {
  return await getBacklog();
}

// Update game details
export async function updateGameDetails(id, updates) {
  if (!id) return { error: 'No game ID provided' };
  return await updateGame(id, updates);
}

// Remove game
export async function removeFromBacklog(id) {
  if (!id) return { error: 'No game ID provided' };
  return await deleteGame(id);
}

// Filter backlog by status
export function filterByStatus(games, status) {
  if (status === 'all') return games;
  return games.filter(game => game.status === status);
}

// Stats functions — all live in service layer
export async function fetchCompletionByGenre() {
  const response = await fetch(
    `${STATS_BASE}/completion-by-genre`
  );
  return await response.json();
}

export async function fetchRatingByPlatform() {
  const response = await fetch(
    `${STATS_BASE}/rating-by-platform`
  );
  return await response.json();
}

export async function fetchGrowthRate() {
  const response = await fetch(
    `${STATS_BASE}/growth-rate`
  );
  return await response.json();
}

export async function fetchAbandonedGenre() {
  const response = await fetch(
    `${STATS_BASE}/abandoned-genre`
  );
  return await response.json();
}

export async function fetchSummary() {
  const response = await fetch(
    `${STATS_BASE}/summary`
  );
  return await response.json();
}
