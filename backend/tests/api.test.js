const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const aiRoutes = require('../routes/aiRoutes');
const authRoutes = require('../routes/authRoutes');
const uploadRoutes = require('../routes/uploadRoutes');
const adminRoutes = require('../routes/adminRoutes');

// Mock the OpenAI client
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'Mocked AI insights response' } }],
            }),
          },
        },
      };
    }),
  };
});

const app = express();
app.use(bodyParser.json());
app.use('/api', aiRoutes);
app.use('/api', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api', adminRoutes);

describe('Backend API Endpoints with mocked OpenAI', () => {
  describe('POST /api/ai/insights', () => {
    it('should return 200 and mocked insights for valid data', async () => {
      const data = [
        { column1: 'value1', column2: 10 },
        { column1: 'value2', column2: 20 },
      ];
      const res = await request(app)
        .post('/api/ai/insights')
        .send({ data });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('insights');
      expect(res.body.insights).toBe('Mocked AI insights response');
    });

    it('should return 400 for empty data', async () => {
      const res = await request(app)
        .post('/api/ai/insights')
        .send({ data: [] });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing data', async () => {
      const res = await request(app)
        .post('/api/ai/insights')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Add tests for other API endpoints as needed
  // Example: authRoutes, uploadRoutes, adminRoutes

});
