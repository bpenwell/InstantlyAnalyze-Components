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
import { CalculationUtils } from '@bpenwell/rei-module';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, Title, CategoryScale, LinearScale, annotationPlugin);

export interface ILineChartProps {
  data: number[];
  labels: string[];
  borderColor?: string;
  backgroundColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  title?: string;
  onPointClick?: (index: number, value: number, label: string) => void;
  labelDisplayFilter?: (value: number) => boolean;
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
    labelDisplayFilter
  } = props;

  const chartRef = useRef<any>(null);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

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

    if (elements.length > 0) {
      // Get the first point and ensure hover bar only shows over the point
      const firstPoint = elements[0];
      const xValue: number = Number(chart.data.labels[firstPoint.index]);

      console.log(`[DEBUG] Hover detected over: ${xValue}`);
      console.log(`[DEBUG] Hover ${xValue + 0.5} to ${xValue - 0.5}`);

      chart.options.plugins.annotation.annotations.hoverBand = {
        type: 'box',
        xMin: xValue - 0.75, // Wider hover band
        xMax: xValue + 0.75, // Wider hover band
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
      };

      chart.update();
    } else {
      // Remove the hover bar if no points are hovered
      delete chart.options.plugins.annotation.annotations.hoverBand;
      chart.update();
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
  const calculationUtils: CalculationUtils = new CalculationUtils();
  
  const numericLabels = labels.map(label => {
    if (!calculationUtils.isValidNumber(Number(label))) {
      throw new Error(`[DEBUG] Invalid label value: ${label}. All labels must be valid numbers.`);
    }
    return Number(label);
  });

  const minLabel = Math.min(...numericLabels);
  const maxLabel = Math.max(...numericLabels);

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
      annotation: {
        annotations: {},
      },
    },
    scales: {
      x: {
        type: 'linear', // Use linear type for custom spacing
        position: 'bottom',
        min: minLabel, // Set min value based on labels
        max: maxLabel, // Set max value based on labels
        ticks: {
          color: 'white',
          font: {
            size: 12,
          },
          callback: (value: any) => {
            //console.log(`[DEBUG] chart x testing ${value}`);
            //if (labelDisplayFilter && labelDisplayFilter(value)) {
            console.log(`[DEBUG] chart x returning ${value}`);
            return value;
            //}
          }, 
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
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
