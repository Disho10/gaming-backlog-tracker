const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;
// All RAWG calls go through this file only
export async function searchGames(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/games/search?query=${query}`
    );
    if (!response.ok) {
      throw new Error('Search failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
}

export async function getTopGames() {
  try {
    const response = await fetch(`${BASE_URL}/games/top`);
    if (!response.ok) throw new Error('Failed to fetch top games');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top games:', error);
    return [];
  }
}