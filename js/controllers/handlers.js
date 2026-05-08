import { searchGames } from '../api/rawg.js';
import { renderGameCards, showLoading } from '../ui/render.js';

// Search handler
async function handleSearch() {
  const query = document.getElementById('search-input').value.trim();
  
  if (!query) return; // do nothing if search box is empty

  showLoading('search-results');
  
  const games = await searchGames(query);
  renderGameCards(games);
}

// Add to backlog — exposed globally for the onclick in render.js
window.addToBacklog = async function(
  rawgId, title, coverArt, genre, platform
) {
  // We'll fill this in Phase 3
  console.log('Adding to backlog:', title);
  alert(`"${title}" will be added to your backlog in Phase 3!`);
}

// Event listeners
document.getElementById('search-btn')
  .addEventListener('click', handleSearch);

document.getElementById('search-input')
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });