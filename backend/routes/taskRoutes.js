const mongoose = require('mongoose');
const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// protect all task routes
router.use(protect);

// @route GET /api/tasks/analytics
// @desc Get analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({ user: userId, status: 'Done' });
    const pending = total - completed;
    
    // Explicitly cast to ObjectId for aggregation
    const priorityStats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId.toString()) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const priorities = { Low: 0, Medium: 0, High: 0 };
    priorityStats.forEach(stat => { priorities[stat._id] = stat.count; });
    
    res.json({
      total,
      completed,
      pending,
      priorities,
      completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100)
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks with filtering, search, sorting, and pagination
router.get('/', async (req, res, next) => {
  try {
    const { keyword, status, priority, sort, page = 1, limit = 10 } = req.query;
    let query = { user: req.user._id };
    
    // Filtering
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    // Search by title or description
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // Sorting
    let sortQuery = { createdAt: -1 }; // default sort by newest
    if (sort === 'dueDate_asc') sortQuery = { dueDate: 1 };
    if (sort === 'dueDate_desc') sortQuery = { dueDate: -1 };
    if (sort === 'priority_asc') sortQuery = { priority: 1 };
    if (sort === 'priority_desc') sortQuery = { priority: -1 };
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const tasks = await Task.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Task.countDocuments(query);
    
    res.json({
      tasks,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/tasks
// @desc    Create a task
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title || !description || !dueDate) {
      res.status(400);
      throw new Error('Please include title, description, and due date');
    }
    
    const task = await Task.create({
      title, description, status, priority, dueDate,
      user: req.user._id
    });
    
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this task');
    }
    
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this task');
    }
    
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
