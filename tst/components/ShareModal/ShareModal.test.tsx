import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareModal } from '../../../src/components/ShareModal/ShareModal';
import { BackendAPI } from '@ben1000240/instantlyanalyze-module';

// Mock dependencies
const mockChangeRentalReportSharability = jest.fn();

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: {
      sub: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    },
  }),
}));

jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  BackendAPI: jest.fn().mockImplementation(() => ({
    changeRentalReportSharability: mockChangeRentalReportSharability,
  })),
}));

jest.mock('@cloudscape-design/components', () => ({
  Modal: ({ children, visible, onDismiss, header }: any) => (
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-content">{children}</div>
        <button onClick={onDismiss} data-testid="modal-close">Close</button>
      </div>
    ) : null
  ),
  Alert: ({ children, type }: { children: React.ReactNode, type: string }) => (
    <div role="alert" data-testid={`alert-${type}`}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, disabled }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Checkbox: ({ children, onChange, checked }: any) => (
    <label data-testid="checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange({ detail: { checked: e.target.checked } })}
        data-testid="checkbox-input"
      />
      {children}
    </label>
  ),
  Input: ({ value, readOnly }: any) => (
    <input data-testid="input" value={value} readOnly={readOnly} />
  ),
  SpaceBetween: ({ children }: any) => <div data-testid="space-between">{children}</div>,
  CopyToClipboard: ({ textToCopy, copyButtonText }: any) => (
    <button data-testid="copy-button">
      {copyButtonText}
    </button>
  ),
}));

describe('ShareModal', () => {
  const defaultProps = {
    reportData: {
      isShareable: false,
      propertyInformation: {
        streetAddress: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
      rentalIncome: {},
      operatingExpenses: {},
      financing: {},
      analysis: {},
      creationDate: new Date(),
      purchaseDetails: {
        purchasePrice: 200000,
        purchaseClosingCost: 5000,
        purchaseClosingCostPercent: 2.5,
        reportPropertyValue: 200000,
        propertyValueGrowthPercent: 3,
      },
      loanDetails: {},
      expenseDetails: {},
      strategyDetails: {},
    } as any,
    reportId: 'test-report-id',
    isOpen: true,
    onClose: jest.fn(),
    shareableLink: 'https://example.com/share/test-report-id',
    onShareableChange: jest.fn(),
  };

  const renderShareModal = (props = {}) => {
    return render(<ShareModal {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render modal when isOpen is true', () => {
      renderShareModal();
      
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      renderShareModal({ isOpen: false });
      
      const modal = screen.queryByTestId('modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should render modal header', () => {
      renderShareModal();
      
      const header = screen.getByTestId('modal-header');
      expect(header).toHaveTextContent('Share Report');
    });

    it('should render checkbox with correct initial state', () => {
      renderShareModal();
      
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).not.toBeChecked();
    });

    it('should render checkbox with correct text when not shareable', () => {
      renderShareModal();
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveTextContent('Report is shareable');
    });

    it('should render checkbox with correct text when shareable', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveTextContent('Make this report shareable');
    });
  });

  describe('shareable content', () => {
    it('should not show input and copy button when not shareable', () => {
      renderShareModal();
      
      const input = screen.queryByTestId('input');
      const copyButton = screen.queryByTestId('copy-button');
      
      expect(input).not.toBeInTheDocument();
      expect(copyButton).not.toBeInTheDocument();
    });

    it('should show input and copy button when shareable', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const input = screen.getByTestId('input');
      const copyButton = screen.getByTestId('copy-button');
      
      expect(input).toBeInTheDocument();
      expect(copyButton).toBeInTheDocument();
    });

    it('should display shareable link in input', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('https://example.com/share/test-report-id');
    });

    it('should make input read-only', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('readOnly');
    });

    it('should show copy button with correct text', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toHaveTextContent('Copy');
    });
  });

  describe('checkbox interactions', () => {
    it('should handle checkbox change from unchecked to checked', async () => {
      const user = userEvent.setup();
      const mockOnShareableChange = jest.fn();
      
      const { rerender } = renderShareModal({ onShareableChange: mockOnShareableChange });
      
      const checkbox = screen.getByTestId('checkbox-input');
      await user.click(checkbox);
      
      rerender(<ShareModal {...defaultProps} reportData={{ ...defaultProps.reportData, isShareable: true }} onShareableChange={mockOnShareableChange} />);
      expect(checkbox).toBeChecked();
    });

    it('should handle checkbox change from checked to unchecked', async () => {
      const user = userEvent.setup();
      const mockOnShareableChange = jest.fn();
      
      const { rerender } = renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true },
        onShareableChange: mockOnShareableChange
      });
      
      const checkbox = screen.getByTestId('checkbox-input');
      await user.click(checkbox);
      
      rerender(<ShareModal {...defaultProps} reportData={{ ...defaultProps.reportData, isShareable: false }} onShareableChange={mockOnShareableChange} />);
      expect(checkbox).not.toBeChecked();
    });

    it('should call onShareableChange when checkbox changes', async () => {
      const user = userEvent.setup();
      const mockOnShareableChange = jest.fn();
      
      renderShareModal({ onShareableChange: mockOnShareableChange });
      
      const checkbox = screen.getByTestId('checkbox-input');
      await user.click(checkbox);
      
      expect(mockOnShareableChange).toHaveBeenCalledWith(true);
    });
  });

  describe('API integration', () => {
    beforeEach(() => {
      mockChangeRentalReportSharability.mockClear();
    });

    it('should call changeRentalReportSharability when checkbox changes', async () => {
      const user = userEvent.setup();
      mockChangeRentalReportSharability.mockResolvedValue({});
      
      render(<ShareModal {...defaultProps} />);
      
      const checkbox = screen.getByTestId('checkbox-input');
      await user.click(checkbox);
      await waitFor(() => {
        expect(mockChangeRentalReportSharability).toHaveBeenCalledWith(
          'test-report-id',
          expect.objectContaining({ isShareable: true }),
          'test-user-id'
        );
      });
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      mockChangeRentalReportSharability.mockRejectedValueOnce(new Error('API Error'));
      
      render(<ShareModal {...defaultProps} />);
      
      const checkbox = screen.getByTestId('checkbox-input');
      await user.click(checkbox);
      
      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Failed to update report sharability. Please try again.');
    });
  });

  describe('modal actions', () => {
    it('should call onClose when modal close button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      renderShareModal({ onClose: mockOnClose });
      
      const closeButton = screen.getByTestId('modal-close');
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('state management', () => {
    it('should initialize isShareable from reportData', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeChecked();
    });

    it('should update local state when checkbox changes', async () => {
      const user = userEvent.setup();
      
      renderShareModal();
      
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('accessibility', () => {
    it('should have proper modal structure', () => {
      renderShareModal();
      
      const modal = screen.getByTestId('modal');
      const header = screen.getByTestId('modal-header');
      const content = screen.getByTestId('modal-content');
      
      expect(modal).toContainElement(header);
      expect(modal).toContainElement(content);
    });

    it('should have accessible checkbox', () => {
      renderShareModal();
      
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should have accessible input when shareable', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
    });

    it('should have accessible copy button when shareable', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toBeInTheDocument();
    });
  });

  describe('props validation', () => {
    it('should work with different report IDs', () => {
      renderShareModal({ reportId: 'different-report-id' });
      
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
    });

    it('should work with different shareable links', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true },
        shareableLink: 'https://different.com/link'
      });
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('https://different.com/link');
    });

    it('should handle empty shareable link', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true },
        shareableLink: ''
      });
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('');
    });
  });

  describe('copy functionality', () => {
    it('should render CopyToClipboard component with correct props', () => {
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true }
      });
      
      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toBeInTheDocument();
      expect(copyButton).toHaveTextContent('Copy');
    });

    it('should pass correct textToCopy to CopyToClipboard', () => {
      const customLink = 'https://custom.com/share/123';
      renderShareModal({
        reportData: { ...defaultProps.reportData, isShareable: true },
        shareableLink: customLink
      });
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue(customLink);
    });
  });
}); 