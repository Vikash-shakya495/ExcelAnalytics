import React, { useState, useEffect, useCallback } from 'react';
import ExcelUpload from '../components/ExcelUpload';
import ChartVisualization from '../components/ChartVisualization';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUpload, FiClock, FiBarChart2, FiChevronRight } from 'react-icons/fi';
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
    generateInsights(upload.data);

    setTimeout(() => {
      const insightBlock = document.getElementById('ai-insights');
      if (insightBlock) {
        insightBlock.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 text-white px-8 py-14 font-sans">
      <motion.div
        className="mx-auto  rounded-3xl bg-transparent/60 backdrop-blur-xl  shadow-[0_0_40px_rgba(159,63,255,0.8)] p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.header
          className="flex items-center justify-center gap-4 mb-16 select-none"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FiBarChart2 className="text-6xl text-purple-500 animate-pulse" />
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
            User Dashboard
          </h1>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Upload Section */}
          <motion.section
            className="flex-1 bg-gradient-to-tr from-black/60 to-[#1a0330] rounded-3xl p-10 border border-purple-900 shadow-lg shadow-purple-800/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="flex items-center gap-4 mb-8 text-3xl font-bold text-purple-400 select-none">
              <FiUpload className="text-purple-500" />
              Upload Excel File
            </h2>

            <ExcelUpload onUploadSuccess={handleUploadSuccess} />

            {/* {error && (
              <p className="mt-6 bg-red-900/70 border border-red-800 rounded-xl px-6 py-3 font-semibold text-red-400 shadow-md">
                {error}
              </p>
            )} */}
          </motion.section>

          {/* Upload History Sidebar */}
          <motion.aside
            className="w-full lg:w-1/2 bg-gradient-to-tr from-[#0e0023] to-[#26004a] rounded-3xl p-6 border border-purple-900 shadow-xl backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="flex items-center gap-3 mb-6 text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-600 to-indigo-500 bg-clip-text text-transparent select-none">
              <FiClock />
              Upload History
            </h2>

            {uploads.length === 0 ? (
              <p className="italic text-gray-500 text-center py-16 select-none">
                No uploads found yet.
              </p>
            ) : (
              <ul className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black divide-y divide-purple-800 rounded-lg border border-purple-800 bg-black/70 shadow-inner">
                {uploads.map((upload) => (
                  <li
                    key={upload._id}
                    onClick={() => setSelectedUpload(upload)}
                    className={`cursor-pointer px-6 py-4 flex justify-between items-center transition-colors duration-300 rounded-lg hover:bg-purple-800/80
                      ${
                        selectedUpload && selectedUpload._id === upload._id
                          ? 'bg-purple-900/90 text-white font-semibold shadow-lg shadow-purple-700'
                          : 'text-purple-300'
                      }`}
                    title={`${upload.originalname} — ${new Date(upload.uploadDate).toLocaleString()}`}
                  >
                    <div className="flex items-center gap-2 truncate max-w-[70%]">
                      <span>📄</span>
                      <span className="truncate">{upload.originalname}</span>
                    </div>
                    <time className="text-sm text-purple-500 whitespace-nowrap select-none">
                      {new Date(upload.uploadDate).toLocaleString()}
                    </time>
                    <FiChevronRight
                      className={`ml-4 transition-transform ${
                        selectedUpload && selectedUpload._id === upload._id ? 'rotate-90 text-purple-400' : 'text-purple-600'
                      }`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </motion.aside>
        </div>

        {/* Chart & Controls */}
        {selectedUpload && selectedUpload.data && (
          <motion.section
            className="mt-20  mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-10 p-8 bg-gradient-to-r from-[#2f004d] via-[#0b030f] to-[#28004b] rounded-3xl border border-purple-900 shadow-2xl shadow-purple-900/70">
              {/* X-Axis Selector */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-purple-300 tracking-wide select-none">
                  X-Axis Column
                </label>
                <select
                  className="w-full bg-black/80 border border-purple-700 rounded-lg p-4 text-purple-200 font-semibold focus:outline-none focus:ring-4 focus:ring-purple-600 transition"
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

              {/* Y-Axis Selector */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-purple-300 tracking-wide select-none">
                  Y-Axis Column
                </label>
                <select
                  className="w-full bg-black/80 border border-purple-700 rounded-lg p-4 text-purple-200 font-semibold focus:outline-none focus:ring-4 focus:ring-purple-600 transition"
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

            {/* Chart Visualization */}
            {xAxisColumn && yAxisColumn && (
              <div className="mt-12 bg-gradient-to-br  rounded-3xl  ">
                <h3 className="text-4xl font-extrabold text-purple-300 mb-12 flex items-center gap-5 select-none drop-shadow-lg">
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
            className="mt-20 max-w-5xl mx-auto bg-gradient-to-tr from-black/70 to-purple-950 p-12 border border-purple-900 rounded-3xl shadow-2xl shadow-purple-900/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <h3 className="text-4xl font-extrabold text-purple-300 mb-8 select-none drop-shadow-md">
              AI Insights
            </h3>
            {loadingInsights ? (
              <p className="text-purple-400 italic">Generating insights...</p>
            ) : (
              <pre
                className="text-purple-100 whitespace-pre-wrap max-h-96 overflow-y-auto px-6 py-4 rounded-lg border border-purple-700 bg-black/50 shadow-inner scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent"
                style={{ fontFamily: "'Fira Mono', monospace" }}
              >
                {insights}
              </pre>
            )}
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
