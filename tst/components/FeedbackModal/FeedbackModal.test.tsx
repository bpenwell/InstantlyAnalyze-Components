import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackModal } from '../../../src/components/FeedbackModal/FeedbackModal';
import { BackendAPI, FeedbackType } from '@ben1000240/instantlyanalyze-module';

// Mock dependencies
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: {
      sub: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    },
  }),
}));

const mockSendFeedbackEmail = jest.fn();

jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  ...jest.requireActual('@ben1000240/instantlyanalyze-module'),
  BackendAPI: jest.fn().mockImplementation(() => ({
    sendFeedbackEmail: mockSendFeedbackEmail,
  })),
  FeedbackType: {
    Bug: 'bug',
    Feature: 'feature',
  },
}));

jest.mock('@cloudscape-design/components', () => ({
  Modal: ({ children, visible, onDismiss, header, footer }: any) => (
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
        <button onClick={onDismiss} data-testid="modal-close">Close</button>
      </div>
    ) : null
  ),
  Box: ({ children }: any) => <div data-testid="box">{children}</div>,
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button 
      data-testid={`button-${variant || 'default'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  SpaceBetween: ({ children }: any) => <div data-testid="space-between">{children}</div>,
  FormField: ({ label, children, info }: any) => (
    <div data-testid={`form-field-${label}`}>
      <label>{label}</label>
      {info && <span data-testid="field-info">{info}</span>}
      {children}
    </div>
  ),
  Input: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="input"
      value={value}
      onChange={(e) => onChange({ detail: { value: e.target.value } })}
      placeholder={placeholder}
    />
  ),
  Select: ({ selectedOption, onChange, options }: any) => (
    <select
      data-testid="select"
      value={selectedOption?.value}
      onChange={(e) => {
        const option = options.find((opt: any) => opt.value === e.target.value);
        onChange({ detail: { selectedOption: option } });
      }}
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
      data-testid="textarea"
      value={value}
      onChange={(e) => onChange({ detail: { value: e.target.value } })}
      placeholder={placeholder}
      rows={rows}
    />
  ),
  Alert: ({ type, children }: any) => <div data-testid={`alert-${type}`} role="alert">{children}</div>,
}));

describe('FeedbackModal', () => {
  const renderFeedbackModal = () => {
    return render(<FeedbackModal />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the feedback trigger link', () => {
      renderFeedbackModal();
      
      const feedbackLink = screen.getByText('Feedback');
      expect(feedbackLink).toBeInTheDocument();
      expect(feedbackLink).toHaveClass('text-base', 'font-semibold', 'cursor-pointer');
    });

    it('should not render modal initially', () => {
      renderFeedbackModal();
      
      const modal = screen.queryByTestId('modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should render modal when opened', async () => {
      const user = userEvent.setup();
      renderFeedbackModal();
      
      const feedbackLink = screen.getByText('Feedback');
      await user.click(feedbackLink);
      
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
    });

    it('should render modal header', async () => {
      const user = userEvent.setup();
      renderFeedbackModal();
      
      const feedbackLink = screen.getByText('Feedback');
      await user.click(feedbackLink);
      
      const header = screen.getByTestId('modal-header');
      expect(header).toHaveTextContent('Send Feedback');
    });
  });

  describe('form fields', () => {
    beforeEach(async () => {
      renderFeedbackModal();
      const feedbackLink = screen.getByText('Feedback');
      fireEvent.click(feedbackLink);
    });

    it('should render feedback type field', () => {
      const feedbackTypeField = screen.getByTestId('form-field-Feedback Type');
      expect(feedbackTypeField).toBeInTheDocument();
      
      const select = screen.getByTestId('select');
      expect(select).toBeInTheDocument();
    });

    it('should render email field with info', () => {
      const emailField = screen.getByTestId('form-field-Email');
      expect(emailField).toBeInTheDocument();
      
      const emailInfo = emailField.querySelector('[data-testid="field-info"]');
      expect(emailInfo).toHaveTextContent('Optional');
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'you@example.com');
    });

    it('should render note field with info', () => {
      const noteField = screen.getByTestId('form-field-Note to Developer');
      expect(noteField).toBeInTheDocument();
      
      const noteInfo = noteField.querySelector('[data-testid="field-info"]');
      expect(noteInfo).toHaveTextContent('Required');
      
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('placeholder', 'Describe your feedback...');
    });

    it('should have correct select options', () => {
      const select = screen.getByTestId('select');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('Report a Bug');
      expect(options[1]).toHaveTextContent('Suggest a Feature');
    });
  });

  describe('form interactions', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderFeedbackModal();
      
      const feedbackLink = screen.getByText('Feedback');
      await user.click(feedbackLink);
    });

    it('should handle feedback type change', async () => {
      const user = userEvent.setup();
      const select = screen.getByTestId('select');
      
      await user.selectOptions(select, 'feature');
      
      expect(select).toHaveValue('feature');
    });

    it('should handle email input', async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('input');
      
      await user.type(input, 'test@example.com');
      
      expect(input).toHaveValue('test@example.com');
    });

    it('should handle note input', async () => {
      const user = userEvent.setup();
      const textarea = screen.getByTestId('textarea');
      
      await user.type(textarea, 'This is a test feedback note');
      
      expect(textarea).toHaveValue('This is a test feedback note');
    });
  });

  describe('modal actions', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderFeedbackModal();
      
      const feedbackLink = screen.getByText('Feedback');
      await user.click(feedbackLink);
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const cancelButton = screen.getByTestId('button-link');
      
      await user.click(cancelButton);
      
      const modal = screen.queryByTestId('modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      const closeButton = screen.getByTestId('modal-close');
      
      await user.click(closeButton);
      
      const modal = screen.queryByTestId('modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should show submit button', () => {
      const submitButton = screen.getByTestId('button-primary');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Submit');
    });
  });

  describe('form validation', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderFeedbackModal();
      
      const feedbackLink = screen.getByText('Feedback');
      await user.click(feedbackLink);
    });

    it('should show error when submitting empty note', async () => {
      const user = userEvent.setup();
      const submitButton = screen.getByTestId('button-primary');
      
      await user.click(submitButton);
      
      const errorAlert = screen.getByTestId('alert-error');
      expect(errorAlert).toHaveTextContent('Please enter a note before submitting.');
    });

    it('should allow submission with valid note', async () => {
      const user = userEvent.setup();
      const textarea = screen.getByTestId('textarea');
      const submitButton = screen.getByTestId('button-primary');
      
      await user.type(textarea, 'Valid feedback note');
      await user.click(submitButton);
      
      // Should not show error
      const errorAlert = screen.queryByTestId('alert-error');
      expect(errorAlert).not.toBeInTheDocument();
    });
  });

  describe('API integration', () => {
    it('should call sendFeedbackEmail on successful submission', async () => {
      const user = userEvent.setup();
      mockSendFeedbackEmail.mockResolvedValueOnce({});
      
      render(<FeedbackModal />);
      await user.click(screen.getByText('Feedback'));

      await user.type(screen.getByPlaceholderText('you@example.com'), 'user@test.com');
      await user.type(screen.getByPlaceholderText('Describe your feedback...'), 'Test feedback');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(mockSendFeedbackEmail).toHaveBeenCalledWith(
          FeedbackType.Bug,
          'user@test.com',
          'Test feedback',
          'test-user-id'
        );
      });
    });

    it('should show error message on API failure', async () => {
      const user = userEvent.setup();
      mockSendFeedbackEmail.mockRejectedValueOnce(new Error('API Error'));
      
      render(<FeedbackModal />);
      await user.click(screen.getByText('Feedback'));

      await user.type(screen.getByPlaceholderText('Describe your feedback...'), 'Test feedback');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      const errorAlert = await screen.findByRole('alert');
      expect(errorAlert).toHaveTextContent('Failed to send feedback. Please try again.');
    });
  });

  describe('loading states', () => {
    it('should disable buttons and show loading text during submission', async () => {
      const user = userEvent.setup();
      mockSendFeedbackEmail.mockImplementationOnce(() => new Promise(() => {})); // Promise that never resolves
      
      render(<FeedbackModal />);
      await user.click(screen.getByText('Feedback'));

      await user.type(screen.getByPlaceholderText('Describe your feedback...'), 'Test feedback');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
        expect(screen.getByTestId('button-link')).toBeDisabled();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper alert roles', async () => {
      const user = userEvent.setup();
      mockSendFeedbackEmail.mockResolvedValueOnce({});
      
      render(<FeedbackModal />);
      await user.click(screen.getByText('Feedback'));

      await user.type(screen.getByPlaceholderText('Describe your feedback...'), 'Test feedback');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      const successAlert = await screen.findByRole('alert');
      expect(successAlert).toBeInTheDocument();
    });
  });
}); 