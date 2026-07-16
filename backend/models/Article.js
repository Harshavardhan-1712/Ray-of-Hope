const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Mental Health', 'Relationships', 'Life Transitions', 'Financial Stress'],
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    content: {
      type: String,
      default: '',
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Text index for full-text search
articleSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);
