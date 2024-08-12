import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Title,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export interface IPieChartProps {
  data: number[];
  labels: string[];
  backgroundColors?: string[];
  hoverBackgroundColors?: string[];
  title?: string;
}

const PieChart = (props: IPieChartProps) => {
  const {
    data,
    labels,
    backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'],
    hoverBackgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'],
    title = 'Pie Chart'
  } = props;
    const chartData: ChartData<'pie'> = {
        labels,
        datasets: [
        {
            data,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors,
        },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: true, // Maintains the aspect ratio on resize
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: !!title,
            text: title,
        },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default PieChart;
