import React from 'react';
import { render, screen } from '@testing-library/react';
import { CloudscapePieChart } from '../../../src/components/Charts/PieChart';

// Mock the Cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  PieChart: ({ data, size, ariaLabel, hideFilter, legendTitle }: any) => (
    <div data-testid="pie-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-size">{size}</div>
      <div data-testid="chart-aria-label">{ariaLabel}</div>
      <div data-testid="chart-hide-filter">{hideFilter.toString()}</div>
      <div data-testid="chart-legend-title">{legendTitle}</div>
    </div>
  ),
}));

describe('CloudscapePieChart', () => {
  const defaultProps = {
    data: [30, 25, 20, 15, 10],
    labels: ['Rent', 'Utilities', 'Insurance', 'Maintenance', 'Other'],
  };

  const renderPieChart = (props = {}) => {
    return render(<CloudscapePieChart {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render with default props', () => {
      renderPieChart();
      
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('chart-size')).toHaveTextContent('large');
      expect(screen.getByTestId('chart-aria-label')).toHaveTextContent('Expense breakdown');
      expect(screen.getByTestId('chart-hide-filter')).toHaveTextContent('true');
      expect(screen.getByTestId('chart-legend-title')).toHaveTextContent('Expenses Breakdown');
    });

    it('should render with custom title', () => {
      renderPieChart({ title: 'Custom Title' });
      
      expect(screen.getByTestId('chart-legend-title')).toHaveTextContent('Custom Title');
    });

    it('should transform data correctly', () => {
      renderPieChart();
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '[]');
      
      expect(parsedData).toHaveLength(5);
      expect(parsedData[0]).toEqual({
        title: 'Rent',
        value: 30,
        color: '#2ea043'
      });
      expect(parsedData[1]).toEqual({
        title: 'Utilities',
        value: 25,
        color: '#fd7e14'
      });
    });

    it('should handle decimal values correctly', () => {
      renderPieChart({
        data: [30.123, 25.456],
        labels: ['Item1', 'Item2']
      });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '[]');
      
      expect(parsedData[0].value).toBe(30.12);
      expect(parsedData[1].value).toBe(25.46);
    });

    it('should use correct color palette', () => {
      renderPieChart();
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '[]');
      
      const expectedColors = ['#2ea043', '#fd7e14', '#6f42c1', '#d1242f', '#0969da'];
      parsedData.forEach((item: any, index: number) => {
        expect(item.color).toBe(expectedColors[index]);
      });
    });

    it('should handle empty data arrays', () => {
      renderPieChart({
        data: [],
        labels: []
      });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '[]');
      
      expect(parsedData).toHaveLength(0);
    });

    it('should handle single data point', () => {
      renderPieChart({
        data: [100],
        labels: ['Single Item']
      });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '[]');
      
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0]).toEqual({
        title: 'Single Item',
        value: 100,
        color: '#2ea043'
      });
    });
  });
}); 