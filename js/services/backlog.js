import { 
  addGameToBacklog, 
  getBacklog, 
  updateGame, 
  deleteGame 
} from '../data/db.js';

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