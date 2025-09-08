import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create mock functions outside the mock to ensure they persist
const mockCalculateCoCROI = jest.fn().mockReturnValue(10.5);
const mockCalculateGoingInCapRate = jest.fn().mockReturnValue(8.2);
const mockCalculate50PercentRuleCashFlow = jest.fn().mockReturnValue(500);

// Mock the module BEFORE importing the component
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  CalculationUtils: jest.fn().mockImplementation(() => ({
    calculateCoCROI: mockCalculateCoCROI,
    calculateGoingInCapRate: mockCalculateGoingInCapRate,
    calculate50PercentRuleCashFlow: mockCalculate50PercentRuleCashFlow,
  })),
  displayAsMoney: jest.fn((value: number) => `$${value.toFixed(0)}`),
  displayAsPercent: jest.fn((value: number) => `${value.toFixed(2)}%`),
  parseCurrencyStringToNumber: jest.fn((value: string) => parseFloat(value.replace(/[$,]/g, ''))),
  parsePercentageStringToNumber: jest.fn((value: string) => parseFloat(value.replace('%', ''))),
  IRentalCalculatorData: jest.fn(),
  IRentalReportBuybox: jest.fn(),
}));

// Mock the AppContext
jest.mock('../../../src/utils/AppContextProvider', () => ({
  useAppContext: jest.fn(),
}));

// Mock the Cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  Container: ({ children, header }: any) => (
    <div data-testid="container">
      {header && <div data-testid="container-header">{header}</div>}
      {children}
    </div>
  ),
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
  Box: ({ children }: any) => <div data-testid="box">{children}</div>,
  SpaceBetween: ({ children, direction, size }: any) => (
    <div data-testid={`space-between-${direction}`} data-size={size}>
      {children}
    </div>
  ),
  StatusIndicator: ({ type, children }: any) => (
    <div data-testid={`status-${type}`}>{children}</div>
  ),
  Button: ({ children, onClick, variant, ...rest }: any) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  Link: ({ href, external, children }: any) => (
    <a href={href} data-testid="link" data-external={external}>
      {children}
    </a>
  ),
}));

// Mock the Input component
jest.mock('../../../src/components/Input/Input', () => ({
  Input: ({ value, onChange, type }: any) => (
    <input data-testid="input" value={value} onChange={onChange} type={type} />
  ),
}));

import { CalculatorBuyboxChecklist } from '../../../src/components/Calculator/CalculatorBuyboxChecklist';

describe('CalculatorBuyboxChecklist', () => {
  const mockUseAppContext = require('../../../src/utils/AppContextProvider').useAppContext;
  const mockCalculationUtils = require('@bpenwell/instantlyanalyze-module').CalculationUtils;

  const mockProps = {
    currentYear: 2024,
    currentYearData: {
      rentalIncome: {
        grossMonthlyIncome: 2000,
      },
      purchaseDetails: {
        purchasePrice: 200000,
      },
    } as any,
    fullLoanTermRentalReportData: [],
    initialRentalReportData: {
      rentalIncome: {
        grossMonthlyIncome: 2000,
      },
      purchaseDetails: {
        purchasePrice: 200000,
      },
    } as any,
    updateInitialData: jest.fn(),
    reportId: 'test-report-id',
  };

  const defaultContext = {
    getRentalReportBuyBoxSetsPreference: jest.fn().mockReturnValue([
      { key: 'cocROI', threshold: 8 },
      { key: 'capRate', threshold: 7 },
      { key: 'rentToPriceRatio', threshold: 1 },
      { key: 'cashFlow', threshold: 0 },
    ]),
    setRentalReportBuyBoxSetsPreference: jest.fn(),
  };

  const renderCalculatorBuyboxChecklist = (props = mockProps, context = defaultContext) => {
    mockUseAppContext.mockReturnValue(context);
    return render(<CalculatorBuyboxChecklist {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render container with header', () => {
      renderCalculatorBuyboxChecklist();
      
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Key Deal Metrics')).toBeInTheDocument();
    });

    it('should render all four rules', () => {
      renderCalculatorBuyboxChecklist();
      
      // Check for rule labels
      expect(screen.getByText('CoC ROI')).toBeInTheDocument();
      expect(screen.getByText('Going In Cap Rate')).toBeInTheDocument();
      expect(screen.getByText('1% Rule')).toBeInTheDocument();
      expect(screen.getByText('50% Rule')).toBeInTheDocument();
    });

    it('should render rule values', () => {
      renderCalculatorBuyboxChecklist();
      
      // Check for calculated values (these are the actual calculated values, not thresholds)
      expect(screen.getByText('10.50%')).toBeInTheDocument(); // CoC ROI value
      expect(screen.getByText('8.20%')).toBeInTheDocument(); // Cap Rate value
      expect(screen.getByText('1.00%')).toBeInTheDocument(); // 1% Rule value
      expect(screen.getByText('$500')).toBeInTheDocument(); // 50% Rule value
    });

    it('should render links for each rule', () => {
      renderCalculatorBuyboxChecklist();
      
      const links = screen.getAllByTestId('link');
      expect(links).toHaveLength(4);
    });

    it('should render edit thresholds button', () => {
      renderCalculatorBuyboxChecklist();
      
      expect(screen.getByText('Edit Thresholds')).toBeInTheDocument();
    });
  });

  describe('rule calculations', () => {
    it('should calculate CoC ROI correctly', () => {
      renderCalculatorBuyboxChecklist();
      
      expect(mockCalculationUtils).toHaveBeenCalled();
      expect(mockCalculateCoCROI).toHaveBeenCalledWith(mockProps.initialRentalReportData);
    });

    it('should calculate Cap Rate correctly', () => {
      renderCalculatorBuyboxChecklist();
      
      expect(mockCalculateGoingInCapRate).toHaveBeenCalledWith(mockProps.initialRentalReportData);
    });

    it('should calculate 1% Rule correctly', () => {
      renderCalculatorBuyboxChecklist();
      
      // The 1% rule calculation is done inline: (grossMonthlyIncome / purchasePrice) * 100
      // With our mock data: (2000 / 200000) * 100 = 1%
      expect(screen.getByText('1.00%')).toBeInTheDocument();
    });

    it('should calculate 50% Rule correctly', () => {
      renderCalculatorBuyboxChecklist();
      
      expect(mockCalculate50PercentRuleCashFlow).toHaveBeenCalledWith(mockProps.initialRentalReportData);
    });
  });

  describe('status indicators', () => {
    it('should show success status for passing rules', () => {
      renderCalculatorBuyboxChecklist();
      
      // With our mock data, all rules should pass
      const successIndicators = screen.getAllByTestId('status-success');
      expect(successIndicators.length).toBeGreaterThan(0);
    });

    it('should show error status for failing rules', () => {
      // Mock failing calculations
      mockCalculateCoCROI.mockReturnValueOnce(5); // Below 8% threshold
      mockCalculateGoingInCapRate.mockReturnValueOnce(6); // Below 7% threshold
      mockCalculate50PercentRuleCashFlow.mockReturnValueOnce(-100); // Below 0 threshold
      
      renderCalculatorBuyboxChecklist();
      
      const errorIndicators = screen.getAllByTestId('status-error');
      expect(errorIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('threshold management', () => {
    it('should load initial thresholds from context', () => {
      renderCalculatorBuyboxChecklist();
      
      expect(defaultContext.getRentalReportBuyBoxSetsPreference).toHaveBeenCalled();
    });

    it('should save thresholds when updated', async () => {
      const user = userEvent.setup();
      renderCalculatorBuyboxChecklist();
      
      const editButton = screen.getByText('Edit Thresholds');
      await user.click(editButton);
      
      // This would test the threshold update functionality
      // The actual implementation would depend on the component's internal state management
    });
  });

  describe('display formatting', () => {
    it('should format percentages correctly in edit mode', async () => {
      const user = userEvent.setup();
      renderCalculatorBuyboxChecklist();
      
      // Click edit button to enter edit mode
      const editButton = screen.getByText('Edit Thresholds');
      await user.click(editButton);
      
      // Now check that threshold values are displayed in inputs
      // These are the threshold values from the context mock
      expect(screen.getByDisplayValue('8.00%')).toBeInTheDocument(); // CoC ROI threshold
      expect(screen.getByDisplayValue('7.00%')).toBeInTheDocument(); // Cap Rate threshold
      expect(screen.getByDisplayValue('1.00%')).toBeInTheDocument(); // 1% Rule threshold
    });

    it('should format currency correctly in edit mode', async () => {
      const user = userEvent.setup();
      renderCalculatorBuyboxChecklist();
      
      // Click edit button to enter edit mode
      const editButton = screen.getByText('Edit Thresholds');
      await user.click(editButton);
      
      // Check that currency threshold value is displayed
      expect(screen.getByDisplayValue('$0')).toBeInTheDocument(); // 50% Rule threshold
    });
  });

  describe('user interactions', () => {
    it('should toggle edit mode when button is clicked', async () => {
      const user = userEvent.setup();
      renderCalculatorBuyboxChecklist();
      
      // Initially should show "Edit Thresholds"
      expect(screen.getByText('Edit Thresholds')).toBeInTheDocument();
      
      // Click to enter edit mode
      await user.click(screen.getByText('Edit Thresholds'));
      
      // Should now show "Save Thresholds"
      expect(screen.getByText('Save Thresholds')).toBeInTheDocument();
      
      // Click to save and exit edit mode
      await user.click(screen.getByText('Save Thresholds'));
      
      // Should be back to "Edit Thresholds"
      expect(screen.getByText('Edit Thresholds')).toBeInTheDocument();
    });
  });
}); 