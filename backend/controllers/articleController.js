const Article = require('../models/Article');

// ── GET /api/articles  (public) ───────────────────────────────────────────────
const getArticles = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [articles, total] = await Promise.all([
      Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Article.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), articles });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/articles/:id  (public) ──────────────────────────────────────────
const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/articles  (admin) ───────────────────────────────────────────────
const createArticle = async (req, res, next) => {
  try {
    const article = await Article.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, article });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/articles/:id  (admin) ────────────────────────────────────────────
const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/articles/:id  (admin) ────────────────────────────────────────
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, message: 'Article deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getArticles, getArticle, createArticle, updateArticle, deleteArticle };
