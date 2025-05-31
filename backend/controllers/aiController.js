const { OpenAI } = require('openai');
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
    const columns = Object.keys(data[0]);
    const sampleRows = data.slice(0, 5);
    const prompt = `Analyze the following tabular data and provide key insights, trends, and observations, and a concise summary:\n\nColumns: ${columns.join(', ')}\nSample Data:\n${JSON.stringify(sampleRows, null, 2)}\n\nInsights:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [
        { role: 'system', content: 'You are a data analyst providing insights and summaries on datasets.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content.trim();

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
    console.error('AI Insights Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('OpenAI API response status:', error.response.status);
      console.error('OpenAI API response data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
