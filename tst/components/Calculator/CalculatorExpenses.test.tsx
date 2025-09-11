import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { CalculatorExpenses } from '../../../src/components/Calculator/CalculatorExpenses';

// Mock dependencies
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  CalculationUtils: jest.fn(() => ({
    calculateMortgagePayment: jest.fn(() => 1000),
    calculateRentalTotalExpensePerMonth: jest.fn(() => 2500),
  })),
  Frequency: { Annual: 'Annual' },
}));

jest.mock('../../../src/components/Charts/PieChart', () => ({
  CloudscapePieChart: ({ title }: any) => <div data-testid="pie-chart">{title}</div>,
}));

jest.mock('@cloudscape-design/components', () => ({
  Container: ({ children }: any) => <div data-testid="container">{children}</div>,
  Header: ({ children }: any) => <h2 data-testid="header">{children}</h2>,
  TextContent: ({ children }: any) => <div>{children}</div>,
}));

const mockProps = {
  currentYearData: {
    expenseDetails: {
      propertyTaxes: 2400,
      insurance: 1200,
      electricity: 50,
      garbage: 30,
      gas: 20,
      other: 10,
      hoaFees: 0,
      waterAndSewer: 40,
      capitalExpenditure: 100,
      managementFee: 150,
      maintenance: 80,
      vacancy: 90,
      propertyTaxFrequency: 'Annual',
      insuranceFrequency: 'Annual',
    },
    strategyDetails: {},
  },
} as any;

describe('CalculatorExpenses Component', () => {
  it('should render without crashing', () => {
    render(<CalculatorExpenses {...mockProps} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('Expenses');
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should handle expense calculations correctly', () => {
    render(<CalculatorExpenses {...mockProps} />);

    const totalExpensesHeader = screen.getByRole('heading', { name: 'Total Expenses' });
    expect(within(totalExpensesHeader.parentElement as HTMLElement).getByText('$2500')).toBeInTheDocument();

    expect(screen.getByText('Mortgage')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();

    expect(screen.getByText('Taxes')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();

    // Find Insurance section and verify its amount
    const insuranceSection = screen.getByText('Insurance').parentElement?.parentElement;
    expect(insuranceSection).toBeInTheDocument();
    expect(within(insuranceSection as HTMLElement).getByText('$100')).toBeInTheDocument();
  });

  it('should render all expense details', () => {
    render(<CalculatorExpenses {...mockProps} />);

    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();

    expect(screen.getByText('Water & Sewer')).toBeInTheDocument();
    expect(screen.getByText('$40')).toBeInTheDocument();

    expect(screen.getByText('Vacancy')).toBeInTheDocument();
    expect(screen.getByText('$90')).toBeInTheDocument();

    // Find CapEx section and verify its amount
    const capExSection = screen.getByText('CapEx').parentElement?.parentElement;
    expect(capExSection).toBeInTheDocument();
    expect(within(capExSection as HTMLElement).getByText('$100')).toBeInTheDocument();

    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });
}); 