import React, { useState, useEffect, useCallback } from 'react';
import ExcelUpload from '../components/ExcelUpload';
import ChartVisualization from '../components/ChartVisualization';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUpload, FiClock, FiBarChart2 } from 'react-icons/fi';
import geminiService from '../services/geminiService';

export default function UserDashboard() {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [error, setError] = useState(null);
  const [xAxisColumn, setXAxisColumn] = useState('');
  const [yAxisColumn, setYAxisColumn] = useState('');
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchUploadHistory = async () => {
    try {
      const res = await api.get('/upload/history', { withCredentials: true });
      setUploads(res.data);
      if (res.data.length > 0) {
        setSelectedUpload(res.data[0]);
      }
    } catch (err) {
      setError('⚠️ Failed to fetch upload history');
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  useEffect(() => {
    if (selectedUpload && selectedUpload.data && selectedUpload.data.length > 0) {
      const columns = Object.keys(selectedUpload.data[0]);
      if (columns.length >= 2) {
        setXAxisColumn(columns[0]);
        setYAxisColumn(columns[1]);
      }
    }
  }, [selectedUpload]);

  const generateInsights = useCallback(async (data) => {
    setLoadingInsights(true);
    setError(null);
    setInsights('');
    try {
      const text = await geminiService.generateInsights(data);
      setInsights(text || 'No insights generated.');
    } catch {
      setError('Failed to generate AI insights.');
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  const handleUploadSuccess = (upload) => {
    setUploads((prev) => [upload, ...prev]);
    setSelectedUpload(upload);
    generateInsights(upload.data); // Only generate insights here

    setTimeout(() => {
      const insightBlock = document.getElementById('ai-insights');
      if (insightBlock) {
        insightBlock.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-12">
      <motion.div
        className="mx-auto bg-black/90 backdrop-blur-[20px] rounded-3xl shadow-[0_0_60px_rgba(131,41,255,0.9)] border border-purple-900 p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <motion.h2
          className="flex items-center justify-center gap-4 text-5xl font-extrabold tracking-tight mb-14 bg-gradient-to-r from-purple-500 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent select-none"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FiBarChart2 className="text-purple-400 animate-pulse" />
          User Dashboard
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Upload Section */}
          <div className="flex-1 space-y-8">
            <motion.section
              className="bg-gradient-to-tr from-transparent to-[#1a0531] rounded-2xl shadow-xl p-10 border border-purple-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-purple-400 select-none">
                <FiUpload className="text-purple-500" />
                Upload Excel File
              </h3>
              <ExcelUpload onUploadSuccess={handleUploadSuccess} />
            </motion.section>
{/* {error && !loadingInsights && !insights && (
  <motion.p
    className="text-red-400 bg-red-900/70 border border-red-800 rounded-xl px-6 py-4 font-semibold shadow-lg select-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {error}
  </motion.p>
)} */}
          </div>

          {/* Upload History */}
          <div className="flex-1 space-y-8">
            <motion.section
              className="bg-gradient-to-tr from-[#12002b] to-[#2a0042] rounded-2xl shadow-xl p-10 border border-purple-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="flex items-center gap-3 mb-6 text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-600 to-indigo-500 bg-clip-text text-transparent select-none">
                <FiClock />
                Upload History
              </h3>

              {uploads.length === 0 ? (
                <p className="italic text-gray-500 select-none text-center py-12">
                  No uploads found yet.
                </p>
              ) : (
                <ul className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black divide-y divide-purple-800 border border-purple-800 rounded-xl bg-gradient-to-br from-black/80 to-black/90 shadow-inner">
                  {uploads.map((upload) => (
                    <li
                      key={upload._id}
                      onClick={() => setSelectedUpload(upload)}
                      className={`cursor-pointer px-6 py-5 flex justify-between items-center transition-colors duration-300 rounded-lg hover:bg-purple-800/70
                      ${selectedUpload && selectedUpload._id === upload._id
                          ? 'bg-purple-900/90 text-white font-semibold shadow-lg'
                          : 'text-purple-300'
                        }`}
                      title={`${upload.originalname} — ${new Date(upload.uploadDate).toLocaleString()}`}
                    >
                      <span className="truncate max-w-[65%]">📄 {upload.originalname}</span>
                      <time className="text-sm text-purple-500 whitespace-nowrap select-none">
                        {new Date(upload.uploadDate).toLocaleString()}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          </div>
        </div>

        {/* Chart Section */}
        {selectedUpload && selectedUpload.data && (
          <motion.section
            className="mt-16 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
          >
            <div className="grid md:grid-cols-2 gap-8 mb-10 rounded-3xl p-8 border border-purple-900 shadow-xl bg-gradient-to-r from-[#2e004d] via-[#4b007d] to-[#29002f]">
              <div>
                <label className="block mb-3 text-sm font-semibold text-purple-300 tracking-wide select-none">
                  X-Axis Column
                </label>
                <select
                  className="w-full bg-black/90 border border-purple-700 rounded-lg p-4 text-purple-200 font-medium focus:outline-none focus:ring-4 focus:ring-purple-600 transition"
                  value={xAxisColumn}
                  onChange={(e) => setXAxisColumn(e.target.value)}
                >
                  <option value="" className="text-gray-500">
                    -- Select --
                  </option>
                  {Object.keys(selectedUpload.data[0] || {}).map((col) => (
                    <option key={col} value={col} className="text-white">
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-3 text-sm font-semibold text-purple-300 tracking-wide select-none">
                  Y-Axis Column
                </label>
                <select
                  className="w-full bg-black/90 border border-purple-700 rounded-lg p-4 text-purple-200 font-medium focus:outline-none focus:ring-4 focus:ring-purple-600 transition"
                  value={yAxisColumn}
                  onChange={(e) => setYAxisColumn(e.target.value)}
                >
                  <option value="" className="text-gray-500">
                    -- Select --
                  </option>
                  {Object.keys(selectedUpload.data[0] || {}).map((col) => (
                    <option key={col} value={col} className="text-white">
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {xAxisColumn && yAxisColumn && (
              <div className="bg-gradient-to-br from-[#3c0055] via-[#3a0556] to-[#2a0033] rounded-3xl p-10 shadow-2xl border border-purple-800">
                <h3 className="text-4xl font-extrabold text-purple-300 mb-10 flex items-center gap-4 select-none drop-shadow-lg">
                  <FiBarChart2 className="text-purple-400 animate-pulse" />
                  Chart Visualization
                </h3>
                <ChartVisualization
                  data={selectedUpload.data}
                  xColumn={xAxisColumn}
                  yColumn={yAxisColumn}
                />
              </div>
            )}
          </motion.section>
        )}

        {/* AI Insights Section */}
        {insights && (
          <motion.section
            id="ai-insights"
            className="mt-16 bg-gradient-to-tr from-black/80 to-purple-950 p-10 border border-purple-900 rounded-2xl shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <h3 className="text-4xl font-extrabold text-purple-300 mb-6">AI Insights</h3>
            {loadingInsights ? (
              <p className="text-purple-400 italic">Generating insights...</p>
            ) : (
              <pre className="text-purple-100 whitespace-pre-wrap">{insights}</pre>
            )}
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
