import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyBk1eL_oZ6gGJNxIqZiwi3NDM3tW8vmhqE';  // Use env var
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';

const generateInsights = async (data) => {
  // Build prompt text from your data
  const columns = Object.keys(data[0]);
  const sampleRows = data.slice(0, 5);
  const prompt = `
You are a data analyst. Given the following table columns and data rows, extract:
- Key insights (bullet points)
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
...
`;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        prompt: {
          text: prompt
        },
        // Adjust parameters as needed, e.g., temperature, candidateCount
        temperature: 0.7,
        candidateCount: 1,
        maxOutputTokens: 512,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${GEMINI_API_KEY}`,
        },
      }
    );

    // The response structure varies, but typically:
    const text = response.data?.candidates?.[0]?.output || '';
    return text;

  } catch (error) {
    console.error('Gemini AI API error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  generateInsights,
};
