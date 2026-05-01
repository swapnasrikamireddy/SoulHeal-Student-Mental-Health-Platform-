const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Student)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { counselorId, appointmentDate, timeSlot, type, reason } = req.body;

    const counselor = await User.findById(counselorId);
    if (!counselor || counselor.role !== 'counselor') {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }

    const appointment = await Appointment.create({
      studentId: req.user._id,
      counselorId,
      appointmentDate,
      timeSlot,
      type,
      reason,
    });

    const populated = await appointment.populate([
      { path: 'studentId', select: 'name email department' },
      { path: 'counselorId', select: 'name email specialization' },
    ]);

    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my appointments (student)
// @route   GET /api/appointments/my
// @access  Private (Student)
exports.getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ studentId: req.user._id })
      .populate('counselorId', 'name email specialization avatar')
      .sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get counselor's appointments
// @route   GET /api/appointments/counselor
// @access  Private (Counselor)
exports.getCounselorAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { counselorId: req.user._id };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('studentId', 'name email department gender')
      .sort({ appointmentDate: 1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
// @access  Private (Admin)
exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('studentId', 'name email')
      .populate('counselorId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Counselor, Admin)
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status, counselorNotes, meetingLink } = req.body;

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Counselors can only update their own appointments
    if (req.user.role === 'counselor' && appointment.counselorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, counselorNotes, meetingLink },
      { new: true, runValidators: true }
    ).populate([
      { path: 'studentId', select: 'name email' },
      { path: 'counselorId', select: 'name specialization' },
    ]);

    res.status(200).json({ success: true, message: 'Appointment updated', appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Student)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
};
