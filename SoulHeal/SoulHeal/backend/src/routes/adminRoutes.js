const express = require('express');
const router = express.Router();
const {
  getAllUsers, getCounselors, toggleUserStatus, deleteUser, getAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/counselors', getCounselors); // Any authenticated user
router.get('/users', authorize('admin'), getAllUsers);
router.put('/users/:id/toggle-status', authorize('admin'), toggleUserStatus);
router.delete('/users/:id', authorize('admin'), deleteUser);
router.get('/analytics', authorize('admin'), getAnalytics);

module.exports = router;
