import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ chartData, options }) {
  return <Line data={chartData} options={options} />;
}

export default LineChart;
