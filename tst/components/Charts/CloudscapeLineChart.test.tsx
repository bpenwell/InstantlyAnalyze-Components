import React from 'react';
import { render, screen } from '@testing-library/react';
import { CloudscapeLineChart } from '../../../src/components/Charts/CloudscapeLineChart';

// Mock dependencies
jest.mock('@cloudscape-design/components', () => ({
  LineChart: ({ series, ariaLabel }: any) => (
    <div data-testid="line-chart" aria-label={ariaLabel}>
      {series.map((s: any) => s.title).join(', ')}
    </div>
  ),
}));
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  displayAsMoney: (val: number) => `$${val}`,
}));

const mockProps = {
  datasets: [
    { label: 'Dataset 1', data: [10, 20, 30] },
    { label: 'Dataset 2', data: [15, 25, 35] },
  ],
  labels: ['1', '2', '3'],
  title: 'Test Chart',
};

describe('CloudscapeLineChart Component', () => {
  it('should render without crashing', () => {
    render(<CloudscapeLineChart {...mockProps} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Chart')).toBeInTheDocument();
  });

  it('should display chart data correctly', () => {
    render(<CloudscapeLineChart {...mockProps} />);
    const chart = screen.getByTestId('line-chart');
    expect(chart).toHaveTextContent('Dataset 1, Dataset 2');
  });

  it('should handle chart interactions (props)', () => {
    const onPointClick = jest.fn();
    render(<CloudscapeLineChart {...mockProps} onPointClick={onPointClick} />);
    // Note: The actual click interaction is complex to simulate without a real DOM and chart library.
    // This test primarily ensures the component renders correctly with the interaction prop.
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
}); 