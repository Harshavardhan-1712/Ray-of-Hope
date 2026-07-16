const express = require('express');
const { bookAppointment, getAppointments, cancelAppointment, getAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all appointment routes require auth

router.post('/', bookAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
