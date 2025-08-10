import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculatorCustomize } from '../../../src/components/Calculator/CalculatorCustomize';

// Mock dependencies
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  CalculationUtils: jest.fn(() => ({
    calculateTotalCashNeeded: jest.fn(() => 10000),
    calculateCapitalExpenditureAbsoluteValue: jest.fn(),
    calculateMaintanenceAbsoluteValue: jest.fn(),
    calculateManagementFeeAbsoluteValue: jest.fn(),
    calculateVacancyAbsoluteValue: jest.fn(),
  })),
  displayAsMoney: (val: number) => `$${val}`,
  displayAsPercent: (val: number) => `${val}%`,
  getRentalIncomeDisplayConfig: jest.fn(() => ({ min: 1000, max: 3000, step: 100 })),
  getOtherExpensesDisplayConfig: jest.fn(() => ({ min: 0, max: 1000, step: 50 })),
  getVacancyDisplayConfig: jest.fn(() => ({ min: 0, max: 20, step: 1 })),
  getManagementFeesDisplayConfig: jest.fn(() => ({ min: 0, max: 15, step: 1 })),
  getPurchasePriceDisplayConfig: jest.fn(() => ({ min: 100000, max: 500000, step: 10000 })),
  getLoanToValuePercentDisplayConfig: jest.fn(() => ({ min: 50, max: 90, step: 5 })),
  getLoanTermDisplayConfig: jest.fn(() => ({ min: 15, max: 30, step: 5 })),
  getInterestRateDisplayConfig: jest.fn(() => ({ min: 3, max: 8, step: 0.25 })),
}));

jest.mock('@cloudscape-design/components', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Header: ({ children }: any) => <h2>{children}</h2>,
  TextContent: ({ children }: any) => <div>{children}</div>,
  Slider: ({ value, onChange, ariaLabel }: any) => (
    <input
      type="range"
      aria-label={ariaLabel}
      value={value}
      onChange={e => onChange({ detail: { value: Number(e.target.value) } })}
    />
  ),
}));

const mockProps = {
  updateInitialData: jest.fn(),
  updateDataYear: jest.fn(),
  currentYear: 2024,
  reportId: 'test-id',
  fullLoanTermRentalReportData: [] as any,
  currentYearData: {
      expenseDetails: { other: 0 },
      strategyDetails: { isRehabbingProperty: false, isRefinancingProperty: false },
      purchaseDetails: { purchasePrice: 0, purchaseClosingCost: 0, purchaseClosingCostPercent: 0 as any, reportPropertyValue: 0, propertyValueGrowthPercent: 0 as any },
      loanDetails: { loanToValuePercent: 0 as any, loanTerm: 0, interestRate: 0 as any, cashPurchase: false, downPayment: 0, downPaymentPercent: 0 as any, pointsCharged: 0 },
      rentalIncome: { grossMonthlyIncome: 0, otherMonthlyIncome: 0, incomeGrowthPercent: 0 as any },
      creationDate: new Date(),
      isShareable: false,
      propertyInformation: {}
  } as any,
  initialRentalReportData: {
      expenseDetails: { other: 0 },
      strategyDetails: { isRehabbingProperty: false, isRefinancingProperty: false },
      purchaseDetails: { purchasePrice: 0, purchaseClosingCost: 0, purchaseClosingCostPercent: 0 as any, reportPropertyValue: 0, propertyValueGrowthPercent: 0 as any },
      loanDetails: { loanToValuePercent: 0 as any, loanTerm: 0, interestRate: 0 as any, cashPurchase: false, downPayment: 0, downPaymentPercent: 0 as any, pointsCharged: 0 },
      rentalIncome: { grossMonthlyIncome: 0, otherMonthlyIncome: 0, incomeGrowthPercent: 0 as any },
      creationDate: new Date(),
      isShareable: false,
      propertyInformation: {}
  } as any
};

describe('CalculatorCustomize Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<CalculatorCustomize {...mockProps} />);
    expect(screen.getByText('Customization')).toBeInTheDocument();
    expect(screen.getAllByRole('slider').length).toBe(8);
  });

  it('should handle customization functionality (slider change)', () => {
    render(<CalculatorCustomize {...mockProps} />);
    const rentalIncomeSlider = screen.getByLabelText('Rental Income:');
    fireEvent.change(rentalIncomeSlider, { target: { value: '2500' } });
    expect(mockProps.updateInitialData).toHaveBeenCalled();
  });

  it('should save customization settings on slider change', () => {
    render(<CalculatorCustomize {...mockProps} />);
    const interestRateSlider = screen.getByLabelText('Interest rate:');
    fireEvent.change(interestRateSlider, { target: { value: '6' } });
    expect(mockProps.updateInitialData).toHaveBeenCalled();
  });
}); 