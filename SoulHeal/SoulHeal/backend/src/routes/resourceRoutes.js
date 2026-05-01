const express = require('express');
const router = express.Router();
const {
  getResources, getResourceById, createResource, updateResource, deleteResource
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', authorize('admin'), createResource);
router.put('/:id', authorize('admin'), updateResource);
router.delete('/:id', authorize('admin'), deleteResource);

module.exports = router;
