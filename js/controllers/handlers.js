import { searchGames } from '../api/rawg.js';
import { renderGameCards, showLoading } from '../ui/render.js';
import { addToBacklog } from '../services/backlog.js';

// Search handler
async function handleSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;
  showLoading('search-results');
  const games = await searchGames(query);
  renderGameCards(games);
}

// Add to backlog handler
window.addToBacklog = async function(
  rawgId, title, coverArt, genre, platform, status
) {
  const result = await addToBacklog({
    rawg_id: rawgId,
    title: title,
    cover_art: coverArt,
    genre: genre,
    platform: platform,
    status: status || 'want_to_play'
  });

  if (result.error) {
    alert(result.error);
  } else {
    alert(`"${title}" added to your backlog!`);
  }
}

// Event listeners
document.getElementById('search-btn')
  .addEventListener('click', handleSearch);

document.getElementById('search-input')
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });