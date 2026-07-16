const Expert = require('../models/Expert');

const getExperts = async (req, res, next) => {
  try {
    const { type, search } = req.query;
    const filter = {};
    if (type && type !== 'All') filter.type = type;
    if (search) filter.$text = { $search: search };
    const experts = await Expert.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, experts });
  } catch (err) {
    next(err);
  }
};

const getExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });
    res.json({ success: true, expert });
  } catch (err) {
    next(err);
  }
};

const createExpert = async (req, res, next) => {
  try {
    const expert = await Expert.create(req.body);
    res.status(201).json({ success: true, expert });
  } catch (err) {
    next(err);
  }
};

const updateExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });
    res.json({ success: true, expert });
  } catch (err) {
    next(err);
  }
};

const deleteExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });
    res.json({ success: true, message: 'Expert deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExperts, getExpert, createExpert, updateExpert, deleteExpert };
