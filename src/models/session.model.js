const pool = require('./db');

async function createSession(userId, title = 'New Chat') {
  // Check for existing session with same userId + title
  const [existing] = await pool.query(
    'SELECT id FROM sessions WHERE user_id = ? AND title = ? LIMIT 1',
    [userId, title]
  );

  if (existing.length > 0) {
    const error = new Error('Session with this title already exists for this user');
    error.status = 409;
    throw error;
  }

  const [result] = await pool.query(
    'INSERT INTO sessions (user_id, title) VALUES (?, ?)',
    [userId, title]
  );

  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function getSessionsByUser(userId, limit = 20, offset = 0) {
  const [rows] = await pool.query(
    'SELECT * FROM sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?',
    [userId, Number(limit), Number(offset)]
  );
  return rows;
}

async function getSessionById(id) {
  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
  return rows[0];
}

async function renameSession(id, title) {
  // Get the session to find its user_id
  const [sessionRows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
  if (sessionRows.length === 0) {
    const error = new Error('Session not found');
    error.status = 404;
    throw error;
  }
  const { user_id } = sessionRows[0];

  // Check for duplicate title for same user
  const [existing] = await pool.query(
    'SELECT id FROM sessions WHERE user_id = ? AND title = ? AND id != ? LIMIT 1',
    [user_id, title, id]
  );

  if (existing.length > 0) {
    const error = new Error('Session with this title already exists for this user');
    error.status = 409;
    throw error;
  }

  await pool.query(
    'UPDATE sessions SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, id]
  );

  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
  return rows[0];
}

async function toggleFavorite(id, isFavorite) {
  await pool.query(
    'UPDATE sessions SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [isFavorite ? 1 : 0, id]
  );
  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
  return rows[0];
}

async function deleteSession(id) {
  await pool.query('DELETE FROM sessions WHERE id = ?', [id]);
  return; // cascade will delete messages
}

module.exports = {
  createSession,
  getSessionsByUser,
  getSessionById,
  renameSession,
  toggleFavorite,
  deleteSession
};
