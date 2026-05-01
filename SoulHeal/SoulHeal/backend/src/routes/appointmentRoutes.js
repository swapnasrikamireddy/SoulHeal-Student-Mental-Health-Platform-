const express = require('express');
const router = express.Router();
const {
  bookAppointment, getMyAppointments, getCounselorAppointments, getAllAppointments,
  updateAppointment, cancelAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student'), bookAppointment);
router.get('/my', authorize('student'), getMyAppointments);
router.get('/counselor', authorize('counselor'), getCounselorAppointments);
router.get('/', authorize('admin'), getAllAppointments);
router.put('/:id', authorize('counselor', 'admin'), updateAppointment);
router.delete('/:id', authorize('student'), cancelAppointment);

module.exports = router;
