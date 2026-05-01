const express = require('express');
const router = express.Router();
const {
  createMood, getMyMoods, getMoodById, updateMood, deleteMood, getMoodAnalytics, getStudentMoods
} = require('../controllers/moodController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student'), createMood);
router.get('/', authorize('student'), getMyMoods);
router.get('/analytics', authorize('student'), getMoodAnalytics);
router.get('/student/:studentId', authorize('counselor', 'admin'), getStudentMoods);
router.get('/:id', getMoodById);
router.put('/:id', authorize('student'), updateMood);
router.delete('/:id', authorize('student'), deleteMood);

module.exports = router;
