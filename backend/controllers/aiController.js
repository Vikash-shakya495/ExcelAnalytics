const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

exports.generateInsights = async (req, res) => {
  const { data } = req.body;

  if (!data.every(row => typeof row === 'object' && !Array.isArray(row))) {
    return res.status(400).json({ error: 'Each data entry must be an object (a row)' });
  }

  try {
    const columns = Object.keys(data[0]);
    const sampleRows = data.slice(0, 5);
    const prompt = `
You are a data analyst. Given the following table columns and data rows, extract:
- Key insights (bullet points if possible)
- Observable trends
- A brief summary (under 3 sentences)

Columns: ${columns.join(', ')}

Sample Data (first 5 rows):
${JSON.stringify(sampleRows, null, 2)}

Provide output in the following format:
Insights:
- ...
- ...

Summary:
...`;

    console.log('Sending request to Gemini API with prompt:', prompt);

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      // {
      //   headers: {
      //     Authorization: `Bearer ${GEMINI_API_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   timeout: 10000, // 10 seconds timeout
      // }
    );

    console.log('Received response from Gemini API:', response.data);

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Separate insights and summary
    const insightsSeparator = content.indexOf('Summary:');
    let insights = content;
    let summary = '';

    if (insightsSeparator !== -1) {
      insights = content.substring(0, insightsSeparator).trim();
      summary = content.substring(insightsSeparator + 'Summary:'.length).trim();
    }

    res.status(200).json({ insights, summary });
  } catch (error) {
    console.error('Gemini AI Insights Error:', error);
    if (error.response) {
      console.error('Gemini API response status:', error.response.status);
      console.error('Gemini API response headers:', error.response.headers);
      console.error('Gemini API response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from Gemini API, request made:', error.request);
    } else {
      console.error('Error setting up Gemini API request:', error.message);
    }
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
