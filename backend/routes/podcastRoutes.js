const express = require('express');
const { getPodcasts, getPodcast, createPodcast, updatePodcast, deletePodcast } = require('../controllers/podcastController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPodcasts);
router.get('/:id', getPodcast);
router.post('/', protect, adminOnly, createPodcast);
router.put('/:id', protect, adminOnly, updatePodcast);
router.delete('/:id', protect, adminOnly, deletePodcast);

module.exports = router;
