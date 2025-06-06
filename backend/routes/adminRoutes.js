const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/admin/users', adminMiddleware, adminController.getUsers);
router.delete('/admin/users/:id', adminMiddleware, adminController.deleteUser);
router.get('/admin/usage-stats', adminMiddleware, adminController.getUsageStats);

module.exports = router;
