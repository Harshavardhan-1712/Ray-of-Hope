const express = require('express');
const { getExperts, getExpert, createExpert, updateExpert, deleteExpert } = require('../controllers/expertController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getExperts);
router.get('/:id', getExpert);
router.post('/', protect, adminOnly, createExpert);
router.put('/:id', protect, adminOnly, updateExpert);
router.delete('/:id', protect, adminOnly, deleteExpert);

module.exports = router;
