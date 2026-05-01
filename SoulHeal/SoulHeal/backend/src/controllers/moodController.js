const Mood = require('../models/Mood');

// @desc    Create mood entry
// @route   POST /api/moods
// @access  Private (Student)
exports.createMood = async (req, res, next) => {
  try {
    const { mood, moodScore, notes, tags } = req.body;

    const moodEntry = await Mood.create({
      studentId: req.user._id,
      mood, moodScore, notes, tags,
    });

    res.status(201).json({ success: true, message: 'Mood logged successfully', mood: moodEntry });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all mood entries for student
// @route   GET /api/moods
// @access  Private (Student)
exports.getMyMoods = async (req, res, next) => {
  try {
    const { limit = 30, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const moods = await Mood.find({ studentId: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Mood.countDocuments({ studentId: req.user._id });

    res.status(200).json({ success: true, count: moods.length, total, moods });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single mood entry
// @route   GET /api/moods/:id
// @access  Private
exports.getMoodById = async (req, res, next) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) return res.status(404).json({ success: false, message: 'Mood entry not found' });

    if (req.user.role === 'student' && mood.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, mood });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mood entry
// @route   PUT /api/moods/:id
// @access  Private (Student)
exports.updateMood = async (req, res, next) => {
  try {
    let mood = await Mood.findById(req.params.id);
    if (!mood) return res.status(404).json({ success: false, message: 'Mood entry not found' });

    if (mood.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    mood = await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Mood updated', mood });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete mood entry
// @route   DELETE /api/moods/:id
// @access  Private (Student)
exports.deleteMood = async (req, res, next) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) return res.status(404).json({ success: false, message: 'Mood entry not found' });

    if (mood.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await mood.deleteOne();
    res.status(200).json({ success: true, message: 'Mood entry deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mood analytics for the logged-in student
// @route   GET /api/moods/analytics
// @access  Private (Student)
exports.getMoodAnalytics = async (req, res, next) => {
  try {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const moods = await Mood.find({
      studentId: req.user._id,
      date: { $gte: last30Days },
    }).sort({ date: 1 });

    const moodCounts = {};
    let totalScore = 0;

    moods.forEach((m) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      totalScore += m.moodScore;
    });

    const avgScore = moods.length > 0 ? (totalScore / moods.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalEntries: moods.length,
        averageScore: parseFloat(avgScore),
        moodCounts,
        recentMoods: moods.slice(-7),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get moods of a specific student (counselor/admin)
// @route   GET /api/moods/student/:studentId
// @access  Private (Counselor, Admin)
exports.getStudentMoods = async (req, res, next) => {
  try {
    const moods = await Mood.find({ studentId: req.params.studentId }).sort({ date: -1 }).limit(30);
    res.status(200).json({ success: true, moods });
  } catch (error) {
    next(error);
  }
};
