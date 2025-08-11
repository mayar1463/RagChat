const pool = require('./db');

async function createSession(userId, title = 'New Chat') {
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
  await pool.query('UPDATE sessions SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, id]);
  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
  return rows[0];
}

async function toggleFavorite(id, isFavorite) {
  await pool.query('UPDATE sessions SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [isFavorite ? 1 : 0, id]);
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
