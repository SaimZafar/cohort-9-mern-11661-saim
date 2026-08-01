const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require('../controllers/noteController');

router.use(authMiddleware); // every route below requires a valid JWT

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;