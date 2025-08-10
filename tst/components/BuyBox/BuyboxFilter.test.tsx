import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BuyboxFilter } from '../../../src/components/BuyBox/BuyboxFilter';
import { InputType, FilterToken } from '../../../../InstantlyAnalyze-Module/src/interfaces/buyBoxInterfaces';

// A more realistic mock that includes the data-testid attributes
jest.mock('@cloudscape-design/components', () => ({
  Container: ({ header }: any) => <div data-testid="container">{header}</div>,
  ColumnLayout: ({ children }: any) => <div>{children}</div>,
  SpaceBetween: ({ children }: any) => <div>{children}</div>,
  Input: ({ value, onChange }: any) => (
    <input
      data-testid="number-input"
      value={value}
      onChange={e => onChange({ detail: { value: e.target.value } })}
    />
  ),
  Select: ({ selectedOption, options, onChange }: any) => (
    <select
      data-testid="operation-select"
      value={selectedOption.value}
      onChange={e => onChange({ detail: { selectedOption: { value: e.target.value, label: e.target.value } } })}
    >
      {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  ),
  Button: ({ onClick }: any) => <button data-testid="close-btn" onClick={onClick}>X</button>,
  StatusIndicator: ({ type, children }: any) => <div data-testid={`status-${type}`}>{children}</div>,
  Box: ({ children }: any) => <div>{children}</div>,
}));

describe('BuyboxFilter Component', () => {
  const tokens: FilterToken[] = [
    { type: 'text', text: 'Price' },
    { type: 'input', inputType: InputType.NUMBER_INPUT },
    { type: 'input', inputType: InputType.OPERATION_INPUT },
  ];
  const filter = {
    instanceId: '1',
    option: {
      id: 'option-1',
      tokens,
    },
    inputs: { 0: '', 1: '100', 2: '>' },
    removedInputs: [],
  };
  const onInputChange = jest.fn();
  const onRemoveFilter = jest.fn();

  beforeAll(() => {
    // The mock is now handled globally, so no need to re-mock here.
  });

  it('should render without crashing', () => {
    render(<BuyboxFilter filter={filter} onInputChange={onInputChange} onRemoveFilter={onRemoveFilter} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByTestId('number-input')).toBeInTheDocument();
    expect(screen.getByTestId('operation-select')).toBeInTheDocument();
    expect(screen.getByTestId('close-btn')).toBeInTheDocument();
  });

  it('should handle filter functionality (input change)', () => {
    render(<BuyboxFilter filter={filter} onInputChange={onInputChange} onRemoveFilter={onRemoveFilter} />);
    fireEvent.change(screen.getByTestId('number-input'), { target: { value: '200' } });
    expect(onInputChange).toHaveBeenCalledWith('1', 1, '200');
    fireEvent.change(screen.getByTestId('operation-select'), { target: { value: '<' } });
    expect(onInputChange).toHaveBeenCalledWith('1', 2, '<');
  });

  it('should apply filters correctly (valid/invalid)', () => {
    // Valid filter
    render(<BuyboxFilter filter={{ ...filter, inputs: { 0: 'text', 1: '100', 2: '>' } }} onInputChange={onInputChange} onRemoveFilter={onRemoveFilter} />);
    expect(screen.getByTestId('status-success')).toBeInTheDocument();
    // Invalid filter (empty number input)
    render(<BuyboxFilter filter={{ ...filter, inputs: { 0: 'text', 1: '', 2: '>' } }} onInputChange={onInputChange} onRemoveFilter={onRemoveFilter} />);
    expect(screen.getByTestId('status-error')).toBeInTheDocument();
  });

  it('should handle remove filter', () => {
    render(<BuyboxFilter filter={filter} onInputChange={onInputChange} onRemoveFilter={onRemoveFilter} />);
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(onRemoveFilter).toHaveBeenCalledWith('1');
  });
}); 