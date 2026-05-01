const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['Happy', 'Calm', 'Anxious', 'Sad', 'Stressed', 'Angry', 'Overwhelmed', 'Motivated', 'Lonely', 'Hopeful'],
      required: [true, 'Mood is required'],
    },
    moodScore: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mood', moodSchema);
