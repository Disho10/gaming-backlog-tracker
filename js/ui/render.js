// This file only displays data — no logic, no API calls

export function renderGameCards(games) {
  const container = document.getElementById('search-results');

  if (games.length === 0) {
    container.innerHTML = `
      <p class="no-results">No games found. Try a different search.</p>
    `;
    return;
  }

  container.innerHTML = games.map(game => `
    <div class="game-card">
      <img 
        src="${game.background_image || 'css/placeholder.png'}" 
        alt="${game.name}"
      />
      <div class="game-card-info">
        <h3>${game.name}</h3>
        <p>${game.genres?.map(g => g.name).join(', ') || 'No genre listed'}</p>
        <p class="game-platform">
          ${game.platforms?.map(p => p.platform.name).join(', ') || 'No platform listed'}
        </p>
        <button 
          class="btn btn-primary" 
          onclick="window.addToBacklog(
            '${game.id}',
            '${game.name.replace(/'/g, "\\'")}',
            '${game.background_image}',
            '${game.genres?.[0]?.name || 'Unknown'}',
            '${game.platforms?.[0]?.platform.name || 'Unknown'}'
          )"
        >
          + Add to Backlog
        </button>
      </div>
    </div>
  `).join('');
}

export function showLoading(containerId) {
  document.getElementById(containerId).innerHTML = `
    <p class="loading">Searching...</p>
  `;
}