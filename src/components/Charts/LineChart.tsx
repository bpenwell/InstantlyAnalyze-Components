import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

export interface ILineChartProps {
  data: number[];
  labels: string[];
  borderColor?: string;
  backgroundColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  title?: string;
}

const LineChart = (props: ILineChartProps) => {
  const {
    data,
    labels,
    borderColor = 'rgba(75,192,192,1)',
    backgroundColor = 'rgba(75,192,192,0.2)',
    pointBackgroundColor = '#fff',
    pointBorderColor = 'rgba(75,192,192,1)',
    title = 'Line Chart',
  } = props;

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        data,
        borderColor,
        backgroundColor,
        pointBackgroundColor,
        pointBorderColor,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;