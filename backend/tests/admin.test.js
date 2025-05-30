const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('../routes/adminRoutes');
const UserModel = require('../models/User');
const UploadModel = require('../models/Upload');

jest.mock('../models/User');
jest.mock('../models/Upload');

const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439011', role: 'admin' };
  next();
};

jest.mock('../middleware/authMiddleware', () => {
  return mockAuthMiddleware;
});

const app = express();
app.use(bodyParser.json());
app.use('/api', adminRoutes);

describe('Admin API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/users', () => {
    it('should return 200 and list of users', async () => {
      UserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([
          { _id: '507f1f77bcf86cd799439011', name: 'User1', email: 'user1@example.com' },
          { _id: '507f1f77bcf86cd799439012', name: 'User2', email: 'user2@example.com' },
        ]),
      });

      const res = await request(app).get('/api/admin/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should return 200 on successful deletion', async () => {
      UserModel.findByIdAndDelete.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });

      const res = await request(app).delete('/api/admin/users/507f1f77bcf86cd799439011');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/admin/usage-stats', () => {
    it('should return 200 and usage stats', async () => {
      UserModel.countDocuments.mockResolvedValue(10);
      UploadModel.countDocuments.mockResolvedValue(5);
      UploadModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            { _id: '507f1f77bcf86cd799439011', filename: 'file1.xlsx', uploadDate: new Date() },
            { _id: '507f1f77bcf86cd799439012', filename: 'file2.xlsx', uploadDate: new Date() },
          ]),
        }),
      });

      const res = await request(app).get('/api/admin/usage-stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalUsers', 10);
      expect(res.body).toHaveProperty('totalUploads', 5);
      expect(Array.isArray(res.body.recentUploads)).toBe(true);
    });
  });
});
