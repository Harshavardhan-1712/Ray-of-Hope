const Podcast = require('../models/Podcast');

const getPodcasts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.$text = { $search: search };
    const podcasts = await Podcast.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, podcasts });
  } catch (err) {
    next(err);
  }
};

const getPodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) return res.status(404).json({ success: false, message: 'Podcast not found' });
    res.json({ success: true, podcast });
  } catch (err) {
    next(err);
  }
};

const createPodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.create(req.body);
    res.status(201).json({ success: true, podcast });
  } catch (err) {
    next(err);
  }
};

const updatePodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!podcast) return res.status(404).json({ success: false, message: 'Podcast not found' });
    res.json({ success: true, podcast });
  } catch (err) {
    next(err);
  }
};

const deletePodcast = async (req, res, next) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) return res.status(404).json({ success: false, message: 'Podcast not found' });
    res.json({ success: true, message: 'Podcast deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPodcasts, getPodcast, createPodcast, updatePodcast, deletePodcast };
