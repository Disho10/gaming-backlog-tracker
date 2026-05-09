import { 
  fetchBacklog, 
  removeFromBacklog,
  updateGameDetails,
  filterByStatus 
} from '../services/backlog.js';

let allGames = [];

// Load and display backlog
async function loadBacklog() {
  document.getElementById('backlog-list').innerHTML = 
    '<p class="loading">Loading your backlog...</p>';
  
  allGames = await fetchBacklog();
  renderList('all');
}

// Render filtered list
function renderList(status) {
  const filtered = filterByStatus(allGames, status);
  const container = document.getElementById('backlog-list');

  if (filtered.length === 0) {
    container.innerHTML = 
      '<p class="no-results">No games here yet.</p>';
    return;
  }

  container.innerHTML = filtered.map(game => `
    <div class="backlog-item" id="item-${game.id}">
      <img src="${game.cover_art || ''}" alt="${game.title}"/>
      <div class="backlog-item-info">
        <h3>${game.title}</h3>
        <p class="text-muted">${game.genre || ''} • ${game.platform || ''}</p>
        <span class="badge badge-${getBadgeClass(game.status)}">
          ${formatStatus(game.status)}
        </span>
      </div>
      <div class="backlog-item-actions">
        <button 
          class="btn btn-sm btn-primary"
          onclick="window.editGame(${game.id}, '${game.status}', ${game.personal_rating || 0}, ${game.hours_played || 0})"
        >
          Edit
        </button>
        <button 
          class="btn btn-sm btn-danger"
          onclick="window.deleteGame(${game.id})"
        >
          Remove
        </button>
      </div>
    </div>
  `).join('');
}

// Helper functions
function getBadgeClass(status) {
  const map = {
    want_to_play: 'want',
    currently_playing: 'playing',
    completed: 'completed',
    dropped: 'dropped'
  };
  return map[status] || 'want';
}

function formatStatus(status) {
  const map = {
    want_to_play: 'Want to Play',
    currently_playing: 'Currently Playing',
    completed: 'Completed',
    dropped: 'Dropped'
  };
  return map[status] || status;
}

// Delete game
window.deleteGame = async function(id) {
  if (!confirm('Remove this game from your backlog?')) return;
  await removeFromBacklog(id);
  allGames = allGames.filter(g => g.id !== id);
  const activeTab = document.querySelector('.filter-tab.active');
  renderList(activeTab.dataset.status);
}

// Edit game
window.editGame = async function(id, status, rating, hours) {
  const newStatus = prompt(
    'Status? (want_to_play / currently_playing / completed / dropped)',
    status
  );
  if (!newStatus) return;

  const newRating = prompt('Personal rating? (1-10)', rating);
  const newHours = prompt('Hours played?', hours);

  await updateGameDetails(id, {
    status: newStatus,
    personal_rating: parseInt(newRating) || null,
    hours_played: parseInt(newHours) || 0
  });

  allGames = allGames.map(g => g.id === id ? {
    ...g,
    status: newStatus,
    personal_rating: parseInt(newRating) || null,
    hours_played: parseInt(newHours) || 0
  } : g);

  const activeTab = document.querySelector('.filter-tab.active');
  renderList(activeTab.dataset.status);
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab')
      .forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderList(tab.dataset.status);
  });
});

// Load on page open
loadBacklog();