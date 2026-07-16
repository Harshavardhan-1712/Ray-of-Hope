const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    type: {
      type: String,
      enum: ['Therapist', 'Life Coach', 'Support Group'],
      required: [true, 'Type is required'],
    },
    experience: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Weekly'],
      default: 'Available',
    },
    sessions: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

expertSchema.index({ name: 'text', specialization: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
