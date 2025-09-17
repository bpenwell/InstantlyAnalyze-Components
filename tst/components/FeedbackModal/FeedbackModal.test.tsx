import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackModal } from '../../../src/components/FeedbackModal/FeedbackModal';

// Mock the BackendAPI
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  BackendAPI: jest.fn().mockImplementation(() => ({
    sendFeedbackEmail: jest.fn().mockResolvedValue({}),
  })),
  FeedbackType: {
    Bug: 'Bug',
    Feature: 'Feature',
    ContactUs: 'Contact Us',
    Referral: 'Referral',
  },
}));

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { sub: 'test-user-id', email: 'test@example.com' },
  }),
}));

// Mock Cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  Modal: ({ visible, children, onDismiss }: any) => 
    visible ? (
      <div data-testid="modal" role="dialog">
        <button onClick={onDismiss} aria-label="Close feedback modal">Close</button>
        {children}
      </div>
    ) : null,
  Box: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
  SpaceBetween: ({ children }: any) => <div>{children}</div>,
  FormField: ({ label, children }: any) => (
    <div>
      <label>{label}</label>
      {children}
    </div>
  ),
  Input: ({ value, onChange, placeholder, type }: any) => (
    <input
      value={value}
      onChange={(e) => onChange({ detail: { value: e.target.value } })}
      placeholder={placeholder}
      type={type}
    />
  ),
  Select: ({ selectedOption, onChange, options }: any) => (
    <select
      value={selectedOption?.value}
      onChange={(e) => onChange({ detail: { selectedOption: { value: e.target.value } } })}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  Textarea: ({ value, onChange, placeholder, rows }: any) => (
    <textarea
      value={value}
      onChange={(e) => onChange({ detail: { value: e.target.value } })}
      placeholder={placeholder}
      rows={rows}
    />
  ),
  Alert: ({ type, children }: any) => <div data-testid={`alert-${type}`} role="alert">{children}</div>,
}));

describe('FeedbackModal', () => {
  const renderFeedbackModal = (props = {}) => {
    const defaultProps = {
      visible: false,
      onDismiss: jest.fn(),
      feedbackType: 'Bug' as any,
      ...props
    };
    return render(<FeedbackModal {...defaultProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the modal when visible is true', () => {
      renderFeedbackModal({ visible: true });
      
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });

    it('should not render modal when visible is false', () => {
      renderFeedbackModal({ visible: false });
      
      const modal = screen.queryByRole('dialog');
      expect(modal).not.toBeInTheDocument();
    });
  });

  describe('modal interaction', () => {
    it('should call onDismiss when close button is clicked', async () => {
      const onDismiss = jest.fn();
      const user = userEvent.setup();
      renderFeedbackModal({ visible: true, onDismiss });
      
      const closeButton = screen.getByLabelText('Close feedback modal');
      await user.click(closeButton);
      
      expect(onDismiss).toHaveBeenCalled();
    });
  });
});