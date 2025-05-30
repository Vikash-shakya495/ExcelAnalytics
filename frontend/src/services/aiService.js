import api from './api';

const generateInsights = async (data) => {
  try {
    const response = await api.post('/ai/insights', { data });
    return response.data.insights;
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
    throw error;
  }
};

export default {
  generateInsights,
};
