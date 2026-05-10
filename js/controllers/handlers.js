import { searchGames, getTopGames } from '../api/rawg.js';
import { renderGameCards, showLoading, showToast } from '../ui/render.js';
import { addToBacklog } from '../services/backlog.js';

async function handleSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;
  showLoading('search-results');
  const games = await searchGames(query);
  renderGameCards(games);
}

// Load top games on page open
async function loadTopGames() {
  showLoading('search-results');
  const games = await getTopGames();
  renderGameCards(games);
}

window.addToBacklog = async function(
  rawgId, title, coverArt, genre, platform, status
) {
  console.log('STATUS RECEIVED:', status);
  console.log('PLATFORM RECEIVED:', platform);
  
  const result = await addToBacklog({
    rawg_id: rawgId,
    title: title,
    cover_art: coverArt,
    genre: genre,
    platform: platform,
    status: status || 'want_to_play'
  });

  if (result.error) {
    showToast(result.error, 'error');
  } else {
    showToast(`"${title}" added to your backlog!`, 'success');
  }
}

document.getElementById('search-btn')
  .addEventListener('click', handleSearch);

document.getElementById('search-input')
  .addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

// Load top games when page opens
loadTopGames();