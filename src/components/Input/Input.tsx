import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './Input.css'; // Import the CSS file

// Asterisk component
const Asterisk = styled.span`
  color: red;
  margin-left: 4px;
`;

interface InputProps {
  id?: string;
  label: string;
  type?: string;
  options?: string[];
  value: any;
  onChange: (value: any) => void;
  required?: boolean;
}

export const Input = (props: InputProps) => {
  const { id, label, type = 'text', options, value, onChange, required } = props;

  const [displayValue, setDisplayValue] = useState<string>(value === undefined ? '' : value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === 'currency') {
      setDisplayValue(displayValue ? formatCurrency(displayValue) : '');
    } else if (type === 'percent') {
      setDisplayValue(displayValue ? `${parseFloat(displayValue).toString()}%` : '');
      adjustCaretPosition('percent');
    } else {
      setDisplayValue(displayValue.toString());
    }
  }, [value]);

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return '';
    return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let inputValue = e.target.value.replace('$', '').replace('%', '');
    let rawValue: string = '';

    if (type === 'currency') {
      rawValue = inputValue.replace(/[^0-9.]/g, '');
      const parts = rawValue.split('.');
      if (parts.length > 2) {
        rawValue = `${parts[0]}.${parts[1]}`;
      }
      setDisplayValue(formatCurrency(rawValue));
      adjustCaretPosition('currency');
    } else if (type === 'percent') {
      rawValue = inputValue.replace(/[^\d.]/g, '');
      setDisplayValue(rawValue ? `${rawValue}%` : '');
      adjustCaretPosition('percent');
    } else {
      setDisplayValue(inputValue);
    }

    onChange(rawValue);
  };

  const adjustCaretPosition = (inputType: string) => {
    if (inputRef.current) {
      let caretPosition = inputRef.current.selectionStart || 0;

      if (inputType === 'currency') {
        if (caretPosition === 0) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = 1;
        }
      } else if (inputType === 'percent') {
        if (caretPosition >= inputRef.current.value.length) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length - 1;
        }
      }
    }
  };

  const handleSmartCaret = (e: React.MouseEvent<HTMLInputElement>) => {
    adjustCaretPosition(type);
  };

  const renderInput = () => {
    if (type === 'select' && options) {
      return (
        <select id={id} value={displayValue} onChange={handleInputChange} className='input-field'>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          id={id}
          required={required}
          type={type}
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleSmartCaret}
          ref={inputRef}
          className='input-field'
        />
      );
    }
  };

  return (
    <div className='input-container'>
      <label htmlFor={id} className='label'>
        {label}
        {required && <Asterisk>*</Asterisk>}
      </label>
      {renderInput()}
    </div>
  );
};