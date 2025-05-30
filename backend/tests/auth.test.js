const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/authRoutes');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use('/api', authRoutes);

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user', async () => {
      UserModel.findOne.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({
        toObject: () => ({ name: 'Test User', email: 'test@example.com', role: 'user' }),
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'user' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 400 if required fields missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if email already in use', async () => {
      UserModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'user' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      UserModel.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: '$2a$10$hashedpassword',
        toObject: () => ({ email: 'test@example.com' }),
      });
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mocktoken');
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 if email or password missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 if user not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 if password invalid', async () => {
      UserModel.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: '$2a$10$hashedpassword',
      });
      bcrypt.compareSync.mockReturnValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Additional tests for forgotPassword, verifyOtp, resetPassword, logout, profile can be added similarly
});
