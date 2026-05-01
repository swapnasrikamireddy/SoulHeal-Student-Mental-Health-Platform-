const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessmentType: {
      type: String,
      enum: ['Stress Test', 'Anxiety Check', 'Depression Screening', 'Emotional Balance', 'Focus & Productivity', 'Sleep Quality'],
      required: true,
    },
    answers: [
      {
        question: String,
        answer: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      enum: ['Perfect', 'Minimal', 'Low', 'Moderate', 'High', 'Severe'],
      required: true,
    },
    recommendations: [{ type: String }],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
