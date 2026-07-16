const Mood = require('../models/Mood');

// ── POST /api/moods ───────────────────────────────────────────────────────────
const logMood = async (req, res, next) => {
  try {
    const { mood, note, emoji } = req.body;
    const entry = await Mood.create({ user: req.user._id, mood, note, emoji });
    res.status(201).json({ success: true, entry });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/moods ────────────────────────────────────────────────────────────
const getMoods = async (req, res, next) => {
  try {
    const { limit = 30 } = req.query;
    const moods = await Mood.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(Number(limit));
    res.json({ success: true, moods });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/moods/:id ─────────────────────────────────────────────────────
const deleteMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!mood) return res.status(404).json({ success: false, message: 'Mood entry not found' });
    res.json({ success: true, message: 'Mood entry deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { logMood, getMoods, deleteMood };
