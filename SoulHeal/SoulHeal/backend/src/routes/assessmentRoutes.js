const express = require('express');
const router = express.Router();
const {
  submitAssessment, getMyAssessments, getAssessmentById, deleteAssessment, getStudentAssessments
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student'), submitAssessment);
router.get('/', authorize('student'), getMyAssessments);
router.get('/student/:studentId', authorize('counselor', 'admin'), getStudentAssessments);
router.get('/:id', getAssessmentById);
router.delete('/:id', authorize('student'), deleteAssessment);

module.exports = router;
