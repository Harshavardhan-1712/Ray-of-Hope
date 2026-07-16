const express = require('express');
const { chat } = require('../controllers/chatController');

const router = express.Router();

// Public – no auth required (so guests can also use Sage)
router.post('/', chat);

module.exports = router;
