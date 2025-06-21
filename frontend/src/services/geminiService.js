import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const generateInsights = async (data) => {
  const columns = Object.keys(data[0]);
  const sampleRows = data.slice(0, 5);
const prompt = `
You are an expert data analyst and business consultant.

Given the table's **column names** and **first 5 rows**, analyze the dataset and generate insights with a human-friendly tone.

Focus on the following:

1. 📌 **Key Observations**: Mention trends, outliers, or correlations. Use bullet points.
2. 📊 **Data Patterns**: Highlight patterns (e.g., rising/falling values, common ranges, seasonal trends).
3. 🧠 **AI Summary**: Write a clear 2-3 sentence executive summary, assuming this will be read by business users or decision-makers.
4. 💡 **Suggestions** *(optional)*: If you find meaningful insights, suggest what actions might be taken based on them.

**Columns**: ${columns.join(', ')}

**Sample Data (first 5 rows)**:
${JSON.stringify(sampleRows, null, 2)}

👉 Please format the output clearly in sections like:
---
Insights:
- ...
- ...
---
Patterns:
- ...
---
Summary:
...
---
Suggestions:
- ...
`;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return content;

  } catch (error) {
    console.error('Gemini AI API error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  generateInsights,
};
