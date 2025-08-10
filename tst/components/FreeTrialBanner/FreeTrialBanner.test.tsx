import React from 'react';
import { render, screen } from '@testing-library/react';
import { FreeTrialBanner, BannerType } from '../../../src/components/FreeTrialBanner/FreeTrialBanner';

// Mock the AppContext
jest.mock('../../../src/utils/AppContextProvider', () => ({
  useAppContext: jest.fn(),
}));

// Mock the Cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  Alert: ({ type, header, children }: any) => (
    <div data-testid={`alert-${type}`} data-header={header}>
      {children}
    </div>
  ),
}));

describe('FreeTrialBanner', () => {
  const mockUseAppContext = require('../../../src/utils/AppContextProvider').useAppContext;

  const defaultContext = {
    isUserLoading: false,
    isPaidMember: jest.fn().mockReturnValue(false),
    getRemainingFreeRentalReports: jest.fn().mockReturnValue(5),
    getRemainingFreeZillowScrapes: jest.fn().mockReturnValue(3),
  };

  const renderFreeTrialBanner = (bannerType: BannerType, context = defaultContext) => {
    mockUseAppContext.mockReturnValue(context);
    return render(<FreeTrialBanner bannerType={bannerType} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rental reports banner', () => {
    it('should render rental reports banner with remaining uses', () => {
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS);
      
      const alert = screen.getByTestId('alert-warning');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('data-header', 'Limited Free Uses');
      expect(alert).toHaveTextContent('You have 5 more free InstantlyReport uses under the free tier');
    });

    it('should render rental reports banner when no uses remaining', () => {
      const context = {
        ...defaultContext,
        getRemainingFreeRentalReports: jest.fn().mockReturnValue(0),
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      const alert = screen.getByTestId('alert-error');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('data-header', 'Subscription Required');
      expect(alert).toHaveTextContent('You have 0 more free InstantlyReport uses under the free tier');
    });
  });

  describe('zillow scraper banner', () => {
    it('should render zillow scraper banner with remaining uses', () => {
      renderFreeTrialBanner(BannerType.ZILLOW_SCRAPER);
      
      const alert = screen.getByTestId('alert-warning');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('data-header', 'Limited Free Uses');
      expect(alert).toHaveTextContent('You have 3 more free InstantlyScan uses under the free tier');
    });

    it('should render zillow scraper banner when no uses remaining', () => {
      const context = {
        ...defaultContext,
        getRemainingFreeZillowScrapes: jest.fn().mockReturnValue(0),
      };
      
      renderFreeTrialBanner(BannerType.ZILLOW_SCRAPER, context);
      
      const alert = screen.getByTestId('alert-error');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('data-header', 'Subscription Required');
      expect(alert).toHaveTextContent('You have 0 more free InstantlyScan uses under the free tier');
    });
  });

  describe('user states', () => {
    it('should not render when user is paid member', () => {
      const context = {
        ...defaultContext,
        isPaidMember: jest.fn().mockReturnValue(true),
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert-error')).not.toBeInTheDocument();
    });

    it('should not render when user is loading', () => {
      const context = {
        ...defaultContext,
        isUserLoading: true,
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert-error')).not.toBeInTheDocument();
    });

    it('should not render when remaining uses is null', () => {
      const context = {
        ...defaultContext,
        getRemainingFreeRentalReports: jest.fn().mockReturnValue(null),
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert-error')).not.toBeInTheDocument();
    });
  });

  describe('banner content', () => {
    it('should include subscription message', () => {
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS);
      
      expect(screen.getByText(/Subscribe in order to have unlimited usage/)).toBeInTheDocument();
    });

    it('should show correct remaining uses count', () => {
      const context = {
        ...defaultContext,
        getRemainingFreeRentalReports: jest.fn().mockReturnValue(10),
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      expect(screen.getByTestId('alert-warning')).toHaveTextContent('You have 10 more free');
    });

    it('should use strong tag for remaining uses count', () => {
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS);
      
      const strongElement = screen.getByText('5');
      expect(strongElement.tagName).toBe('STRONG');
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid banner type', () => {
      expect(() => {
        renderFreeTrialBanner('INVALID_TYPE' as BannerType);
      }).toThrow('Invalid BannerType: INVALID_TYPE');
    });
  });

  describe('different remaining use counts', () => {
    it('should handle single remaining use', () => {
      const context = {
        ...defaultContext,
        getRemainingFreeRentalReports: jest.fn().mockReturnValue(1),
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      expect(screen.getByTestId('alert-warning')).toHaveTextContent('You have 1 more free');
    });

    it('should handle large number of remaining uses', () => {
      const context = {
        ...defaultContext,
        getRemainingFreeRentalReports: jest.fn().mockReturnValue(999),
      };
      
      renderFreeTrialBanner(BannerType.RENTAL_REPORTS, context);
      
      expect(screen.getByTestId('alert-warning')).toHaveTextContent('You have 999 more free');
    });
  });
}); 