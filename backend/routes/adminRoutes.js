const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

router.get('/admin/users', authMiddleware, adminOnly, adminController.getUsers);
router.delete('/admin/users/:id', authMiddleware, adminOnly, adminController.deleteUser);
router.get('/admin/usage-stats', authMiddleware, adminOnly, adminController.getUsageStats);

module.exports = router;
