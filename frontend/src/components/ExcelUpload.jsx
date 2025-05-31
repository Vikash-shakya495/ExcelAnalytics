import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import aiService from '../services/aiService';

export default function ExcelUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState('');
  const [summary, setSummary] = useState('');
  const user = useAuthStore((state) => state.user);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setInsights('');
    setSummary('');
  };

  const handleUpload = async () => {
    if (!user) {
      setError('You must be logged in to upload files.');
      return;
    }
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);
    setInsights('');
    setSummary('');

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data.upload);
      setFile(null);

      // Assuming response.data.upload contains the parsed data array for AI insights
      const dataForAI = response.data.upload?.data || [];
      if (dataForAI.length > 0) {
        const aiData = await aiService.generateInsights(dataForAI);
        setInsights(aiData.insights);
        setSummary(aiData.summary);
      } else {
        setInsights('No data available for AI insights.');
        setSummary('No data available for summary.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Upload Excel File</h3>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {insights && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">AI Insights</h4>
          <pre className="whitespace-pre-wrap">{insights}</pre>
        </div>
      )}
      {summary && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Summary</h4>
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
    </div>
  );
}
