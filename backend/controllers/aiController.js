const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

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
    if (!error) {
      console.error('AI Insights Error: Unknown error');
      return res.status(500).json({ error: 'Failed to generate insights' });
    }
    console.error('AI Insights Error:', error);
    console.error('Error name:', error?.name || 'N/A');
    console.error('Error message:', error?.message || 'N/A');
    console.error('Error stack:', error?.stack || 'N/A');
    if (error.response) {
      console.error('OpenAI API response status:', error.response.status);
      console.error('OpenAI API response headers:', error.response.headers);
      console.error('OpenAI API response data:', error.response.data);
    } else {
      console.error('No response received from OpenAI API');
    }
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
