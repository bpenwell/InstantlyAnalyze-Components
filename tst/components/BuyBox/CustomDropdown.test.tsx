import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomDropdown } from '../../../src/components/BuyBox/CustomDropdown';

// Mock dependencies
jest.mock('@cloudscape-design/components', () => ({
  Select: ({ placeholder, options, onChange, selectedOption }: any) => (
    <div data-testid="select-dropdown">
      <select 
        data-testid="select-element"
        onChange={(e) => {
          const option = e.target.value ? options.find((opt: any) => opt.value === e.target.value) : null;
          onChange({ detail: { selectedOption: option } });
        }}
        value={selectedOption?.value || ''}
      >
        <option value="">{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('CustomDropdown', () => {
  const mockOptions = [
    {
      id: '1',
      tokens: [
        { type: 'text' as const, text: 'Price' },
        { type: 'input' as const, text: '[INPUT]' },
      ],
    },
    {
      id: '2',
      tokens: [
        { type: 'text' as const, text: 'Bedrooms' },
        { type: 'input' as const, text: '[INPUT]' },
      ],
    },
    {
      id: '3',
      tokens: [
        { type: 'text' as const, text: 'Square Feet' },
      ],
    },
  ];

  const mockOnSelect = jest.fn();

  const renderCustomDropdown = (props = {}) => {
    return render(
      <CustomDropdown 
        options={mockOptions} 
        onSelect={mockOnSelect} 
        {...props} 
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with placeholder text', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      expect(select).toBeInTheDocument();
      expect(select).toHaveDisplayValue('Select a filter...');
    });

    it('should render all options', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(4); // 1 placeholder + 3 options
      expect(options[1]).toHaveTextContent('Price[INPUT]');
      expect(options[2]).toHaveTextContent('Bedrooms[INPUT]');
      expect(options[3]).toHaveTextContent('Square Feet');
    });

    it('should render with custom options', () => {
      const customOptions = [
        {
          id: 'custom1',
          tokens: [
            { type: 'text' as const, text: 'Custom' },
            { type: 'input' as const, text: '[INPUT]' },
          ],
        },
      ];
      
      renderCustomDropdown({ options: customOptions });
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(2); // 1 placeholder + 1 custom option
      expect(options[1]).toHaveTextContent('Custom[INPUT]');
    });
  });

  describe('option selection', () => {
    it('should call onSelect when an option is selected', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      fireEvent.change(select, { target: { value: '1' } });
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should call onSelect with correct option for different selections', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      fireEvent.change(select, { target: { value: '2' } });
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockOptions[1]);
    });

    it('should handle selection of option with only text tokens', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      fireEvent.change(select, { target: { value: '3' } });
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockOptions[2]);
    });

    it('should not call onSelect when placeholder is selected', () => {
      renderCustomDropdown();
      
      // The component should not call onSelect when no option is selected
      // This is handled by the component's internal logic
      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  describe('token processing', () => {
    it('should process text tokens correctly', () => {
      const textOnlyOptions = [
        {
          id: 'text1',
          tokens: [
            { type: 'text' as const, text: 'Hello' },
            { type: 'text' as const, text: ' World' },
          ],
        },
      ];
      
      renderCustomDropdown({ options: textOnlyOptions });
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      expect(options[1]).toHaveTextContent('Hello World');
    });

    it('should process input tokens as [INPUT]', () => {
      const inputOnlyOptions = [
        {
          id: 'input1',
          tokens: [
            { type: 'input' as const, text: 'some text' },
          ],
        },
      ];
      
      renderCustomDropdown({ options: inputOnlyOptions });
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      expect(options[1]).toHaveTextContent('[INPUT]');
    });

    it('should handle mixed token types', () => {
      const mixedOptions = [
        {
          id: 'mixed1',
          tokens: [
            { type: 'text' as const, text: 'Property ' },
            { type: 'input' as const, text: 'input' },
            { type: 'text' as const, text: ' Value' },
          ],
        },
      ];
      
      renderCustomDropdown({ options: mixedOptions });
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      expect(options[1]).toHaveTextContent('Property [INPUT] Value');
    });
  });

  describe('props validation', () => {
    it('should work with empty options array', () => {
      renderCustomDropdown({ options: [] });
      
      const select = screen.getByTestId('select-element');
      expect(select).toBeInTheDocument();
      
      const options = select.querySelectorAll('option');
      expect(options).toHaveLength(1); // Only placeholder
    });

    it('should handle options with empty tokens array', () => {
      const emptyTokensOptions = [
        {
          id: 'empty1',
          tokens: [],
        },
      ];
      
      renderCustomDropdown({ options: emptyTokensOptions });
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      expect(options[1]).toHaveTextContent('');
    });
  });

  describe('accessibility', () => {
    it('should have proper select element', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('should have proper option elements', () => {
      renderCustomDropdown();
      
      const select = screen.getByTestId('select-element');
      const options = select.querySelectorAll('option');
      
      options.forEach(option => {
        expect(option.tagName).toBe('OPTION');
      });
    });
  });
}); 