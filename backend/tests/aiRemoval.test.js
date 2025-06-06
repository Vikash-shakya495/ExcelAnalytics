const request = require('supertest');
const app = require('../index'); // Assuming your express app is exported from index.js

describe('AI Insights Removal Tests', () => {
  it('should return 404 for removed AI insights endpoint', async () => {
    const response = await request(app)
      .post('/api/ai/insights')
      .send({ data: [{ col1: 'value1' }] });
    expect(response.status).toBe(404);
  });
});
