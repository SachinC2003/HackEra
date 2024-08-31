import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

//const labels = getLast7Days();

// const lineChartOptions = {
//   responsive: true,
//   plugins: {
//     legend: {
//       display: false,
//     },
//     title: {
//       display: false,
//     },
//   },
//   scales: {
//     x: {
//       grid: {
//         display: false,
//       },
//     },
//     y: {
//       beginAtZero: true,
//       grid: {
//         display: false,
//       },
//     },
//   },
// };

// interface LineChartProps {
//   value: number[];
// }

// const LineChart: React.FC<LineChartProps> = ({ value = [] }) => {
//   const data = {
//     labels,
//     datasets: [
//       {
//         data: value,
//         label: "Messages",
//         fill: true,
//         backgroundColor: "rgba(75,12,192,0.2)", // purpleLight
//         borderColor: "rgba(75,12,192,1)", // purple
//       },
//     ],
//   };

//   return <Line data={data} options={lineChartOptions} />;
// };

interface DoughnutChartProps {
  value: number[];
  labels: string[];
}

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  value = [],
  labels = [],
}) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [
          "rgba(75,12,192,0.2)", // purpleLight
          "rgba(234,112,112,0.2)", // orangeLight
          "rgba(39,148,171,0.2)", // tealLight
          "rgba(0,204,153,0.2)", // greenLight
        ],
        hoverBackgroundColor: [
          "rgba(75,12,192,1)", // purple
          "rgba(234,112,112,1)", // orange
          "rgba(39,148,171,1)", // teal
          "rgba(0,204,153,1)", // green
        ],
        borderColor: [
          "rgba(75,12,192,1)", // purple
          "rgba(234,112,112,1)", // orange
          "rgba(39,148,171,1)", // teal
          "rgba(0,204,153,1)", // green
        ],
        offset: 40,
      },
    ],
  };

  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export { DoughnutChart };
