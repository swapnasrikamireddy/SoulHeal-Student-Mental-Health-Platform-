const Resource = require('../models/Resource');

// @desc    Get all active resources
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single resource
// @route   GET /api/resources/:id
// @access  Private
exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private (Admin)
exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Resource created', resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private (Admin)
exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, message: 'Resource updated', resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};
