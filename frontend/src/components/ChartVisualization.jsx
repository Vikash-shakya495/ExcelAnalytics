import { useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";

const chartTypes = ["line", "bar", "pie", "doughnut", "radar"];

// Utility to calculate stats for dataset
const calculateStats = (values) => {
  if (values.length === 0) return {};
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { sum, avg, min, max };
};

export default function ChartVisualization({ data, xColumn, yColumn, selectedChartType = "All" }) {
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);

  // Precompute stats
  const stats = useMemo(() => {
    const vals = data.map((row) => Number(row[yColumn]) || 0);
    return calculateStats(vals);
  }, [data, yColumn]);

  useEffect(() => {
    // Cleanup previous charts
    chartInstances.current.forEach((chart) => chart?.destroy());
    chartInstances.current = [];

    if (!xColumn || !yColumn) return;

    const labels = data.map((row) => row[xColumn]);
    const values = data.map((row) => Number(row[yColumn]) || 0);

    // Custom palette with neon colors
    const colorPalette = [
      "#7C3AED", // Purple
      "#4F46E5", // Indigo
      "#2563EB", // Blue
      "#14B8A6", // Teal
      "#22D3EE", // Cyan
      "#F43F5E", // Pink
      "#FBBF24", // Amber
    ];

    // Determine which chart types to render
    const typesToRender =
      selectedChartType === "All" ? chartTypes : [selectedChartType.toLowerCase()];

    typesToRender.forEach((type, index) => {
      const ctx = chartRefs.current[index].getContext("2d");

      // Dataset config depending on chart type
      const dataset = {
        label: yColumn,
        data: values,
        borderColor: colorPalette[index % colorPalette.length],
        borderWidth: 3,
        fill: type !== "line",
        tension: 0.4,
        pointBackgroundColor: "#111827",
        pointRadius: 6,
        pointHoverRadius: 8,
        backgroundColor:
          type === "line"
            ? colorPalette[index % colorPalette.length] + "80"
            : colorPalette,
        hoverBorderColor: "#fff",
      };

      // Special config for pie/doughnut
      if (type === "pie" || type === "doughnut") {
        dataset.backgroundColor = colorPalette.slice(0, values.length);
        dataset.borderColor = "#111827";
        dataset.borderWidth = 2;
      }

      const chart = new Chart(ctx, {
        type,
        data: {
          labels,
          datasets: [dataset],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1500,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: {
              display: false, // We'll build custom legend
            },
            tooltip: {
              enabled: true,
              backgroundColor: "#7C3AED",
              titleFont: { weight: "bold", size: 16 },
              bodyFont: { size: 14 },
              padding: 12,
              cornerRadius: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 4,
              shadowBlur: 12,
              shadowColor: "rgba(124, 58, 237, 0.8)",
              displayColors: false,
            },
          },
          scales:
            type === "pie" || type === "doughnut"
              ? {}
              : {
                  x: {
                    title: {
                      display: true,
                      text: xColumn,
                      color: "#C4B5FD",
                      font: { size: 16, weight: "600" },
                    },
                    ticks: {
                      color: "#DDD6FE",
                      maxRotation: 45,
                      minRotation: 45,
                      autoSkip: true,
                      maxTicksLimit: 10,
                    },
                    grid: {
                      color: "rgba(124, 58, 237, 0.15)",
                      borderDash: [6, 4],
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: yColumn,
                      color: "#C4B5FD",
                      font: { size: 16, weight: "600" },
                    },
                    ticks: {
                      color: "#DDD6FE",
                      beginAtZero: true,
                    },
                    grid: {
                      color: "rgba(124, 58, 237, 0.15)",
                      borderDash: [6, 4],
                    },
                  },
                },
        },
      });

      chartInstances.current.push(chart);
    });
  }, [xColumn, yColumn, data, selectedChartType]);

  // Custom legend component
  const CustomLegend = ({ labels, colors }) => (
    <div className="flex flex-wrap gap-3 mt-4">
      {labels.map((label, i) => (
        <div
          key={label}
          className="flex items-center space-x-2 cursor-default select-none"
        >
          <div
            style={{ backgroundColor: colors[i % colors.length] }}
            className="w-5 h-5 rounded-full shadow-neon"
          />
          <span className="text-gray-200 font-semibold text-sm">{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-8">
      {selectedChartType === "All"
        ? chartTypes.map((type, idx) => {
            const chartTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;

            return (
              <section
                key={type}
                className="bg-gradient-to-tr from-purple-950 via-indigo-950 to-black
              rounded-3xl p-8 shadow-xl border border-purple-700
              hover:scale-[1.04] transition-transform duration-300 ease-in-out
              cursor-pointer"
              >
                <header className="flex items-center justify-between mb-4">
                  <h3
                    className="text-3xl font-extrabold text-transparent bg-clip-text
                bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-lg select-none"
                  >
                    {chartTitle}
                  </h3>
                  <div
                    className="text-purple-300 font-semibold italic select-none text-sm"
                    title="Dataset statistics"
                  >
                    <span>Sum: {stats.sum.toFixed(1)}</span> |{" "}
                    <span>Avg: {stats.avg.toFixed(2)}</span> |{" "}
                    <span>Min: {stats.min}</span> | <span>Max: {stats.max}</span>
                  </div>
                </header>

                <canvas
                  ref={(el) => (chartRefs.current[idx] = el)}
                  className="w-full h-96 rounded-xl shadow-neon-glow bg-gradient-to-br
                from-purple-950 via-indigo-950 to-black"
                />

                {/* Show custom legend only for pie/doughnut */}
                {(type === "pie" || type === "doughnut") && (
                  <CustomLegend
                    labels={data.map((row) => row[xColumn])}
                    colors={[
                      "#7C3AED",
                      "#4F46E5",
                      "#2563EB",
                      "#14B8A6",
                      "#22D3EE",
                      "#F43F5E",
                      "#FBBF24",
                    ]}
                  />
                )}

                {/* Description based on chart type */}
                <p
                  className="mt-6 text-purple-300 text-sm tracking-wide leading-relaxed select-none"
                  style={{ userSelect: "none" }}
                >
                  {type === "line" &&
                    "A smooth line chart showing trends over your data range."}
                  {type === "bar" &&
                    "Vertical bars representing your data points with neon highlights."}
                  {type === "pie" &&
                    "Slices illustrating proportions of your dataset with vibrant colors."}
                  {type === "doughnut" &&
                    "Donut chart emphasizing part-to-whole relationships."}
                  {type === "radar" &&
                    "Radar chart visualizing multivariate data across multiple dimensions."}
                </p>
              </section>
            );
          })
        : (() => {
            const type = selectedChartType.toLowerCase();
            const idx = chartTypes.indexOf(type);
            if (idx === -1) return null;
            const chartTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
            return (
              <section
                key={type}
                className="bg-gradient-to-tr from-purple-950 via-indigo-950 to-black
              rounded-3xl p-8 shadow-xl border border-purple-700
              hover:scale-[1.04] transition-transform duration-300 ease-in-out
              cursor-pointer"
              >
                <header className="flex items-center justify-between mb-4">
                  <h3
                    className="text-3xl font-extrabold text-transparent bg-clip-text
                bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-lg select-none"
                  >
                    {chartTitle}
                  </h3>
                  <div
                    className="text-purple-300 font-semibold italic select-none text-sm"
                    title="Dataset statistics"
                  >
                    <span>Sum: {stats.sum.toFixed(1)}</span> |{" "}
                    <span>Avg: {stats.avg.toFixed(2)}</span> |{" "}
                    <span>Min: {stats.min}</span> | <span>Max: {stats.max}</span>
                  </div>
                </header>

                <canvas
                  ref={(el) => (chartRefs.current[0] = el)}
                  className="w-full h-96 rounded-xl shadow-neon-glow bg-gradient-to-br
                from-purple-950 via-indigo-950 to-black"
                />

                {/* Show custom legend only for pie/doughnut */}
                {(type === "pie" || type === "doughnut") && (
                  <CustomLegend
                    labels={data.map((row) => row[xColumn])}
                    colors={[
                      "#7C3AED",
                      "#4F46E5",
                      "#2563EB",
                      "#14B8A6",
                      "#22D3EE",
                      "#F43F5E",
                      "#FBBF24",
                    ]}
                  />
                )}

                {/* Description based on chart type */}
                <p
                  className="mt-6 text-purple-300 text-sm tracking-wide leading-relaxed select-none"
                  style={{ userSelect: "none" }}
                >
                  {type === "line" &&
                    "A smooth line chart showing trends over your data range."}
                  {type === "bar" &&
                    "Vertical bars representing your data points with neon highlights."}
                  {type === "pie" &&
                    "Slices illustrating proportions of your dataset with vibrant colors."}
                  {type === "doughnut" &&
                    "Donut chart emphasizing part-to-whole relationships."}
                  {type === "radar" &&
                    "Radar chart visualizing multivariate data across multiple dimensions."}
                </p>
              </section>
            );
          })()}
    </div>
  );
}
