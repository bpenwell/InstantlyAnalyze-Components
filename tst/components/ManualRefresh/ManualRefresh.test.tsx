import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManualRefresh } from '../../../src/components/ManualRefresh/ManualRefresh';

// Mock the Cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
  Button: ({ onClick, loading, disabled, iconName, ariaLabel, loadingText, children, ...rest }: any) => (
    <button
      data-testid="refresh-button"
      onClick={loading ? () => {} : onClick}
      data-loading={loading ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-icon={iconName}
      aria-label={ariaLabel}
      data-loading-text={loadingText}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  ),
  Box: ({ children, variant, fontSize, padding, color, textAlign }: any) => (
    <div data-testid="box" data-variant={variant} data-font-size={fontSize} data-padding={padding} data-color={color} data-text-align={textAlign}>
      {children}
    </div>
  ),
  SpaceBetween: ({ children, direction, size, alignItems }: any) => (
    <div data-testid="manual-refresh" data-direction={direction} data-size={size} data-align-items={alignItems}>
      {children}
    </div>
  ),
}));

// Mock date-fns
jest.mock('date-fns/format', () => ({
  formatDate: jest.fn((date: Date) => `Formatted: ${date.toISOString()}`),
}));

describe('ManualRefresh', () => {
  const mockOnRefresh = jest.fn();
  const mockLastRefresh = new Date('2024-01-15T10:30:00Z');

  const defaultProps = {
    onRefresh: mockOnRefresh,
    loading: false,
    lastRefresh: mockLastRefresh,
    disabled: false,
  };

  const renderManualRefresh = (props = {}) => {
    return render(<ManualRefresh {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with correct test id', () => {
      renderManualRefresh();
      
      expect(screen.getByTestId('manual-refresh')).toBeInTheDocument();
    });

    it('should render with correct SpaceBetween props', () => {
      renderManualRefresh();
      
      const container = screen.getByTestId('manual-refresh');
      expect(container).toHaveAttribute('data-direction', 'horizontal');
      expect(container).toHaveAttribute('data-size', 'xs');
      expect(container).toHaveAttribute('data-align-items', 'center');
    });

    it('should render last refresh information', () => {
      renderManualRefresh();
      
      const box = screen.getByTestId('box');
      expect(box).toHaveAttribute('data-variant', 'p');
      expect(box).toHaveAttribute('data-font-size', 'body-s');
      expect(box).toHaveAttribute('data-padding', 'n');
      expect(box).toHaveAttribute('data-color', 'text-status-inactive');
      expect(box).toHaveAttribute('data-text-align', 'right');
    });

    it('should render refresh button', () => {
      renderManualRefresh();
      
      const button = screen.getByTestId('refresh-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-icon', 'refresh');
      expect(button).toHaveAttribute('aria-label', 'Refresh');
      expect(button).toHaveAttribute('data-loading-text', 'Refreshing table content');
    });
  });

  describe('last refresh display', () => {
    it('should display last refresh text', () => {
      renderManualRefresh();
      
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });

    it('should display formatted date', () => {
      renderManualRefresh();
      
      expect(screen.getByText(/Formatted:/)).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for live region', () => {
      renderManualRefresh();
      
      const liveRegion = screen.getByRole('log');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('should not render last refresh when not provided', () => {
      renderManualRefresh({ lastRefresh: undefined });
      
      expect(screen.queryByText('Last updated')).not.toBeInTheDocument();
    });
  });

  describe('button states', () => {
    it('should render button in normal state', () => {
      renderManualRefresh();
      
      const button = screen.getByTestId('refresh-button');
      expect(button).toHaveAttribute('data-loading', 'false');
      expect(button).toHaveAttribute('data-disabled', 'false');
      expect(button).not.toBeDisabled();
    });

    it('should render button in loading state', () => {
      renderManualRefresh({ loading: true });
      
      const button = screen.getByTestId('refresh-button');
      expect(button).toHaveAttribute('data-loading', 'true');
    });

    it('should render button in disabled state', () => {
      renderManualRefresh({ disabled: true });
      
      const button = screen.getByTestId('refresh-button');
      expect(button).toHaveAttribute('data-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('should render button in loading and disabled state', () => {
      renderManualRefresh({ loading: true, disabled: true });
      
      const button = screen.getByTestId('refresh-button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toHaveAttribute('data-disabled', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('user interactions', () => {
    it('should call onRefresh when button is clicked', async () => {
      const user = userEvent.setup();
      renderManualRefresh();
      
      const button = screen.getByTestId('refresh-button');
      await user.click(button);
      
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should not call onRefresh when button is disabled', async () => {
      const user = userEvent.setup();
      renderManualRefresh({ disabled: true });
      
      const button = screen.getByTestId('refresh-button');
      await user.click(button);
      
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });

    it('should not call onRefresh when button is loading', async () => {
      const user = userEvent.setup();
      renderManualRefresh({ loading: true });
      
      const button = screen.getByTestId('refresh-button');
      await user.click(button);
      
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });

  describe('date formatting', () => {
    it('should format different dates correctly', () => {
      const differentDate = new Date('2024-12-25T15:45:00Z');
      renderManualRefresh({ lastRefresh: differentDate });
      
      expect(screen.getByText(/Formatted:/)).toBeInTheDocument();
    });

    it('should handle null date gracefully', () => {
      renderManualRefresh({ lastRefresh: null as any });
      
      expect(screen.queryByText('Last updated')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderManualRefresh();
      
      const button = screen.getByTestId('refresh-button');
      expect(button).toHaveAttribute('aria-label', 'Refresh');
    });

    it('should have proper ARIA live regions', () => {
      renderManualRefresh();
      
      const liveRegion = screen.getByRole('log');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });
}); 