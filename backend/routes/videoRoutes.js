const express = require('express');
const { getVideos, getVideo, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getVideos);
router.get('/:id', getVideo);
router.post('/', protect, adminOnly, createVideo);
router.put('/:id', protect, adminOnly, updateVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);

module.exports = router;
