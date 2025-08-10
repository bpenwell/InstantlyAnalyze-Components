import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { CalculatorExpenses } from '../../../src/components/Calculator/CalculatorExpenses';

// Mock dependencies
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
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

    const mortgageHeader = screen.getByRole('heading', { name: 'Mortgage' });
    expect(within(mortgageHeader.parentElement as HTMLElement).getByText('$1000')).toBeInTheDocument();

    const taxesHeader = screen.getByRole('heading', { name: 'Taxes' });
    expect(within(taxesHeader.parentElement as HTMLElement).getByText('$200')).toBeInTheDocument();

    const insuranceHeader = screen.getByRole('heading', { name: 'Insurance' });
    expect(within(insuranceHeader.parentElement as HTMLElement).getByText('$100')).toBeInTheDocument();
  });

  it('should render all expense details', () => {
    render(<CalculatorExpenses {...mockProps} />);

    const electricityHeader = screen.getByRole('heading', { name: 'Electricity' });
    expect(within(electricityHeader.parentElement as HTMLElement).getByText('$50')).toBeInTheDocument();

    const waterSewerHeader = screen.getByRole('heading', { name: 'Water & Sewer' });
    expect(within(waterSewerHeader.parentElement as HTMLElement).getByText('$40')).toBeInTheDocument();

    const vacancyHeader = screen.getByRole('heading', { name: 'Vacancy' });
    expect(within(vacancyHeader.parentElement as HTMLElement).getByText('$90')).toBeInTheDocument();

    const capExHeader = screen.getByRole('heading', { name: 'CapEx' });
    expect(within(capExHeader.parentElement as HTMLElement).getByText('$100')).toBeInTheDocument();

    const managementHeader = screen.getByRole('heading', { name: 'Management' });
    expect(within(managementHeader.parentElement as HTMLElement).getByText('$150')).toBeInTheDocument();
  });
}); 