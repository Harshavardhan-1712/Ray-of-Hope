const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    host: {
      type: String,
      default: '',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Mindfulness', 'Positive Psychology', 'Self-Improvement'],
    },
    episodes: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    link: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

podcastSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Podcast', podcastSchema);
