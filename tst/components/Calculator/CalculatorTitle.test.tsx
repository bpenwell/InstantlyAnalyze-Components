import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalculatorTitle } from '../../../src/components/Calculator/CalculatorTitle';
import { IRentalCalculatorPageProps } from '../../../src/interfaces';

// Mock the module
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  IRentalCalculatorData: jest.fn(),
}));

describe('CalculatorTitle', () => {
  const mockProps: IRentalCalculatorPageProps = {
    currentYear: 2024,
    currentYearData: {
      propertyInformation: {
        streetAddress: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        image: 'test-image.jpg'
      }
    } as any,
    fullLoanTermRentalReportData: [],
    initialRentalReportData: {} as any,
    updateInitialData: jest.fn(),
    reportId: 'test-report-id'
  };

  const renderCalculatorTitle = (props = mockProps) => {
    return render(<CalculatorTitle {...props} />);
  };

  describe('rendering', () => {
    it('should render with property information', () => {
      renderCalculatorTitle();
      
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Anytown, CA')).toBeInTheDocument();
    });

    it('should render property image', () => {
      renderCalculatorTitle();
      
      const image = screen.getByAltText('Property');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/public/propertyImage.png');
    });

        it('should render with different property data', () => {
      const differentProps = {
        currentYear: 2024,
        currentYearData: {
          propertyInformation: {
            streetAddress: '456 Oak Avenue',
            city: 'Springfield',
            state: 'IL',
            image: 'test-image.jpg'
          }
        } as any,
        fullLoanTermRentalReportData: [],
        initialRentalReportData: {} as any,
        updateInitialData: jest.fn(),
        reportId: 'test-report-id'
      };

      renderCalculatorTitle(differentProps);
      
      expect(screen.getByText('456 Oak Avenue')).toBeInTheDocument();
      expect(screen.getByText('Springfield, IL')).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      renderCalculatorTitle();
      
      const container = screen.getByText('123 Main St').closest('.calculator-container');
      expect(container).toBeInTheDocument();
      
      const titleContainer = screen.getByText('123 Main St').closest('.title-container');
      expect(titleContainer).toBeInTheDocument();
    });

    it('should apply correct text styling classes', () => {
      renderCalculatorTitle();
      
      const streetAddress = screen.getByText('123 Main St');
      expect(streetAddress).toHaveClass('text-3xl', 'font-bold');
      
      const cityState = screen.getByText('Anytown, CA');
      expect(cityState).toHaveClass('text-xl', 'font-bold');
    });
  });
}); 