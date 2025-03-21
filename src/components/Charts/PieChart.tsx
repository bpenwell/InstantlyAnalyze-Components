// PieChart.tsx
import React from 'react';
import { PieChart } from '@cloudscape-design/components';

export interface IPieChartProps {
  data: number[];
  labels: string[];
  backgroundColors?: string[];
  title?: string;
}

export const CloudscapePieChart = ({ data, labels, title }: IPieChartProps) => {
  const chartData = labels.map((label, index) => ({
    title: label,
    value: Number(data[index].toFixed(2)),
    color: ['#4A7A40', '#C47766', '#D9B98A', '#617A40', '#A4BBA0'][index],
  }));

  return (
    <PieChart
      data={chartData}
      size="medium"
      ariaLabel="Expense breakdown"
      hideFilter
      legendTitle={title ?? 'Expenses Breakdown'}
    />
  );
};