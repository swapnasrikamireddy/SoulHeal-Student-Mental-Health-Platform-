const User = require('../models/User');
const Mood = require('../models/Mood');
const Assessment = require('../models/Assessment');
const Appointment = require('../models/Appointment');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all counselors (public for students to view)
// @route   GET /api/admin/counselors
// @access  Private
exports.getCounselors = async (req, res, next) => {
  try {
    const counselors = await User.find({ role: 'counselor', isActive: true })
      .select('name email specialization bio availability avatar');
    res.status(200).json({ success: true, count: counselors.length, counselors });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const [totalStudents, totalCounselors, totalMoods, totalAssessments, totalAppointments,
      pendingAppointments, completedAppointments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'counselor' }),
      Mood.countDocuments(),
      Assessment.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Completed' }),
    ]);

    // Recent registrations (last 7 days)
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({ createdAt: { $gte: last7Days } });

    // Assessment result distribution
    const assessmentDistribution = await Assessment.aggregate([
      { $group: { _id: '$result', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalStudents, totalCounselors, totalMoods, totalAssessments,
        totalAppointments, pendingAppointments, completedAppointments,
        recentRegistrations, assessmentDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
