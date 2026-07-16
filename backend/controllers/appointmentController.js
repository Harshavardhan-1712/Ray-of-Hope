const Appointment = require('../models/Appointment');

// ── POST /api/appointments ────────────────────────────────────────────────────
const bookAppointment = async (req, res, next) => {
  try {
    const { expert, appointmentDate, reason } = req.body;
    const appointment = await Appointment.create({
      user: req.user._id,
      expert,
      appointmentDate,
      reason,
    });
    await appointment.populate('expert', 'name role specialization');
    res.status(201).json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/appointments ─────────────────────────────────────────────────────
const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('expert', 'name role specialization color avatar')
      .sort({ appointmentDate: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/appointments/:id/cancel ─────────────────────────────────────────
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: { $ne: 'cancelled' } },
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found or already cancelled' });
    }
    res.json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/appointments/:id ─────────────────────────────────────────────────
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id })
      .populate('expert', 'name role specialization');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
};

module.exports = { bookAppointment, getAppointments, cancelAppointment, getAppointment };
