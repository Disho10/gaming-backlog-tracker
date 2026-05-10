export function renderGameCards(games) {
  const container = document.getElementById('search-results');

  if (games.length === 0) {
    container.innerHTML = `
      <p class="no-results">No games found. Try a different search.</p>
    `;
    return;
  }

  container.innerHTML = games.map(game => {
    const platforms = game.platforms?.map(p => p.platform.name) || ['Unknown'];

    return `
      <div class="game-card">
        <img 
          src="${game.background_image || ''}" 
          alt="${game.name}"
        />
        <div class="game-card-info">
          <h3>${game.name}</h3>
          <p>${game.genres?.map(g => g.name).join(', ') || 'No genre'}</p>
          <div class="game-card-actions">

            <div class="custom-select-wrapper">
              <label class="select-label">Status</label>
              <div class="custom-select" 
                id="status-wrap-${game.id}" 
                data-value="want_to_play">
                <div class="custom-select-trigger" 
                  onclick="toggleDropdown(event, 'status-wrap-${game.id}')">
                  <span>Want to Play</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <div class="custom-options">
                  <div class="custom-option selected" 
                    data-value="want_to_play"
                    onclick="selectOption(event, 'status-wrap-${game.id}', 'want_to_play', 'Want to Play')">
                    Want to Play
                  </div>
                  <div class="custom-option" 
                    data-value="currently_playing"
                    onclick="selectOption(event, 'status-wrap-${game.id}', 'currently_playing', 'Currently Playing')">
                    Currently Playing
                  </div>
                  <div class="custom-option" 
                    data-value="completed"
                    onclick="selectOption(event, 'status-wrap-${game.id}', 'completed', 'Completed')">
                    Completed
                  </div>
                  <div class="custom-option" 
                    data-value="dropped"
                    onclick="selectOption(event, 'status-wrap-${game.id}', 'dropped', 'Dropped')">
                    Dropped
                  </div>
                </div>
              </div>
            </div>

            <div class="custom-select-wrapper">
              <label class="select-label">Platform</label>
              <div class="custom-select" 
                id="platform-wrap-${game.id}"
                data-value="${platforms[0]}">
                <div class="custom-select-trigger"
                  onclick="toggleDropdown(event, 'platform-wrap-${game.id}')">
                  <span>${platforms[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <div class="custom-options">
                  ${platforms.map((p, i) => `
                    <div class="custom-option ${i === 0 ? 'selected' : ''}"
                      data-value="${p}"
                      onclick="selectOption(event, 'platform-wrap-${game.id}', '${p}', '${p}')">
                      ${p}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <button 
              class="btn btn-primary"
              onclick="window.addToBacklog(
                '${game.id}',
                '${game.name.replace(/'/g, "\\'")}',
                '${game.background_image}',
                '${game.genres?.[0]?.name || 'Unknown'}',
                document.getElementById('platform-wrap-${game.id}').dataset.value,
                document.getElementById('status-wrap-${game.id}').dataset.value
              )"
            >
              + Add to Backlog
            </button>

          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function showLoading(containerId) {
  document.getElementById(containerId).innerHTML = `
    <p class="loading">Searching...</p>
  `;
}

window.toggleDropdown = function(event, wrapperId) {
  event.stopPropagation();
  const wrapper = document.getElementById(wrapperId);
  const isOpen = wrapper.classList.contains('open');
  document.querySelectorAll('.custom-select.open')
    .forEach(d => d.classList.remove('open'));
  if (!isOpen) wrapper.classList.add('open');
}

window.selectOption = function(event, wrapperId, value, label) {
  event.stopPropagation();
  const wrapper = document.getElementById(wrapperId);
  wrapper.dataset.value = value;
  wrapper.querySelector('.custom-select-trigger span').textContent = label;
  wrapper.querySelectorAll('.custom-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.value === value);
  });
  wrapper.classList.remove('open');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select')) {
    document.querySelectorAll('.custom-select.open')
      .forEach(d => d.classList.remove('open'));
  }
});

// Toast notification
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}