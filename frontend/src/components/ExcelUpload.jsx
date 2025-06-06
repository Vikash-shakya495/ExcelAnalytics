import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import aiService from '../services/aiService';

function AIInsights({ insights, summary }) {
  return (
    <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20 text-white max-w-lg mx-auto">
      <h4 className="text-xl font-semibold mb-2">🤖 AI Generated Insights</h4>
      <pre className="whitespace-pre-wrap text-sm mb-4">{insights}</pre>
      <h4 className="text-xl font-semibold mb-2">📝 Summary</h4>
      <p className="text-sm">{summary}</p>
    </div>
  );
}

export default function ExcelUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
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

      // After successful upload, generate AI insights
      if (response.data.upload && response.data.upload.data) {
        setLoadingInsights(true);
        try {
          const aiResponse = await aiService.generateInsights(response.data.upload.data);
          setInsights(aiResponse.insights);
          setSummary(aiResponse.summary);
        } catch (aiError) {
          setError('Failed to generate AI insights.');
        } finally {
          setLoadingInsights(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <motion.div
        className="max-w-lg mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">📤 Upload Excel File</h3>

        <label className="block mb-4">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white
            hover:file:from-blue-700 hover:file:to-indigo-700"
          />
        </label>

        {error && (
          <p className="text-red-400 bg-red-900/20 border border-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50"
        >
          {uploading ? '⏳ Uploading...' : '🚀 Upload'}
        </button>
      </motion.div>

      {loadingInsights && (
        <p className="text-center text-white mt-4">Generating AI insights...</p>
      )}

      {(insights || summary) && !loadingInsights && (
        <AIInsights insights={insights} summary={summary} />
      )}
    </>
  );
}
