import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from '../../../src/components/Dropdown/Dropdown';

describe('Dropdown', () => {
  const defaultProps = {
    id: 'test-dropdown',
    label: 'Test Dropdown',
    options: ['Option 1', 'Option 2', 'Option 3'],
    onChange: jest.fn()
  };

  const renderDropdown = (props = {}) => {
    return render(<Dropdown {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      renderDropdown();
      
      const label = screen.getByText('Test Dropdown');
      const select = screen.getByRole('combobox');
      
      expect(label).toBeInTheDocument();
      expect(select).toBeInTheDocument();
    });

    it('should render all options', () => {
      renderDropdown();
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('should render with custom label', () => {
      renderDropdown({ label: 'Custom Label' });
      
      const label = screen.getByText('Custom Label');
      expect(label).toBeInTheDocument();
    });

    it('should render with custom options', () => {
      const customOptions = ['Apple', 'Banana', 'Cherry'];
      renderDropdown({ options: customOptions });
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Apple');
      expect(options[1]).toHaveTextContent('Banana');
      expect(options[2]).toHaveTextContent('Cherry');
    });

    it('should render with selected value', () => {
      renderDropdown({ value: 'Option 2' });
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('Option 2');
    });
  });

  describe('user interactions', () => {
    it('should call onChange when option is selected', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      
      renderDropdown({ onChange: mockOnChange });
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'Option 2');
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should pass correct event to onChange handler', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      
      renderDropdown({ onChange: mockOnChange });
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'Option 3');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'Option 3'
          })
        })
      );
    });

    it('should handle empty options array', () => {
      renderDropdown({ options: [] });
      
      const select = screen.getByRole('combobox');
      const options = screen.queryAllByRole('option');
      
      expect(select).toBeInTheDocument();
      expect(options).toHaveLength(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper label association', () => {
      renderDropdown();
      
      const label = screen.getByText('Test Dropdown');
      const select = screen.getByRole('combobox');
      
      expect(label).toHaveAttribute('for', 'test-dropdown');
      expect(select).toHaveAttribute('id', 'test-dropdown');
    });

    it('should have combobox role', () => {
      renderDropdown();
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should have proper option roles', () => {
      renderDropdown();
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      
      options.forEach(option => {
        expect(option).toHaveAttribute('value');
      });
    });

    it('should be accessible by label text', () => {
      renderDropdown();
      
      const select = screen.getByLabelText('Test Dropdown');
      expect(select).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('should have correct CSS classes', () => {
      renderDropdown();
      
      const container = screen.getByText('Test Dropdown').parentElement;
      const label = screen.getByText('Test Dropdown');
      const select = screen.getByRole('combobox');
      
      expect(container).toHaveClass('input-container');
      expect(label).toHaveClass('label');
      expect(select).toHaveClass('input-field');
    });

    it('should have proper DOM structure', () => {
      renderDropdown();
      
      const container = screen.getByText('Test Dropdown').parentElement;
      const label = screen.getByText('Test Dropdown');
      const select = screen.getByRole('combobox');
      
      expect(container).toContainElement(label);
      expect(container).toContainElement(select);
    });

    it('should have unique keys for options', () => {
      renderDropdown();
      
      const options = screen.getAllByRole('option');
      const keys = options.map(option => option.getAttribute('value'));
      
      // Check that all keys are unique
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });

  describe('props validation', () => {
    it('should handle undefined value prop', () => {
      renderDropdown({ value: undefined });
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // When no value is provided, it defaults to the first option
      expect(select).toHaveValue('Option 1');
    });

    it('should handle empty string value', () => {
      renderDropdown({ value: '' });
      
      const select = screen.getByRole('combobox');
      // When empty string is provided, it defaults to the first option
      expect(select).toHaveValue('Option 1');
    });

    it('should handle value that matches an option', () => {
      renderDropdown({ value: 'Option 1' });
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('Option 1');
    });
  });
}); 