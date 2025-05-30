import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import ExcelUpload from '../components/ExcelUpload';
import ChartVisualization from '../components/ChartVisualization';
import axios from 'axios';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [uploads, setUploads] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await axios.get('/api/upload/history', { withCredentials: true });
      console.log('Upload History Response:', res.data);


      // Ensure it's an array
      const data = Array.isArray(res.data) ? res.data : [];
      setUploads(data);

      if (data.length > 0) {
        setSelectedData(data[0].data);
      }
    } catch (err) {
      console.error('Failed to fetch upload history', err);
      setUploads([]); // Prevent `map` from crashing if fetch fails
    }
  };

  const handleUploadSuccess = (upload) => {
    setUploads((prev) => [upload, ...prev]);
    setSelectedData(upload.data);
  };

  const handleSelectUpload = (upload) => {
    setSelectedData(upload.data);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      {user && <p className="mb-4">Welcome, {user.name}!</p>}

      <ExcelUpload onUploadSuccess={handleUploadSuccess} />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Upload History</h3>
        {uploads.length === 0 ? (
          <p>No uploads yet.</p>
        ) : (
          <ul className="list-disc list-inside max-h-48 overflow-auto">
            {uploads.map((upload) => (
              <li
                key={upload._id}
                className="cursor-pointer hover:underline"
                onClick={() => handleSelectUpload(upload)}
              >
                {upload.originalname} - {new Date(upload.uploadDate).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ChartVisualization data={selectedData} />
    </div>
  );
}
