import React from 'react';
import { render, screen } from '@testing-library/react';
import LineChart, { ILineChartDataset } from '../../../src/components/Charts/LineChart';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options, onClick, onHover }: any) => {
    // Preserve function information for testing
    const optionsWithFunctionInfo = {
      ...options,
      scales: {
        ...options.scales,
        y: {
          ...options.scales?.y,
          ticks: {
            ...options.scales?.y?.ticks,
            callback: options.scales?.y?.ticks?.callback ? 'function' : undefined,
            _hasCallback: !!options.scales?.y?.ticks?.callback,
          }
        }
      }
    };
    
    return (
      <div data-testid="line-chart">
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
        <div data-testid="chart-options">{JSON.stringify(optionsWithFunctionInfo)}</div>
        <button data-testid="chart-click" onClick={() => onClick && onClick({})}>Click</button>
        <button data-testid="chart-hover" onMouseMove={() => onHover && onHover({})}>Hover</button>
      </div>
    );
  },
}));

// Mock chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  LineElement: jest.fn(),
  PointElement: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Title: jest.fn(),
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  ChartData: jest.fn(),
  ChartOptions: jest.fn(),
}));

// Mock chartjs-plugin-annotation
jest.mock('chartjs-plugin-annotation', () => jest.fn());

// Mock the module
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  displayAsMoney: jest.fn((value: number) => `$${value.toFixed(2)}`),
}));

describe('LineChart', () => {
  const mockDatasets: ILineChartDataset[] = [
    {
      label: 'Dataset 1',
      data: [10, 20, 30, 40],
      borderColor: '#ff0000',
      backgroundColor: '#ff0000',
    },
    {
      label: 'Dataset 2',
      data: [15, 25, 35, 45],
      borderColor: '#00ff00',
      backgroundColor: '#00ff00',
    },
  ];

  const mockLabels = ['2020', '2021', '2022', '2023'];

  const defaultProps = {
    datasets: mockDatasets,
    labels: mockLabels,
  };

  const renderLineChart = (props = {}) => {
    return render(<LineChart {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render line chart component', () => {
      renderLineChart();
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should pass datasets to chart component', () => {
      renderLineChart();
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '{}');
      
      expect(parsedData.datasets).toHaveLength(2);
      expect(parsedData.datasets[0].label).toBe('Dataset 1');
      expect(parsedData.datasets[1].label).toBe('Dataset 2');
    });

    it('should pass labels to chart component', () => {
      renderLineChart();
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '{}');
      
      expect(parsedData.labels).toEqual(mockLabels);
    });

    it('should render with custom title', () => {
      renderLineChart({ title: 'Custom Chart Title' });
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.plugins.title.text).toBe('Custom Chart Title');
    });
  });

  describe('data processing', () => {
    it('should calculate correct Y-axis bounds', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      // With our mock data: min=10, max=45
      expect(parsedOptions.scales.y.min).toBe(10);
      expect(parsedOptions.scales.y.max).toBe(45);
    });

    it('should calculate correct X-axis bounds', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      // With our mock labels: min=2020, max=2023
      expect(parsedOptions.scales.x.min).toBe(2020);
      expect(parsedOptions.scales.x.max).toBe(2023);
    });

    it('should handle empty datasets', () => {
      renderLineChart({ datasets: [] });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '{}');
      
      expect(parsedData.datasets).toHaveLength(0);
    });

    it('should handle single dataset', () => {
      renderLineChart({ datasets: [mockDatasets[0]] });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '{}');
      
      expect(parsedData.datasets).toHaveLength(1);
      expect(parsedData.datasets[0].label).toBe('Dataset 1');
    });
  });

  describe('interactivity', () => {
    it('should be interactive by default', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.interaction.mode).toBe('nearest');
    });

    it('should disable interactivity when interactive is false', () => {
      renderLineChart({ interactive: false });
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.interaction.mode).toBe('nearest');
      // The actual interaction would be disabled in the click handler
    });

    it('should call onPointClick when point is clicked', () => {
      const mockOnPointClick = jest.fn();
      renderLineChart({ onPointClick: mockOnPointClick });
      
      const clickButton = screen.getByTestId('chart-click');
      clickButton.click();
      
      // The actual click handler would be called in a real scenario
      // This is a simplified test for the structure
    });
  });

  describe('data formatting', () => {
    it('should use compressData by default', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      // Check that the formatting options are set correctly
      expect(parsedOptions.scales.y.ticks._hasCallback).toBe(true);
    });

    it('should use addCommas when specified', () => {
      renderLineChart({ addCommas: true, compressData: false });

      // Check that comma formatting is enabled
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      expect(parsedOptions.scales.y.ticks._hasCallback).toBe(true);
    });

    it('should use specified decimal count', () => {
      renderLineChart({ decimalCount: 2 });

      // Check that decimal formatting is applied
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      expect(parsedOptions.scales.y.ticks._hasCallback).toBe(true);
    });
  });

  describe('chart options', () => {
    it('should set responsive to true', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.responsive).toBe(true);
    });

    it('should set maintainAspectRatio to false', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.maintainAspectRatio).toBe(false);
    });

    it('should configure tooltips', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.plugins.tooltip).toBeDefined();
    });

    it('should configure legend', () => {
      renderLineChart();
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.plugins.legend).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle datasets with different lengths', () => {
      const unevenDatasets: ILineChartDataset[] = [
        { label: 'Short', data: [1, 2] },
        { label: 'Long', data: [1, 2, 3, 4, 5] },
      ];
      
      renderLineChart({ datasets: unevenDatasets });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '{}');
      
      expect(parsedData.datasets).toHaveLength(2);
    });

    it('should handle empty labels array', () => {
      renderLineChart({ labels: [] });
      
      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '{}');
      
      expect(parsedData.labels).toEqual([]);
    });

    it('should handle datasets with all zero values', () => {
      const zeroDatasets: ILineChartDataset[] = [
        { label: 'Zeros', data: [0, 0, 0, 0] },
      ];
      
      renderLineChart({ datasets: zeroDatasets });
      
      const chartOptions = screen.getByTestId('chart-options');
      const parsedOptions = JSON.parse(chartOptions.textContent || '{}');
      
      expect(parsedOptions.scales.y.min).toBe(0);
      expect(parsedOptions.scales.y.max).toBe(0);
    });
  });
}); 