const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      required: [true, 'Mood is required'],
      enum: ['😊 Great', '🙂 Good', '😐 Okay', '😟 Low', '😔 Struggling'],
    },
    emoji: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One mood log per user per day
moodSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);
