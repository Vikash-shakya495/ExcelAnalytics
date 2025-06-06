import { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';

const chartTypes = ['line', 'bar', 'pie', 'doughnut', 'radar'];

export default function ChartVisualization({ data, xColumn, yColumn }) {
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);

  useEffect(() => {
    chartInstances.current.forEach(chart => chart?.destroy());
    chartInstances.current = [];

    if (!xColumn || !yColumn) return;

    const labels = data.map((row) => row[xColumn]);
    const values = data.map((row) => Number(row[yColumn]) || 0);

    const colorPalette = [
      'rgba(99, 102, 241, 0.7)',    // Indigo
      'rgba(139, 92, 246, 0.7)',    // Purple
      'rgba(79, 70, 229, 0.7)',     // Blue
      'rgba(96, 165, 250, 0.7)',    // Sky Blue
      'rgba(147, 197, 253, 0.7)',   // Light Blue
      'rgba(203, 213, 225, 0.7)',   // Gray
    ];

    chartTypes.forEach((type, index) => {
      const ctx = chartRefs.current[index].getContext('2d');
      const chart = new Chart(ctx, {
        type,
        data: {
          labels,
          datasets: [
            {
              label: yColumn,
              data: values,
              backgroundColor: type === 'line' ? 'rgba(99, 102, 241, 0.5)' : colorPalette,
              borderColor: 'rgba(255,255,255,0.9)',
              borderWidth: 2,
              fill: type !== 'line',
              tension: 0.3,
              pointBackgroundColor: 'white',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: { color: '#e0e0ff', font: { size: 14, weight: 'bold' } },
            },
            tooltip: { enabled: true },
          },
          scales: type === 'pie' || type === 'doughnut' ? {} : {
            x: {
              title: { display: true, text: xColumn, color: '#d1d5db', font: { size: 14 } },
              ticks: { color: '#cbd5e1' },
              grid: { color: 'rgba(100,100,150,0.2)' },
            },
            y: {
              title: { display: true, text: yColumn, color: '#d1d5db', font: { size: 14 } },
              ticks: { color: '#cbd5e1' },
              grid: { color: 'rgba(100,100,150,0.2)' },
            },
          },
        },
      });
      chartInstances.current.push(chart);
    });
  }, [xColumn, yColumn, data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {chartTypes.map((type, index) => (
        <div key={type} className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-600">
          <h4 className="text-xl text-white mb-2 font-semibold capitalize">{type} Chart</h4>
          <canvas ref={(el) => (chartRefs.current[index] = el)} className="w-full h-80" />
        </div>
      ))}
    </div>
  );
}
