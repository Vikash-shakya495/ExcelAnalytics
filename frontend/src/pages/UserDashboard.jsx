import React, { useState, useEffect, useCallback } from 'react';
import ExcelUpload from '../components/ExcelUpload';
import ChartVisualization from '../components/ChartVisualization';
import ProfileUpdate from './ProfileUpdate';
import api from '../services/api';
import geminiService from '../services/geminiService';
import {
  FiUploadCloud,
  FiBarChart2,
  FiTrash2,
  FiActivity,
  FiFileText,
  FiUser,
} from 'react-icons/fi'
const SECTIONS = {
  UPLOAD_FILE: 'Upload File',
  UPLOAD_HISTORY: 'Upload History',
  AI_INSIGHTS: 'AI Insights',
  CHART_ANALYSIS: 'Chart Analysis',
  PROFILE_UPDATE: 'Profile Update',
};

const CHART_TYPES = {
  ALL: 'All',
  LINE: 'Line',
  BAR: 'Bar',
  PIE: 'Pie',
  DOUGHNUT: 'Doughnut',
  RADAR: 'Radar',
};

export default function UserDashboard() {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [error, setError] = useState(null);
  const [xAxisColumn, setXAxisColumn] = useState('');
  const [yAxisColumn, setYAxisColumn] = useState('');
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS.UPLOAD_HISTORY);
  const [selectedChartType, setSelectedChartType] = useState(CHART_TYPES.LINE);

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
    setActiveSection(SECTIONS.AI_INSIGHTS);
    generateInsights(upload.data);
  };

  const handleAIInsightsClick = async () => {
    if (!selectedUpload) {
      setInsights('Please select an upload from Upload History first.');
      setActiveSection(SECTIONS.AI_INSIGHTS);
      return;
    }
    setActiveSection(SECTIONS.AI_INSIGHTS);
    setLoadingInsights(true);
    setError(null);
    setInsights('');
    try {
      const text = await geminiService.generateInsights(selectedUpload.data);
      setInsights(text || 'No insights generated.');
    } catch {
      setError('Failed to generate AI insights.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const renderChartControls = () => {
    if (!selectedUpload || !selectedUpload.data || selectedUpload.data.length === 0) {
      return null;
    }
    const columns = Object.keys(selectedUpload.data[0]);
    return (
      <div className="mb-8 p-6 bg-gradient-to-br from-purple-800/60 to-purple-950/80 rounded-2xl border border-purple-700 shadow-2xl flex flex-wrap gap-8 items-end justify-evenly">
        <div className="flex flex-col min-w-[180px]">
          <label className="mb-2 text-sm text-purple-200 font-semibold tracking-wide">
            📊 X-Axis Column
          </label>
          <select
            className="bg-purple-900 text-purple-100 rounded-xl px-4 py-2 shadow-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            value={xAxisColumn}
            onChange={(e) => setXAxisColumn(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[180px]">
          <label className="mb-2 text-sm text-purple-200 font-semibold tracking-wide">
            📈 Y-Axis Column
          </label>
          <select
            className="bg-purple-900 text-purple-100 rounded-xl px-4 py-2 shadow-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            value={yAxisColumn}
            onChange={(e) => setYAxisColumn(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[180px]">
          <label className="mb-2 text-sm text-purple-200 font-semibold tracking-wide">
            📐 Chart Type
          </label>
          <select
            className="bg-purple-900 text-purple-100 rounded-xl px-4 py-2 shadow-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            aria-label="Select chart type"
          >
            <option value={CHART_TYPES.ALL}>All</option>
            <option value={CHART_TYPES.LINE}>Line</option>
            <option value={CHART_TYPES.BAR}>Bar</option>
            <option value={CHART_TYPES.PIE}>Pie</option>
            <option value={CHART_TYPES.DOUGHNUT}>Doughnut</option>
            <option value={CHART_TYPES.RADAR}>Radar</option>
          </select>
        </div>
      </div>

    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.UPLOAD_FILE:
        return <ExcelUpload onUploadSuccess={handleUploadSuccess} />;
      case SECTIONS.UPLOAD_HISTORY:
        return (
  

<>
  {uploads.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-purple-300">
      <FiFileText className="text-5xl mb-4 opacity-50" />
      <p className="text-lg font-semibold italic text-center select-none">
        No uploads found yet.<br />
        Start by uploading a file to explore insights!
      </p>
    </div>
  ) : (
    <ul className="overflow-y-auto max-h-[460px] rounded-xl border border-purple-800 shadow-inner scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-black bg-gradient-to-br from-purple-950/70 to-purple-900/80 divide-y divide-purple-800">
      {uploads.map((upload) => {
        const isSelected = selectedUpload && selectedUpload._id === upload._id;
        return (
          <li
            key={upload._id}
            className={`group px-5 py-4 flex justify-between items-center transition-all duration-300 cursor-pointer rounded-lg ${
              isSelected
                ? 'bg-purple-900/90 text-white font-semibold shadow-md shadow-purple-700'
                : 'text-purple-300 hover:bg-purple-800/40'
            }`}
            title={`Uploaded on ${new Date(upload.uploadDate).toLocaleString()}`}
            onClick={() => setSelectedUpload(upload)}
          >
            {/* File Info */}
            <div className="flex items-center gap-3 truncate max-w-[65%]">
              <FiFileText className="text-lg text-purple-400" />
              <span className="truncate">{upload.originalname}</span>
            </div>

            {/* Timestamp */}
            <time className="text-xs text-purple-500 whitespace-nowrap select-none font-mono">
              {new Date(upload.uploadDate).toLocaleString()}
            </time>

            {/* Delete Action */}
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this upload?')) {
                  try {
                    await import('../services/uploadService').then(mod => mod.default.deleteUpload(upload._id));
                    setUploads((prev) => prev.filter((u) => u._id !== upload._id));
                    if (isSelected) {
                      setSelectedUpload(null);
                      setInsights('');
                    }
                  } catch (error) {
                    alert('Failed to delete upload.');
                  }
                }
              }}
              className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-md transition-colors"
              title="Delete Upload"
            >
              <FiTrash2 />
            </button>
          </li>
        );
      })}
    </ul>
  )}
</>

        );
      case SECTIONS.AI_INSIGHTS:
        return (
          <div className="mt-10 max-w-4xl mx-auto bg-gradient-to-br from-[#12002b] to-[#1a003a] border border-purple-800/60 shadow-lg rounded-2xl p-6 text-white">
            {loadingInsights ? (
              <div className="text-center animate-pulse">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 px-6 py-3 rounded-xl border border-purple-700/50 shadow-md">
                  <span className="text-white text-base font-semibold tracking-wide">
                    🔍 Generating AI-powered insights…
                  </span>
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </div>
                <p className="text-purple-300 mt-3 text-sm">
                  Our AI is analyzing your data to extract patterns, trends, and actionable business insights. This may take a few seconds...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-sm">
                ❌ {error}
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-wide">
                  📊 AI-Generated Insights
                </h3>

                <div
                  id="ai-insights"
                  className="whitespace-pre-wrap text-sm leading-relaxed text-purple-100 bg-black/30 border border-purple-700/40 rounded-xl p-5 max-h-[500px] overflow-y-auto shadow-inner scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent font-mono"
                >
                  {insights}
                </div>

                <div className="mt-6 text-sm text-purple-400 border-t border-purple-800 pt-4">
                  <p>✅ Insights are based on the uploaded dataset and include key observations, patterns, and summary for decision-making.</p>
                  <p>💡 Tip: Try exploring different columns using the chart tools to dive deeper into trends or correlations.</p>
                </div>
              </>
            )}
          </div>

        );
      case SECTIONS.CHART_ANALYSIS:
        return (
          <div className="mt-10 max-w-6xl mx-auto bg-gradient-to-br from-[#100024] to-[#1c002e] rounded-2xl border border-purple-800/50 shadow-2xl backdrop-blur-xl p-8 text-white transition-all duration-300">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-500 to-indigo-400 bg-clip-text text-transparent tracking-wide">
              📊 Interactive Chart Analysis
            </h2>

            <p className="text-sm text-purple-300 mb-6">
              Visualize and explore your uploaded dataset by selecting different chart types and axis columns.
              These visual insights help you identify patterns, trends, and outliers at a glance.
              For best results, choose numerical columns for the Y-axis and categorical/time values for the X-axis.
            </p>

            {/* Chart Controls (Dropdowns) */}
            {renderChartControls()}

            {/* Conditional Chart Rendering */}
            {selectedUpload && selectedUpload.data && selectedUpload.data.length > 0 ? (
              <div className="bg-black/10 border border-purple-800/40 rounded-xl p-6 shadow-inner mt-6">
                <ChartVisualization
                  data={selectedUpload.data}
                  xColumn={xAxisColumn}
                  yColumn={yAxisColumn}
                  selectedChartType={selectedChartType}
                />
              </div>
            ) : (
              <div className="mt-8 text-center text-purple-300 italic border border-dashed border-purple-700 py-8 rounded-xl bg-purple-900/10">
                ⚠️ No data available to visualize. Please upload a file and ensure it contains valid rows and columns.
              </div>
            )}

            {/* Tips / Footer */}
            <div className="mt-8 border-t border-purple-700 pt-5 text-xs text-purple-400">
              <p>💡 Tip: Combine chart analysis with the AI Insights section to get both visual and textual interpretations of your data.</p>
              <p>📌 You can switch between chart types (Bar, Line, Pie, etc.) to explore different perspectives of your dataset.</p>
            </div>
          </div>

        );
      case SECTIONS.PROFILE_UPDATE:
        return <ProfileUpdate />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-purple-950 via-black to-purple-950 text-white font-sans flex">
      {/* Sidebar */}
      <nav className="w-64 bg-gradient-to-tr from-[#0e0023] to-[#26004a] p-6 border-r border-purple-900 shadow-2xl backdrop-blur-md flex flex-col">
        <h1 className="text-3xl font-extrabold mb-10 bg-gradient-to-r from-purple-400 via-pink-600 to-indigo-500 bg-clip-text text-transparent select-none text-center">
          📊 Dashboard
        </h1>

        {[
          { label: 'Upload History', icon: <FiFileText />, section: SECTIONS.UPLOAD_HISTORY },
          { label: 'Upload File', icon: <FiUploadCloud />, section: SECTIONS.UPLOAD_FILE },
          { label: 'AI Insights', icon: <FiActivity />, section: SECTIONS.AI_INSIGHTS, onClick: handleAIInsightsClick },
          { label: 'Chart Analysis', icon: <FiBarChart2 />, section: SECTIONS.CHART_ANALYSIS },
          { label: 'Profile Update', icon: <FiUser />, section: SECTIONS.PROFILE_UPDATE },
        ].map(({ label, icon, section, onClick }) => (
          <button
            key={label}
            onClick={() => (onClick ? onClick() : setActiveSection(section))}
            className={`group relative flex items-center gap-3 mb-4 px-4 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 
          ${activeSection === section
                ? 'bg-gradient-to-r from-purple-800 to-pink-700 text-white shadow-lg scale-[1.03]'
                : 'text-purple-300 hover:text-white hover:bg-purple-700/40 hover:scale-[1.02]'
              }`}
          >
            <span className="text-lg">{icon}</span>
            {label}

            {activeSection === section && (
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 h-4 w-1.5 bg-pink-500 rounded-r-lg animate-pulse"></span>
            )}
          </button>
        ))}

        <div className="mt-auto text-xs text-purple-500 text-center pt-6 border-t border-purple-800 opacity-60">
          © {new Date().getFullYear()} YourApp. All rights reserved.
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-auto animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
}
