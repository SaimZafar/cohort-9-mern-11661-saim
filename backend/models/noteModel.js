const pool = require('../config/db');

async function createNote(userId, title, content) {
  const [result] = await pool.query(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
    [userId, title, content]
  );
  return { id: result.insertId, userId, title, content };
}

async function getNotesByUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
    [userId]
  );
  return rows;
}

async function getNoteById(id, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
}

async function updateNote(id, userId, title, content) {
  await pool.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
    [title, content, id, userId]
  );
  return getNoteById(id, userId);
}

async function deleteNote(id, userId) {
  const [result] = await pool.query(
    'DELETE FROM notes WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { createNote, getNotesByUser, getNoteById, updateNote, deleteNote };