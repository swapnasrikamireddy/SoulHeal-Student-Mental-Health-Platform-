const Assessment = require('../models/Assessment');

// Wellness-type assessments use positive-framed questions (low score = good)
const WELLNESS_TYPES = ['Sleep Quality', 'Emotional Balance', 'Focus & Productivity'];

// Score-to-result mapping — two separate tracks based on assessment category
const getResult = (percentage, isWellness) => {
  if (isWellness) {
    // Low score = answered positively = great wellness
    if (percentage <= 20) return 'Perfect';    // best
    if (percentage <= 40) return 'High';       // high wellness
    if (percentage <= 60) return 'Moderate';   // moderate wellness
    if (percentage <= 80) return 'Low';        // low wellness
    return 'Minimal';                          // minimal wellness (worst)
  }
  // Standard track (Stress, Anxiety, Depression) — high score = worse
  if (percentage <= 20) return 'Minimal';
  if (percentage <= 40) return 'Low';
  if (percentage <= 60) return 'Moderate';
  if (percentage <= 80) return 'High';
  return 'Severe';
};

const getRecommendations = (result, type) => {
  const isWellness = WELLNESS_TYPES.includes(type);

  if (isWellness) {
    const wellnessRecs = {
      Perfect: [
        'Excellent! Your wellness is in great shape',
        'Keep up your positive daily habits and routines',
        'Share your strategies — inspire those around you',
      ],
      High: [
        'Your wellness is strong — great work',
        'Continue practicing mindfulness for 10 minutes daily',
        'Maintain your current healthy routines',
      ],
      Moderate: [
        'Some areas could use a little more attention',
        'Try scheduled relaxation breaks during study sessions',
        'Consider joining a campus wellness workshop',
        'Book a counselor session for personalised tips',
      ],
      Low: [
        'Your wellness needs attention — take it seriously',
        'We recommend booking a counselor appointment soon',
        'Practice progressive muscle relaxation daily',
        'Reach out to a trusted friend or family member',
      ],
      Minimal: [
        'Your wellness is critically low — please seek help now',
        'Contact a counselor or helpline immediately',
        'Speak to a mental health professional as soon as possible',
        'You do not have to face this alone — support is available',
      ],
    };
    return wellnessRecs[result] || wellnessRecs.Moderate;
  }

  // Standard recommendations (Stress / Anxiety / Depression)
  const base = {
    Minimal: ['Keep maintaining your wellness routine', 'Practice daily gratitude journaling', 'Continue regular physical activity'],
    Low: ['Try 10-min daily mindfulness meditation', 'Maintain a sleep schedule', 'Talk to a friend or family member'],
    Moderate: ['Schedule regular breaks in your study routine', 'Try guided breathing exercises', 'Consider joining a wellness workshop', 'Book a counselor session for guidance'],
    High: ['We strongly recommend booking a counselor appointment', 'Practice progressive muscle relaxation', 'Reduce caffeine and improve sleep hygiene', 'Reach out to a trusted person in your life'],
    Severe: ['Please contact a counselor immediately', 'Reach out to our emergency helpline', 'Speak to a mental health professional', 'Do not face this alone — support is available'],
  };
  return base[result] || base.Minimal;
};

// @desc    Submit an assessment
// @route   POST /api/assessments
// @access  Private (Student)
exports.submitAssessment = async (req, res, next) => {
  try {
    const { assessmentType, answers } = req.body;

    const totalScore = answers.reduce((sum, a) => sum + a.answer, 0);
    const maxScore = answers.length * 4; // 0-4 scale per question
    const percentage = (totalScore / maxScore) * 100;
    const isWellness = WELLNESS_TYPES.includes(assessmentType);
    const result = getResult(percentage, isWellness);
    const recommendations = getRecommendations(result, assessmentType);

    const assessment = await Assessment.create({
      studentId: req.user._id,
      assessmentType,
      answers,
      score: totalScore,
      maxScore,
      result,
      recommendations,
    });

    res.status(201).json({ success: true, message: 'Assessment completed', assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assessments for logged-in student
// @route   GET /api/assessments
// @access  Private (Student)
exports.getMyAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ studentId: req.user._id }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, count: assessments.length, assessments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single assessment
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('studentId', 'name email');
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    if (req.user.role === 'student' && assessment.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Student)
exports.deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    if (assessment.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await assessment.deleteOne();
    res.status(200).json({ success: true, message: 'Assessment deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessments of a specific student (counselor/admin)
// @route   GET /api/assessments/student/:studentId
// @access  Private (Counselor, Admin)
exports.getStudentAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ studentId: req.params.studentId }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, assessments });
  } catch (error) {
    next(error);
  }
};
