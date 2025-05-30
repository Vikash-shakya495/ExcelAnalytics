import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ChartVisualization({ data }) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setColumns(Object.keys(data[0]));
      setXColumn('');
      setYColumn('');
    }
  }, [data]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (!xColumn || !yColumn) return;

    const ctx = chartRef.current.getContext('2d');
    const labels = data.map((row) => row[xColumn]);
    const values = data.map((row) => Number(row[yColumn]) || 0);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: yColumn,
            data: values,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: xColumn } },
          y: { title: { display: true, text: yColumn } },
        },
      },
    });
  }, [xColumn, yColumn, data]);

  const downloadPNG = () => {
    if (!chartRef.current) return;
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = chartRef.current.toDataURL('image/png');
    link.click();
  };

  const downloadPDF = () => {
    if (!chartRef.current) return;
    import('jspdf').then(jsPDF => {
      const pdf = new jsPDF.jsPDF();
      pdf.addImage(chartRef.current.toDataURL('image/png'), 'PNG', 10, 10, 180, 100);
      pdf.save('chart.pdf');
    });
  };

  return (
    <div className="p-4 border rounded shadow max-w-4xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">Chart Visualization</h3>
      {columns.length === 0 ? (
        <p>No data available for visualization.</p>
      ) : (
        <>
          <div className="flex space-x-4 mb-4">
            <div>
              <label htmlFor="xColumn" className="block font-medium mb-1">X Axis</label>
              <select
                id="xColumn"
                value={xColumn}
                onChange={(e) => setXColumn(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Select column</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="yColumn" className="block font-medium mb-1">Y Axis</label>
              <select
                id="yColumn"
                value={yColumn}
                onChange={(e) => setYColumn(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Select column</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4 space-x-4">
            <button
              onClick={downloadPNG}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download PNG
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
          <canvas ref={chartRef} />
        </>
      )}
    </div>
  );
}
