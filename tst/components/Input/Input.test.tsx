import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../../src/components/Input/Input';

describe('Input', () => {
  const defaultProps = {
    label: 'Test Input',
    value: '',
    onChange: jest.fn(),
  };

  const renderInput = (props = {}) => {
    return render(<Input {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      renderInput();
      
      const label = screen.getByText('Test Input');
      const input = screen.getByRole('textbox');
      
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it('should render with required asterisk', () => {
      renderInput({ required: true });
      
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveStyle({ color: 'red' });
    });

    it('should render select input when type is select', () => {
      const options = ['Option 1', 'Option 2', 'Option 3'];
      renderInput({ type: 'select', options, value: 'Option 1' });
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      const optionElements = screen.getAllByRole('option');
      expect(optionElements).toHaveLength(3);
      expect(optionElements[0]).toHaveTextContent('Option 1');
    });

    it('should render checkbox when type is checkbox', () => {
      renderInput({ type: 'checkbox', value: false });
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('text input functionality', () => {
    it('should call onChange when text input changes', async () => {
      const mockOnChange = jest.fn();
      renderInput({ onChange: mockOnChange });
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });
      expect(mockOnChange).toHaveBeenCalledWith('test value');
    });

    it('should handle empty value', () => {
      renderInput({ value: '' });
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle undefined value', () => {
      renderInput({ value: undefined });
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('currency input functionality', () => {
    it('should format currency input correctly', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderInput({ type: 'currency', onChange: mockOnChange });
      const input = screen.getByRole('textbox');
      await user.type(input, '1234');
      expect(input).toHaveValue('$1,234');
      expect(mockOnChange).toHaveBeenCalledWith('$1,234');
    });

    it('should handle decimal currency input', async () => {
        const user = userEvent.setup();
        const mockOnChange = jest.fn();
        renderInput({ type: 'currency', onChange: mockOnChange });
        const input = screen.getByRole('textbox');
        await user.type(input, '1234.56');
        expect(input).toHaveValue('$1,234.56');
      });

    it('should limit decimal places to 2', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderInput({ type: 'currency', onChange: mockOnChange });
      const input = screen.getByRole('textbox');
      await user.type(input, '1234.567');
      expect(input).toHaveValue('$1,234.56');
    });

    it('should handle currency value exceeding maximum', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderInput({ type: 'currency', onChange: mockOnChange });
      const input = screen.getByRole('textbox');
      await user.type(input, '9999999999999999');
      expect(input).toBeInvalid();
    });
  });

  describe('percent input functionality', () => {
    it('should format percent input correctly', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderInput({ type: 'percent', onChange: mockOnChange });
      const input = screen.getByRole('textbox');
      await user.type(input, '50');
      expect(input).toHaveValue('50%');
      expect(mockOnChange).toHaveBeenCalledWith('50%');
    });

    it('should handle percent value exceeding 100', async () => {
        const user = userEvent.setup();
        const mockOnChange = jest.fn();
        renderInput({ type: 'percent', onChange: mockOnChange });
        const input = screen.getByRole('textbox');
        await user.type(input, '150');
        expect(input).toBeInvalid();
      });

    it('should handle negative percent value', async () => {
      renderInput({ type: 'percent', value: '-10' });
      const input = screen.getByRole('textbox');
      expect(input).toBeValid();
    });
  });

  describe('select input functionality', () => {
    it('should call onChange when select option changes', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      const options = ['Option 1', 'Option 2', 'Option 3'];
      
      renderInput({ type: 'select', options, value: 'Option 1', onChange: mockOnChange });
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'Option 2');
      
      expect(mockOnChange).toHaveBeenCalledWith('Option 2');
    });

    it('should render all options correctly', () => {
      const options = ['Apple', 'Banana', 'Cherry'];
      renderInput({ type: 'select', options, value: 'Apple' });
      
      const optionElements = screen.getAllByRole('option');
      expect(optionElements).toHaveLength(3);
      expect(optionElements[0]).toHaveTextContent('Apple');
      expect(optionElements[1]).toHaveTextContent('Banana');
      expect(optionElements[2]).toHaveTextContent('Cherry');
    });
  });

  describe('checkbox functionality', () => {
    it('should call onChange with true when checkbox is checked', () => {
      const mockOnChange = jest.fn();
      render(<Input type="checkbox" onChange={mockOnChange} value={false} checked={false} label="Checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when checkbox is unchecked', () => {
      const mockOnChange = jest.fn();
      render(<Input type="checkbox" onChange={mockOnChange} value={true} checked={true} label="Checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(mockOnChange).toHaveBeenCalledWith(false);
    });
  });

  describe('locked functionality', () => {
    it('should render lock button when locked is true', () => {
      renderInput({ locked: true });
      
      const lockButton = screen.getByText('🔓');
      expect(lockButton).toBeInTheDocument();
    });

    it('should disable input when locked', () => {
      renderInput({ locked: true });
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should toggle lock state when lock button is clicked', async () => {
      const user = userEvent.setup();
      renderInput({ locked: true });
      
      const lockButton = screen.getByText('🔓');
      const input = screen.getByRole('textbox');
      
      expect(input).toBeDisabled();
      
      await user.click(lockButton);
      
      expect(input).not.toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have proper label association', () => {
      renderInput({ id: 'test-input' });
      const label = screen.getByText('Test Input');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('should be accessible by label text', () => {
      renderInput({ id: 'test-input' });
      const input = screen.getByLabelText('Test Input');
      expect(input).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for required fields', () => {
      renderInput({ required: true });
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid input type', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderInput({ type: 'invalid' as any });
      }).toThrow('Invalid Input type: invalid. Use currency, checkbox, percent, select, or dont set this value.');
      
      consoleSpy.mockRestore();
    });
  });

  describe('caret position handling', () => {
    it('should handle caret position for currency input', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderInput({ type: 'currency' });
      const input = getByRole('textbox') as HTMLInputElement;
      await user.type(input, '123');
      expect(input.value).toBe('$123');
      await waitFor(() => {
        expect(input.selectionStart).toBe(4); // After '$123'
      });
    });

    it('should handle caret position for percent input', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderInput({ type: 'percent' });
      const input = getByRole('textbox') as HTMLInputElement;
      await user.type(input, '50');
      expect(input.value).toBe('50%');
      await waitFor(() => {
        expect(input.selectionStart).toBe(2); // After '50'
      });
    });
  });
}); 