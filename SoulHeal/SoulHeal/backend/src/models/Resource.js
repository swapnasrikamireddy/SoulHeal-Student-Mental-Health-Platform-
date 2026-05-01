const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Meditation', 'Breathing Exercise', 'Article', 'Video', 'Helpline', 'Stress Management', 'Motivation', 'Sleep', 'Journaling'],
      required: true,
    },
    content: {
      type: String,
    },
    url: {
      type: String,
    },
    duration: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    tags: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
