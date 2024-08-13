import React, { useRef } from 'react';
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
  onPointClick?: (index: number, value: number, label: string) => void;
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
    onPointClick,
  } = props;

  const chartRef = useRef<any>(null);

  const handleClick = (event: any) => {
    const chart = chartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

    if (points.length > 0) {
      const firstPoint = points[0];
      const label = chart.data.labels[firstPoint.index] as string;
      const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index] as number;
      const index = firstPoint.index;

      if (onPointClick) {
        onPointClick(index, value, label);
      }
    }
  };

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
    maintainAspectRatio: true, // Maintains the aspect ratio on resize   
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
    onClick: handleClick,
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default LineChart;
