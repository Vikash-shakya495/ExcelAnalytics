import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import aiService from '../services/aiService';
import * as XLSX from 'xlsx';

function AIInsights({ insights, summary }) {
  return (
  <div className="mt-10 p-6 bg-gradient-to-br from-[#1a012e] to-[#10001d] rounded-2xl border border-purple-800 text-white max-w-3xl mx-auto shadow-lg backdrop-blur-md">
  <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text tracking-wide flex items-center gap-2">
    🤖 AI-Powered Insights
  </h4>

  <p className="text-sm text-purple-300 mb-6">
    Our intelligent data engine has processed your Excel file and extracted key insights based on the available patterns and trends.
    These insights are designed to help you make informed decisions and identify areas of improvement or opportunity.
  </p>

  <div className="bg-black/20 border border-purple-700 rounded-lg p-4 mb-6 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
    <h5 className="text-lg font-semibold text-purple-200 mb-2">🔍 Detailed Analysis:</h5>
    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-purple-100 font-mono">{insights}</pre>
  </div>

  <div className="bg-purple-900/10 border border-purple-700 rounded-lg p-4">
    <h5 className="text-lg font-semibold text-pink-400 mb-2">📝 Executive Summary:</h5>
    <p className="text-sm text-purple-100 leading-relaxed">{summary}</p>
  </div>

  <div className="mt-6 text-xs text-purple-400">
    <p>💡 Tip: Use this analysis as a starting point. You can explore further using chart visualizations in the "Chart Analysis" section.</p>
    <p>📊 Looking for patterns? Try plotting different X and Y axes to reveal more trends!</p>
  </div>
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
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

    try {
      // Parse Excel file client-side using SheetJS
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Pass parsed data to onUploadSuccess for chart visualization
      onUploadSuccess({ data: jsonData, originalname: file.name, _id: Date.now() });

      // Optionally upload file to backend for storage
      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);
      setError(null);
      setInsights('');
      setSummary('');

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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

      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <motion.div
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile && (droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.xlsx'))) {
            setFile(droppedFile);
            setError(null);
            setInsights('');
            setSummary('');
          } else {
            setError('Only .xls or .xlsx files are allowed.');
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.currentTarget.classList.add("ring", "ring-pink-500/70")}
        onDragLeave={(e) => e.currentTarget.classList.remove("ring", "ring-pink-500/70")}
        className="max-w-xl mx-auto bg-gradient-to-br from-[#1c013b] to-[#0e001f] border border-purple-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent tracking-wide flex items-center gap-2">
          📤 Upload Excel File
        </h3>

        <p className="text-sm text-purple-300 mb-6">
          Drag and drop your Excel file below or click to browse. We’ll analyze the data for AI insights and chart visualizations.
        </p>

        <label className="block mb-5 relative group">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div
            className="relative z-0 block w-full text-center py-10 px-4 text-sm text-purple-200 border-2 border-dashed border-purple-700 rounded-xl bg-purple-900/20
        hover:bg-purple-800/40 transition-all duration-300 cursor-pointer group-hover:border-pink-600"
          >
            📁 <span className="font-semibold">Click to upload</span> or drag & drop your Excel file here
          </div>
        </label>

        {error && (
          <p className="text-red-400 bg-red-900/20 border border-red-700 px-4 py-3 rounded-md text-sm mb-5">
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? '⏳ Uploading File...' : '🚀 Upload and Proceed'}
        </button>

        <div className="mt-6 text-xs text-purple-400">
          <p>✅ Supported formats: .xls, .xlsx</p>
          <p>📌 Max size: 5MB</p>
          <p>💡 Tip: Use clear column headers like <i>Month</i>, <i>Sales</i>, or <i>Revenue</i> for better AI analysis.</p>
        </div>
      </motion.div>



      {loadingInsights && (
        <div className="text-center mt-8 animate-pulse">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 px-5 py-3 rounded-xl shadow-lg border border-purple-800/40">
            <span className="text-white text-lg font-semibold tracking-wide">🔍 Generating AI Insights...</span>
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
          <p className="text-sm text-purple-300 mt-3 max-w-md mx-auto">
            Our AI is analyzing your data, extracting meaningful patterns, trends, and insights that could help you make smarter decisions. This may take a few seconds.
          </p>
        </div>

      )}

      {(insights || summary) && !loadingInsights && (
        <AIInsights insights={insights} summary={summary} />
      )}
    </>
  );
}
