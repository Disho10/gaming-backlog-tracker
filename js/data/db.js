const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;

export async function addGameToBacklog(gameData) {
  try {
    const response = await fetch(`${BASE_URL}/backlog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });
    return await response.json();
  } catch (error) {
    console.error('DB add error:', error);
    return { error: 'Failed to add game' };
  }
}

export async function getBacklog() {
  try {
    const response = await fetch(`${BASE_URL}/backlog`);
    return await response.json();
  } catch (error) {
    console.error('DB get error:', error);
    return [];
  }
}

export async function updateGame(id, updateData) {
  try {
    const response = await fetch(`${BASE_URL}/backlog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return await response.json();
  } catch (error) {
    console.error('DB update error:', error);
    return { error: 'Failed to update' };
  }
}

export async function deleteGame(id) {
  try {
    const response = await fetch(`${BASE_URL}/backlog/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('DB delete error:', error);
    return { error: 'Failed to delete' };
  }
}