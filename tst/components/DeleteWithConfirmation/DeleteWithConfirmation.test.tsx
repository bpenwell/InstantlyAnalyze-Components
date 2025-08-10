import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteWithConfirmation } from '../../../src/components/DeleteWithConfirmation/DeleteWithConfirmation';

// Mock Cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick}>{children}</button>
  ),
  Modal: ({ children, visible, onDismiss, header, footer }: any) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div>{children}</div>
        <div>{footer}</div>
        <button data-testid="modal-dismiss" onClick={onDismiss}>Dismiss</button>
      </div>
    ) : null,
  Box: ({ children }: any) => <div>{children}</div>,
  SpaceBetween: ({ children }: any) => <div>{children}</div>,
  Alert: ({ children }: any) => <div data-testid="alert">{children}</div>,
}));

const mockItems = [
  { id: '1', name: 'Test Item 1' },
  { id: '2', name: 'Test Item 2' },
];

const TestWrapper = (props: any) => {
  const deleteRef = useRef<{ openModal: () => void }>(null);

  return (
    <div>
      <button onClick={() => deleteRef.current?.openModal()}>Open Delete Modal</button>
      <DeleteWithConfirmation ref={deleteRef} {...props} />
    </div>
  );
};

describe('DeleteWithConfirmation', () => {
  const defaultProps = {
    itemsToDelete: mockItems,
    onDeleteConfirmed: jest.fn(),
  };

  const renderDeleteWithConfirmation = (props = {}) => {
    return render(<TestWrapper {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not be visible initially', () => {
      renderDeleteWithConfirmation();
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should be visible after opening', async () => {
      renderDeleteWithConfirmation();
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should show correct header for multiple items', () => {
      renderDeleteWithConfirmation();
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByTestId('modal-header')).toHaveTextContent('Delete items');
    });

    it('should show correct header for single item', () => {
      renderDeleteWithConfirmation({ itemsToDelete: [mockItems[0]] });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByTestId('modal-header')).toHaveTextContent('Delete item');
    });
  });

  describe('content', () => {
    it('should show correct message for multiple items', () => {
      renderDeleteWithConfirmation();
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      expect(screen.getByText(/2 items/)).toBeInTheDocument();
    });

    it('should show correct message for single item', () => {
      renderDeleteWithConfirmation({ itemsToDelete: [mockItems[0]] });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByText(/Are you sure you want to delete item/)).toBeInTheDocument();
    });

    it('should show item name when itemFieldNameForName is provided', () => {
      renderDeleteWithConfirmation({ itemsToDelete: [mockItems[0]], itemFieldNameForName: 'name' });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByText(/Test Item 1/)).toBeInTheDocument();
    });

    it('should show item id when itemFieldNameForName is not provided', () => {
      renderDeleteWithConfirmation({ itemsToDelete: [mockItems[0]] });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('should show alert with correct message', () => {
      renderDeleteWithConfirmation();
      fireEvent.click(screen.getByText('Open Delete Modal'));
      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Deleting these items will remove all associated data/);
    });
  });

  describe('user interactions', () => {
    it('should close modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderDeleteWithConfirmation();
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      
      const cancelButton = screen.getByTestId('button-link');
      await user.click(cancelButton);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should call onDeleteConfirmed when delete is confirmed', async () => {
      const user = userEvent.setup();
      const onDeleteConfirmed = jest.fn();
      renderDeleteWithConfirmation({ onDeleteConfirmed });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      
      const deleteButton = screen.getByTestId('button-primary');
      await user.click(deleteButton);
      
      expect(onDeleteConfirmed).toHaveBeenCalledWith(mockItems);
    });

    it('should close modal when dismiss is clicked', async () => {
      const user = userEvent.setup();
      renderDeleteWithConfirmation();
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      
      const dismissButton = screen.getByTestId('modal-dismiss');
      await user.click(dismissButton);
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('custom item types', () => {
    it('should use custom item type in message', () => {
      renderDeleteWithConfirmation({ itemsToDelete: [mockItems[0]], itemType: 'property' });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByText(/Are you sure you want to delete property/)).toBeInTheDocument();
    });

    it('should use custom item type for multiple items', () => {
      renderDeleteWithConfirmation({ itemType: 'property' });
      fireEvent.click(screen.getByText('Open Delete Modal'));
      expect(screen.getByText(/2/)).toBeInTheDocument();
      expect(screen.getByText(/properties/)).toBeInTheDocument();
    });
  });
}); 