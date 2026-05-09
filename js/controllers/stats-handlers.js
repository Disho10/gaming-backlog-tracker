import {
  fetchCompletionByGenre,
  fetchRatingByPlatform,
  fetchGrowthRate,
  fetchAbandonedGenre,
  fetchSummary
} from '../services/backlog.js';

// Load all stats on page open
async function loadStats() {
  loadSummary();
  loadGenreStats();
  loadPlatformStats();
  loadAbandonedStats();
  loadGrowthStats();
}

// Summary numbers
async function loadSummary() {
  const data = await fetchSummary();
  document.getElementById('stat-total').textContent = 
    data.total || 0;
  document.getElementById('stat-completed').textContent = 
    data.completed || 0;
  document.getElementById('stat-playing').textContent = 
    data.playing || 0;
  document.getElementById('stat-rating').textContent = 
    data.avg_rating ? `${data.avg_rating}/10` : 'N/A';
  document.getElementById('stat-hours').textContent = 
    data.total_hours ? `${data.total_hours}h` : '0h';
}

// Completion rate by genre
async function loadGenreStats() {
  const data = await fetchCompletionByGenre();
  const container = document.getElementById('genre-stats');

  if (!data.length) {
    container.innerHTML = 
      '<p class="no-results">No data yet — complete some games first.</p>';
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="stat-bar-row">
      <span class="stat-bar-label">${item.genre}</span>
      <div class="stat-bar-track">
        <div 
          class="stat-bar-fill" 
          style="width: ${item.completion_rate}%"
        ></div>
      </div>
      <span class="stat-bar-value">${item.completion_rate}%</span>
      <span class="stat-bar-sub">(${item.completed}/${item.total})</span>
    </div>
  `).join('');
}

// Average rating by platform
async function loadPlatformStats() {
  const data = await fetchRatingByPlatform();
  const container = document.getElementById('platform-stats');

  if (!data.length) {
    container.innerHTML = 
      '<p class="no-results">No ratings yet — rate some games first.</p>';
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="stat-bar-row">
      <span class="stat-bar-label">${item.platform}</span>
      <div class="stat-bar-track">
        <div 
          class="stat-bar-fill" 
          style="width: ${(item.avg_rating / 10) * 100}%"
        ></div>
      </div>
      <span class="stat-bar-value">${item.avg_rating}/10</span>
      <span class="stat-bar-sub">(${item.total_rated} games)</span>
    </div>
  `).join('');
}

// Most abandoned genre
async function loadAbandonedStats() {
  const data = await fetchAbandonedGenre();
  const container = document.getElementById('abandoned-stats');

  if (!data.length) {
    container.innerHTML = 
      '<p class="no-results">No dropped games yet.</p>';
    return;
  }

  container.innerHTML = `
    <div class="abandoned-card">
      <span class="abandoned-genre">${data[0].genre}</span>
      <span class="abandoned-count">
        ${data[0].dropped_count} game${data[0].dropped_count > 1 ? 's' : ''} dropped
      </span>
    </div>
  `;
}

// Backlog growth by week
async function loadGrowthStats() {
  const data = await fetchGrowthRate();
  const container = document.getElementById('growth-stats');

  if (!data.length) {
    container.innerHTML = 
      '<p class="no-results">No data yet.</p>';
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="growth-row">
      <span class="growth-week">Week ${item.week}</span>
      <div class="growth-bars">
        <div class="growth-bar-item">
          <span class="growth-bar-label">Added</span>
          <div class="growth-bar added" 
            style="width: ${item.added * 30}px"
          ></div>
          <span>${item.added}</span>
        </div>
        <div class="growth-bar-item">
          <span class="growth-bar-label">Completed</span>
          <div class="growth-bar completed" 
            style="width: ${item.completed * 30}px"
          ></div>
          <span>${item.completed}</span>
        </div>
      </div>
    </div>
  `).join('');
}

loadStats();