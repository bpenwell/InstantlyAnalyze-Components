import React, { useRef, useState } from 'react';
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
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, Title, CategoryScale, LinearScale, annotationPlugin);

export interface ILineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface ILineChartProps {
  datasets: ILineChartDataset[];
  labels: string[];
  title?: string;
  onPointClick?: (index: number, value: number, label: string) => void;
}

const LineChart = (props: ILineChartProps) => {
  const {
    datasets,
    labels,
    title = 'Line Chart',
    onPointClick,
  } = props;

  const chartRef = useRef<any>(null);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  let minY = Infinity;
  let maxY = -Infinity;
  datasets.forEach((dataset) => {
    const dataSetMinY = Math.min(...dataset.data.map(Number));
    const dataSetMaxY = Math.max(...dataset.data.map(Number));
    minY = Number(Math.min(minY, dataSetMinY).toFixed(0));
    maxY = Number(Math.max(maxY, dataSetMaxY).toFixed(0));
  });
  const minX = Math.min(...labels.map(Number)).toFixed(0);
  const maxX = Math.max(...labels.map(Number)).toFixed(0);
  console.log('labels');
  console.log(labels.toString());

  const handleClick = (event: any) => {
    const chart = chartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true);

    if (points.length > 0) {
      const firstPoint = points[0];
      const label = chart.data.labels[firstPoint.index] as string;
      const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index] as number;
      const index = firstPoint.index;

      if (onPointClick) {
        onPointClick(index, value, label);
      }

      if (activeAnnotationId) {
        delete chart.options.plugins.annotation.annotations[activeAnnotationId];
      }

      const annotationId = `line-${index}`;
      chart.options.plugins.annotation.annotations[annotationId] = {
        type: 'line',
        scaleID: 'x',
        value: label,
        borderColor: 'white',
        borderWidth: 2,
      };

      setActiveAnnotationId(annotationId);
      chart.update();
    }
  };

  const handleHover = (event: any, elements: any) => {
    const chart = chartRef.current;
    if (!chart) return;

    const xScale = chart.scales.x;
    const yScale = chart.scales.y;

    const elementsAtX = chart.getElementsAtEventForMode(event, 'index', { intersect: false }, true);

    if (elementsAtX.length > 0) {
      const firstElement = elementsAtX[0];
      const xValue: number = Number(chart.data.labels[firstElement.index]);

      chart.options.plugins.annotation.annotations.hoverBand = {
        type: 'box',
        xMin: xValue - 0.5,
        xMax: xValue + 0.5,
        yMin: yScale.min,
        yMax: yScale.max,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 0,
      };

      chart.update();
    } else {
      delete chart.options.plugins.annotation.annotations.hoverBand;
      chart.update();
    }
  };

  const chartData: ChartData<'line'> = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      fill: true,
      pointBackgroundColor: 'transparent', // Remove point dots
      pointBorderColor: 'transparent',    // Remove point dots
      pointRadius: 0,                     // Ensure no point radius
    })),
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        enabled: false,
      },
      /*annotation: {
        annotations: labels.reduce((acc: any, label, index) => {
          acc[`rect-${index}`] = {
            type: 'box',
            xMin: Number(label) - 0.5,
            xMax: Number(label) + 0.5,
            yMin: minY,
            yMax: maxY,
            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
            //borderColor: 'rgba(255, 255, 255, 0.1)', // Light border to indicate the area
            //borderWidth: 1,
          };
          return acc;
        }, {}),
      },*/
    },
    scales: {
      x: {
        type: 'linear', // Use 'linear' for numerical data
        position: 'bottom',
        min: minX,
        max: maxX,
        ticks: {
          color: 'white',
          font: {
            size: 12,
          },
          autoSkip: false,
        },
        grid: {
          display: true,
          drawTicks: true,
          tickLength: 10,
          color: 'rgba(255, 255, 255, 1.0)',
        },
      },
      y: {
        display: true,
        min: minY,
        max: maxY,
        ticks: {
          color: 'white',
          font: {
            size: 12,
          },
          callback: (value: any) => `$${value}`,
        },
        grid: {
          display: false,
        },
      },
    },
    onClick: handleClick,
    onHover: handleHover,
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default LineChart;
