const express = require('express');
const { createJournal, getJournals, getJournal, updateJournal, deleteJournal } = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all journal routes require auth

router.post('/', createJournal);
router.get('/', getJournals);
router.get('/:id', getJournal);
router.put('/:id', updateJournal);
router.delete('/:id', deleteJournal);

module.exports = router;
