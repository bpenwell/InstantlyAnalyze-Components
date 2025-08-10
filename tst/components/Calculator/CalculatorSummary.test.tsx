import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalculatorSummary } from '../../../src/components/Calculator/CalculatorSummary';

// Mock dependencies
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  CalculationUtils: jest.fn(() => ({
    calculateRentalIncomePerMonth: jest.fn(() => 3000),
    calculateRentalTotalExpensePerMonth: jest.fn(() => 2000),
    calculateCoCROI: jest.fn(() => 12),
    calculateFiveYearAnnualizedReturn: jest.fn(() => 15),
    calculateTenYearAnnualizedReturn: jest.fn(() => 18),
    calculateMortgagePayment: jest.fn(() => 1500),
  })),
  displayAsMoney: (val: number) => `$${val}`,
  displayAsPercent: (val: number, precision: number) => `${val.toFixed(precision)}%`,
}));

jest.mock('../../../src/components/Charts/CloudscapeLineChart', () => ({
  CloudscapeLineChart: ({ datasets }: any) => <div data-testid="line-chart">{datasets.map((d: any) => d.label).join(', ')}</div>,
}));

jest.mock('@cloudscape-design/components', () => ({
  Container: ({ children, header }: any) => <div data-testid="container">{header}{children}</div>,
  Header: ({ children }: any) => <h2 data-testid="header">{children}</h2>,
  Box: ({ children }: any) => <div>{children}</div>,
  ColumnLayout: ({ children }: any) => <div data-testid="column-layout">{children}</div>,
  SpaceBetween: ({ children }: any) => <div>{children}</div>,
  TextContent: ({ children }: any) => <div>{children}</div>,
}));

const mockProps = {
  currentYear: 1,
  currentYearData: {} as any,
  fullLoanTermRentalReportData: Array(30).fill({}),
  initialRentalReportData: {} as any,
  updateInitialData: jest.fn(),
  updateDataYear: jest.fn(),
  reportId: '123',
};

describe('CalculatorSummary Component', () => {
  it('should render without crashing', () => {
    render(<CalculatorSummary {...mockProps} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('Net Cash Flow');
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should display summary data correctly', () => {
    render(<CalculatorSummary {...mockProps} />);
    expect(screen.getByText('Net Cash Flow')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('$1000'))).toBeInTheDocument();
    expect(screen.getByText('CoC ROI')).toBeInTheDocument();
    expect(screen.getByText('12.00%')).toBeInTheDocument();
  });

  it('should handle summary calculations and render chart data', () => {
    render(<CalculatorSummary {...mockProps} />);
    // Verify chart is rendered with correct datasets
    expect(screen.getByTestId('line-chart')).toHaveTextContent('Rental Income, Expenses, Cash Flow');
    // Verify annualized returns are displayed
    expect(screen.getByText('5-Year Annualized Return')).toBeInTheDocument();
    expect(screen.getByText('15.00%')).toBeInTheDocument();
    expect(screen.getByText('10-Year Annualized Return')).toBeInTheDocument();
    expect(screen.getByText('18.00%')).toBeInTheDocument();
  });
}); 