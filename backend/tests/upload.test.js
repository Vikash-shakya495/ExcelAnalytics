const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const uploadRoutes = require('../routes/uploadRoutes');
const UploadModel = require('../models/Upload');

jest.mock('../models/Upload');

const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439011', role: 'user' };
  next();
};

jest.mock('../middleware/authMiddleware', () => {
  return () => mockAuthMiddleware;
});

const app = express();
app.use(bodyParser.json());
app.use('/api', uploadRoutes);

describe('Upload API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/upload', () => {
    it('should return 400 if no file uploaded', async () => {
      const res = await request(app)
        .post('/api/upload')
        .set('Content-Type', 'multipart/form-data')
        .send();
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    }, 10000);

    // Additional tests for valid file upload can be added with mocking multer and XLSX
  });

  describe('GET /api/upload/history', () => {
    it('should return 200 and upload history', async () => {
      UploadModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            { _id: '507f1f77bcf86cd799439011', filename: 'file1.xlsx', uploadDate: new Date() },
            { _id: '507f1f77bcf86cd799439012', filename: 'file2.xlsx', uploadDate: new Date() },
          ]),
        }),
      });

      const res = await request(app).get('/api/upload/history');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
