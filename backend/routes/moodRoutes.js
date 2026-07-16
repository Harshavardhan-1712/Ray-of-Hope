const express = require('express');
const { logMood, getMoods, deleteMood } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all mood routes require auth

router.post('/', logMood);
router.get('/', getMoods);
router.delete('/:id', deleteMood);

module.exports = router;
