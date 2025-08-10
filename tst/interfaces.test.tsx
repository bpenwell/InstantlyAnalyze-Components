import { IRentalCalculatorPageProps } from '../src/interfaces';

describe('Interfaces', () => {
  describe('IRentalCalculatorPageProps', () => {
    it('should have required properties', () => {
      // This test verifies that the interface exists and can be used
      const mockProps: IRentalCalculatorPageProps = {
        currentYear: 2024,
        currentYearData: {
          propertyInformation: {
            streetAddress: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            image: 'test-image.jpg',
          },
          rentalIncome: {
            grossMonthlyIncome: 2000,
          },
          purchaseDetails: {
            purchasePrice: 200000,
            purchaseClosingCost: 5000,
            purchaseClosingCostPercent: 2.5,
            reportPropertyValue: 200000,
            propertyValueGrowthPercent: 3,
          },
          operatingExpenses: {},
          financing: {},
          analysis: {},
          strategyDetails: {},
        } as any,
        fullLoanTermRentalReportData: [],
        initialRentalReportData: {
          propertyInformation: {
            streetAddress: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            image: 'test-image.jpg',
          },
          rentalIncome: {
            grossMonthlyIncome: 2000,
          },
          purchaseDetails: {
            purchasePrice: 200000,
            purchaseClosingCost: 5000,
            purchaseClosingCostPercent: 2.5,
            reportPropertyValue: 200000,
            propertyValueGrowthPercent: 3,
          },
          operatingExpenses: {},
          financing: {},
          analysis: {},
          strategyDetails: {},
        } as any,
        updateInitialData: jest.fn(),
        reportId: 'test-report-id',
      };

      expect(mockProps.currentYear).toBe(2024);
      expect(mockProps.currentYearData).toBeDefined();
      expect(mockProps.fullLoanTermRentalReportData).toBeDefined();
      expect(mockProps.initialRentalReportData).toBeDefined();
      expect(mockProps.updateInitialData).toBeDefined();
      expect(mockProps.reportId).toBe('test-report-id');
    });

    it('should have correct property types', () => {
      const mockProps: IRentalCalculatorPageProps = {
        currentYear: 2024,
        currentYearData: {} as any,
        fullLoanTermRentalReportData: [],
        initialRentalReportData: {} as any,
        updateInitialData: jest.fn(),
        reportId: 'test-report-id',
      };

      expect(typeof mockProps.currentYear).toBe('number');
      expect(typeof mockProps.currentYearData).toBe('object');
      expect(Array.isArray(mockProps.fullLoanTermRentalReportData)).toBe(true);
      expect(typeof mockProps.initialRentalReportData).toBe('object');
      expect(typeof mockProps.updateInitialData).toBe('function');
      expect(typeof mockProps.reportId).toBe('string');
    });
  });
}); 