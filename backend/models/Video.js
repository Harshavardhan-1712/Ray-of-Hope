const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    videoId: {
      type: String,
      required: [true, 'YouTube video ID is required'],
      trim: true,
    },
    youtubeLink: {
      type: String,
      default: function () {
        return `https://www.youtube.com/watch?v=${this.videoId}`;
      },
    },
    thumbnail: {
      type: String,
      default: function () {
        return `https://img.youtube.com/vi/${this.videoId}/hqdefault.jpg`;
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Therapy Techniques', 'Expert Interviews', 'Motivational Stories'],
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', videoSchema);
