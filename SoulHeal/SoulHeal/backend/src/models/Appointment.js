const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    type: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Chat'],
      default: 'Virtual',
    },
    reason: {
      type: String,
      maxlength: [300, 'Reason cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    counselorNotes: {
      type: String,
      maxlength: [1000],
    },
    meetingLink: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
