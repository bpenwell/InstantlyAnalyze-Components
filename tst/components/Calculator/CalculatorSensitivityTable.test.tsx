import 'core-js/features/structured-clone';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculatorSensitivityTable } from '../../../src/components/Calculator/CalculatorSensitivityTable';

// Mock dependencies
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  CalculationUtils: jest.fn(() => ({
    getDataByDataClassifier: jest.fn(),
    calculateFullLoanTermRentalReportDataWithSensitivityData: jest.fn(() => []),
    calculateBusinessMetricOnFullLoanTermRentalReportData: jest.fn(() => 10),
  })),
  getDisplayByDataClassifier: (val: any) => val.toString(),
  getRentalIncomeDisplayConfig: jest.fn(() => ({ dataClassifier: 'RentalIncome', min: 1800, max: 2200 })),
  getPurchasePriceDisplayConfig: jest.fn(() => ({ dataClassifier: 'PurchasePrice', min: 180000, max: 220000 })),
  DataClassifier: {
    RentalIncome: 'Rental Income',
    PurchasePrice: 'Purchase Price',
    CashOnCashReturnOnInvestment: 'Cash on Cash Return on Investment',
  },
}));

jest.mock('../../../src/components/LoadingBar/LoadingBar', () => ({
  LoadingBar: () => <div data-testid="loading-bar">Loading...</div>,
}));

jest.mock('@cloudscape-design/components', () => ({
  Container: ({ children }: any) => <div data-testid="container">{children}</div>,
  Header: ({ children }: any) => <h2 data-testid="header">{children}</h2>,
  Button: ({ children, onClick, disabled }: any) => <button onClick={onClick} disabled={disabled}>{children}</button>,
  Table: ({ items }: any) => (
    <table data-testid="table">
      <tbody>
        {items.map((item: any, index: number) => (
          <tr key={index}>
            {Object.values(item).map((val: any, i: number) => <td key={i}>{val.display || val}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  TextContent: ({ children }: any) => <div>{children}</div>,
}));

const mockProps = {
  initialRentalReportData: {
    rentalIncome: { grossMonthlyIncome: 0, otherMonthlyIncome: 0, incomeGrowthPercent: 0 as any },
    purchaseDetails: { purchasePrice: 0, purchaseClosingCost: 0, purchaseClosingCostPercent: 0 as any, reportPropertyValue: 0, propertyValueGrowthPercent: 0 as any },
    expenseDetails: { other: 0 } as any,
    loanDetails: { loanToValuePercent: 0 as any, loanTerm: 0, interestRate: 0 as any, cashPurchase: false, downPayment: 0, downPaymentPercent: 0 as any, pointsCharged: 0 },
    strategyDetails: { isRehabbingProperty: false, isRefinancingProperty: false },
    propertyInformation: { streetAddress: '', city: '', state: '', zipCode: '' },
    isShareable: false,
    creationDate: new Date(),
  },
  currentYearData: {
    rentalIncome: { grossMonthlyIncome: 0, otherMonthlyIncome: 0, incomeGrowthPercent: 0 as any },
    purchaseDetails: { purchasePrice: 0, purchaseClosingCost: 0, purchaseClosingCostPercent: 0 as any, reportPropertyValue: 0, propertyValueGrowthPercent: 0 as any },
    expenseDetails: { other: 0 } as any,
    loanDetails: { loanToValuePercent: 0 as any, loanTerm: 0, interestRate: 0 as any, cashPurchase: false, downPayment: 0, downPaymentPercent: 0 as any, pointsCharged: 0 },
    strategyDetails: { isRehabbingProperty: false, isRefinancingProperty: false },
    propertyInformation: { streetAddress: '', city: '', state: '', zipCode: '' },
    isShareable: false,
    creationDate: new Date(),
  },
  fullLoanTermRentalReportData: [],
  reportId: 'test-report',
  updateInitialData: jest.fn(),
  updateDataYear: jest.fn(),
  currentYear: 2024,
};

describe('CalculatorSensitivityTable Component', () => {
  it('should render without crashing', () => {
    render(<CalculatorSensitivityTable {...mockProps} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByText('Sensitivity Analysis')).toBeInTheDocument();
    expect(screen.getByText('Generate Table')).toBeInTheDocument();
  });

  it('should display sensitivity data correctly after generation', async () => {
    render(<CalculatorSensitivityTable {...mockProps} />);
    fireEvent.click(screen.getByText('Rental Income'));
    fireEvent.click(screen.getByText('Purchase Price'));
    fireEvent.click(screen.getByText('Cash on Cash Return on Investment'));
    fireEvent.click(screen.getByText('Generate Table'));
    expect(await screen.findByTestId('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
  });

  it('should show an alert if not enough inputs are selected', () => {
    window.alert = jest.fn();
    render(<CalculatorSensitivityTable {...mockProps} />);
    fireEvent.click(screen.getByText('Generate Table'));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly 2 input variables and 1 output variable.');
  });
}); 