import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalculatorLoanPaydown } from '../../../src/components/Calculator/CalculatorLoanPaydown';

// Mock dependencies
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  CalculationUtils: jest.fn(() => ({
    calculateRemainingLoanAmount: jest.fn((data, year) => 100000 - year * 1000),
    calculateCashFlow: jest.fn(() => 5000),
    calculateMortgagePayment: jest.fn(() => 1200),
    calculateBeforeTaxEquityReversion: jest.fn(() => 150000),
    calculateAnnualizedReturn: jest.fn(() => 10),
    calculateMonthlyTimelineData: jest.fn(() => []),
  })),
  displayAsMoney: (val: number) => `$${val}`,
  displayAsPercent: (val: number) => `${val}%`,
  TIME_PERIODS: [1, 5, 10, 20, 30],
}));
jest.mock('@cloudscape-design/components', () => ({
  Container: ({ children, header }: any) => (
    <div data-testid="container">
      {header}
      {children}
    </div>
  ),
  Header: ({ children }: any) => <h2 data-testid="header">{children}</h2>,
  SpaceBetween: ({ children }: any) => <div data-testid="space-between">{children}</div>,
  Box: ({ children }: any) => <div data-testid="box">{children}</div>,
  LineChart: ({ series, ariaLabel }: any) => <div data-testid="line-chart">{series.map((s: any) => s.title).join(', ')}</div>,
  Table: ({ columnDefinitions, items, ...rest }: any) => (
    <table data-testid="table" {...rest}>
      <tbody>
        {items.map((item: any, index: number) => (
          <tr key={index}>
            {columnDefinitions.map((col: any) => (
              <td key={col.id}>{typeof col.cell === 'function' ? col.cell(item) : item[col.id]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

const mockProps = {
  initialRentalReportData: {
    loanDetails: { loanTerm: 30 },
  },
  fullLoanTermRentalReportData: Array(31).fill({
    purchaseDetails: { reportPropertyValue: 200000 },
  }),
} as any;

describe('CalculatorLoanPaydown Component', () => {
  it('should render without crashing', () => {
    render(<CalculatorLoanPaydown {...mockProps} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('Loan Paydown');
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should handle loan paydown calculations', () => {
    render(<CalculatorLoanPaydown {...mockProps} />);
    // Check chart series
    expect(screen.getByTestId('line-chart')).toHaveTextContent('Loan Balance, Equity, Property Value');
    // Check table rows
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
  });

  it('should filter time periods based on loan term', () => {
    const shortLoanProps = {
      ...mockProps,
      initialRentalReportData: { loanDetails: { loanTerm: 15 } },
    };
    render(<CalculatorLoanPaydown {...shortLoanProps} />);
    // Year 20 and 30 should not be in the table
    expect(screen.queryByText('Year 20')).not.toBeInTheDocument();
    expect(screen.queryByText('Year 30')).not.toBeInTheDocument();
  });
});
