import React, { useEffect } from "react";
import ApexCharts from "react-apexcharts";

function RadialChart({ series = [0, 0, 0] }) {
  const getChartOptions = () => {
    return {
      series,
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
      chart: {
        height: 380,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },

      plotOptions: {
        radialBar: {
          track: {
            background: "transparent",
          },
          startAngle: -180,
          endAngle: 180,
          dataLabels: {
            show: false,
          },
          hollow: {
            margin: 5,
            size: "48%",
            image: "../../images/cone.png",
            imageWidth: 70,
            imageHeight: 70,
            imageClipped: false,
          },
        },
      },

      stroke: {
        lineCap: "round",
      },

      labels: ["Done", "In progress", "To do"],
      legend: {
        show: true,
        position: "bottom",
        fontFamily: "Raleway, sans-serif",
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
    };
  };

  useEffect(() => {
    if (typeof ApexCharts !== "undefined") {
      var chart = new ApexCharts(
        document.querySelector("#radial-chart"),
        getChartOptions()
      );
      chart.render();
    }
  }, []);

  return (
    <div className="py-3" id="radial-chart">
      <ApexCharts
        options={getChartOptions()}
        series={series}
        type="radialBar"
        height={380}
      />
    </div>
  );
}

export default RadialChart;
