import { 
  fetchBacklog, 
  removeFromBacklog,
  updateGameDetails,
  filterByStatus 
} from '../services/backlog.js';

let allGames = [];
let currentEditId = null;

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
        <p class="text-muted">
          ${game.genre || ''} • ${game.platform || ''}
        </p>
        <span class="badge badge-${getBadgeClass(game.status)}">
          ${formatStatus(game.status)}
        </span>
        ${game.personal_rating ? 
          `<span class="text-muted" style="font-size:0.8rem">
            ⭐ ${game.personal_rating}/10
          </span>` : ''
        }
        ${game.hours_played ? 
          `<span class="text-muted" style="font-size:0.8rem">
            🕐 ${game.hours_played}h
          </span>` : ''
        }
      </div>
      <div class="backlog-item-actions">
        <button 
          class="btn btn-sm btn-primary"
          onclick="window.openEditModal(
            ${game.id}, 
            '${game.title.replace(/'/g, "\\'")}',
            '${game.status}',
            ${game.personal_rating || 0},
            ${game.hours_played || 0}
          )"
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

// Open edit modal
window.openEditModal = function(id, title, status, rating, hours) {
  currentEditId = id;
  document.getElementById('modal-game-title').textContent = title;
  document.getElementById('modal-status').value = status;
  document.getElementById('modal-rating').value = rating;
  document.getElementById('rating-display').textContent = `${rating}/10`;
  document.getElementById('modal-hours').value = hours;
  document.getElementById('modal-overlay').classList.add('open');
}

// Close modal
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  currentEditId = null;
}

// Delete game
window.deleteGame = async function(id) {
  if (!confirm('Remove this game from your backlog?')) return;
  await removeFromBacklog(id);
  allGames = allGames.filter(g => g.id !== id);
  const activeTab = document.querySelector('.filter-tab.active');
  renderList(activeTab.dataset.status);
}

// Everything that touches the DOM goes inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {

  // Rating slider live update
  document.getElementById('modal-rating')
    .addEventListener('input', (e) => {
      document.getElementById('rating-display').textContent = 
        `${e.target.value}/10`;
    });

  // Save from modal
  document.getElementById('modal-save')
    .addEventListener('click', async () => {
      const status = document.getElementById('modal-status').value;
      const rating = parseInt(document.getElementById('modal-rating').value);
      const hours = parseInt(document.getElementById('modal-hours').value) || 0;

      await updateGameDetails(currentEditId, {
        status,
        personal_rating: rating || null,
        hours_played: hours
      });

      allGames = allGames.map(g => g.id === currentEditId ? {
        ...g, status, personal_rating: rating, hours_played: hours
      } : g);

      const activeTab = document.querySelector('.filter-tab.active');
      renderList(activeTab.dataset.status);
      closeModal();
    });

  // Close modal triggers
  document.getElementById('modal-close')
    .addEventListener('click', closeModal);

  document.getElementById('modal-cancel')
    .addEventListener('click', closeModal);

  document.getElementById('modal-overlay')
    .addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) {
        closeModal();
      }
    });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab')
        .forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderList(tab.dataset.status);
    });
  });

  // Load backlog last
  loadBacklog();

});