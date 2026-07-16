const Journal = require('../models/Journal');

// ── POST /api/journals ────────────────────────────────────────────────────────
const createJournal = async (req, res, next) => {
  try {
    const { title, content, mood, tags } = req.body;
    const journal = await Journal.create({ user: req.user._id, title, content, mood, tags });
    res.status(201).json({ success: true, journal });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/journals ─────────────────────────────────────────────────────────
const getJournals = async (req, res, next) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, journals });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/journals/:id ─────────────────────────────────────────────────────
const getJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!journal) return res.status(404).json({ success: false, message: 'Journal not found' });
    res.json({ success: true, journal });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/journals/:id ─────────────────────────────────────────────────────
const updateJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!journal) return res.status(404).json({ success: false, message: 'Journal not found' });
    res.json({ success: true, journal });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/journals/:id ──────────────────────────────────────────────────
const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!journal) return res.status(404).json({ success: false, message: 'Journal not found' });
    res.json({ success: true, message: 'Journal deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJournal, getJournals, getJournal, updateJournal, deleteJournal };
