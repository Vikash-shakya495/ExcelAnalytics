const UserModel = require('../models/User');
const UploadModel = require('../models/Upload');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (e) {
    console.error('Get Users Error:', e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Delete user by ID (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) {
    console.error('Delete User Error:', e);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get usage statistics (admin only)
exports.getUsageStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalUploads = await UploadModel.countDocuments();
    const recentUploads = await UploadModel.find().sort({ uploadDate: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalUploads,
      recentUploads,
    });
  } catch (e) {
    console.error('Get Usage Stats Error:', e);
    res.status(500).json({ error: 'Failed to fetch usage statistics' });
  }
};
