const {
  createNote,
  getNotesByUser,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../models/noteModel');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
async function create(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new AppError('Title is required', 400);
    }

    const note = await createNote(req.user.id, title, content || '');
    logger.info({ userId: req.user.id, noteId: note.id }, 'Note created');
    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
}
async function getAll(req, res, next) {
  try {
    const notes = await getNotesByUser(req.user.id);
    res.status(200).json({ success: true, notes });
  } catch (err) {
    next(err);
  }
}
async function getOne(req, res, next) {
  try {
    const note = await getNoteById(req.params.id, req.user.id);
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    res.status(200).json({ success: true, note });
  } catch (err) {
    next(err);
  }
}
async function update(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new AppError('Title is required', 400);
    }
    const existing = await getNoteById(req.params.id, req.user.id);
    if (!existing) {
      throw new AppError('Note not found', 404);
    }
    const note = await updateNote(req.params.id, req.user.id, title, content);
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    logger.info({ userId: req.user.id, noteId: note.id }, 'Note updated');
    res.status(200).json({ success: true, note });
  } catch (err) {
    next(err);
  }
}
async function remove(req, res, next) {
  try {
    const deleted = await deleteNote(req.params.id, req.user.id);
    if (!deleted) {
      throw new AppError('Note not found', 404);
    }
    logger.info({ userId: req.user.id, noteId: req.params.id }, 'Note deleted');
    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
}
module.exports = { create, getAll, getOne, update, remove };