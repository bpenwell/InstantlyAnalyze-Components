// PieChart.tsx
import React from 'react';
import { PieChart } from '@cloudscape-design/components';
import { EXPENSE_COLORS } from '../../constants';

export interface IPieChartProps {
  data: number[];
  labels: string[];
  backgroundColors?: string[];
  title?: string;
}

export const CloudscapePieChart = ({ data, labels, backgroundColors, title }: IPieChartProps) => {
  // Default colors that match our expense indicators
  const defaultColors = [
    EXPENSE_COLORS.mortgage,    // Mortgage
    EXPENSE_COLORS.taxes,       // Taxes
    EXPENSE_COLORS.insurance,   // Insurance
    EXPENSE_COLORS.operational, // Operational Expenses
    EXPENSE_COLORS.fixed,       // Fixed Expenses
  ];

  const chartData = labels.map((label, index) => {
    const value = Number((data[index] || 0).toFixed(2));
    const color = backgroundColors?.[index] || defaultColors[index] || '#cccccc'; // fallback color
    
    return {
      title: label, // Use full label names now that segment labels are hidden
      value: value,
      color: color,
    };
  });

  return (
    <PieChart
      data={chartData}
      size="large"
      ariaLabel="Expense breakdown"
      hideFilter
      legendTitle={title ?? 'Expenses Breakdown'}
      hideLegend={false}
      hideDescriptions={true}
      segmentDescription={() => ''}
    />
  );
};