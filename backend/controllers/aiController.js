const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateInsights = async (req, res) => {
  const { data } = req.body;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty data for insights' });
  }

  try {
    // Prepare a prompt summarizing the data columns and sample rows
    const columns = Object.keys(data[0]);
    const sampleRows = data.slice(0, 5);
    const prompt = `Analyze the following tabular data and provide key insights, trends, and observations:\n\nColumns: ${columns.join(', ')}\nSample Data:\n${JSON.stringify(sampleRows, null, 2)}\n\nInsights:`;

    const completion = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    const insights = completion.choices[0].text.trim();

    res.status(200).json({ insights });
  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
