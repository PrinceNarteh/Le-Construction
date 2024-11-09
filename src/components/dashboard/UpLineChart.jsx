import React from "react";
import { Line } from "react-chartjs-2";


function UpLineChart({ chartData }) {
  const chartOptions = {
    tension: 0.9,
    scales: {
      x: {
        grid: {
          drawOnChartArea: true,
        },
      },
      y: {
        grid: {
          drawOnChartArea: false,
        },
        display: false, // Hide y-axis gridlines
      },
    },
    elements: {
      bar: {
        barPercentage: 0.6, // Adjust the width of the bars
        categoryPercentage: 0.8, // Adjust the space between bars
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}

export default UpLineChart;
