const express = require('express');
const { getArticles, getArticle, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', protect, adminOnly, createArticle);
router.put('/:id', protect, adminOnly, updateArticle);
router.delete('/:id', protect, adminOnly, deleteArticle);

module.exports = router;
