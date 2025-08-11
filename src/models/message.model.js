const pool = require('./db');

async function addMessage(sessionId, sender, content, context = null) {
  const [result] = await pool.query(
    'INSERT INTO messages (session_id, sender, content, context) VALUES (?, ?, ?, ?)',
    [sessionId, sender, content, context]
  );
  const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function getMessages(sessionId, limit = 50, offset = 0) {
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?',
    [sessionId, Number(limit), Number(offset)]
  );
  return rows;
}

module.exports = { addMessage, getMessages };
