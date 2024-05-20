import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  data: { year: number; totalJobs: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.year),
    datasets: [
      {
        label: 'Total Jobs',
        data: data.map((d) => d.totalJobs),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineGraph;
