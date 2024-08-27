import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './Input.css'; // Import the CSS file

// Asterisk component
const Asterisk = styled.span`
  color: red;
  margin-left: 4px;
`;

const MAX_VALUE = 9007199254740991; // Example max value (Number.MAX_SAFE_INTEGER)
const MIN_VALUE = -9007199254740991; // Example min value (Number.MIN_SAFE_INTEGER)

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
  const valueNotUndefined = value !== undefined ? value : '';
  const [displayValue, setDisplayValue] = useState<string>(valueNotUndefined.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === 'currency') {
      setDisplayValue(formatCurrency(valueNotUndefined.toString()));
      adjustCaretPosition(type);
    } else if (type === 'percent') {
      setDisplayValue(`${parseFloat(valueNotUndefined.toString()).toString()}%`);
      adjustCaretPosition(type);
    } else {
      setDisplayValue(valueNotUndefined.toString());
    }
  }, [valueNotUndefined]);

  const formatCurrency = (value: string) => {
    let [integerPart, decimalPart] = value.split('.');

    integerPart = integerPart.replace(/[^\d]/g, ''); // Remove any non-digit characters
    integerPart = parseInt(integerPart || '0').toLocaleString('en-US');

    if (decimalPart !== undefined) {
      decimalPart = decimalPart.substring(0, 2); // Limit to 2 digits
      return `$${integerPart}.${decimalPart}`;
    }

    return `$${integerPart}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const inputElement = e.target;
    const rawInputValue = inputElement.value.replace('$', '').replace(/,/g, ''); // Remove the currency symbol and commas
    const currentCaretPosition = (inputElement as any).selectionStart || 0; // Save the current caret position

    let newValue = '';
    if (type === 'currency') {
      let formattedValue: string = '';
      let rawValue = rawInputValue.replace(/[^0-9.]/g, '');

      //Prevent multiple `.`
      const parts = rawValue.split('.');
      if (parts[1]?.length > 2) {
          parts[1] = parts[1].substring(0, 2);
      }
      rawValue = parts.join('.');
      // Format the input as currency
      formattedValue = formatCurrency(rawValue);

      const preFormattedValue = inputElement.value.slice(0, currentCaretPosition);
      console.log(preFormattedValue);
      const countCommas = (str: string) => {
        return str.split(',').length - 1;
      };

      // Check if the value is within the allowed range
      const numericValue = parseFloat(rawValue);
      if (numericValue > MAX_VALUE || numericValue < MIN_VALUE) {
        inputElement.setCustomValidity(`Value is too ${numericValue < MIN_VALUE ? 'small' : 'big'}!`);
        inputElement.reportValidity(); // This will trigger the built-in popup
        return;
      } else {
        inputElement.setCustomValidity(''); // Clear the custom validity message
      }
      console.log(inputElement.value);
      console.log(formattedValue);
      const preFormattedNumCommas = countCommas(inputElement.value);
      const postFormattedNumCommas = countCommas(formattedValue);
      console.log(`preFormattedNumCommas: ${preFormattedNumCommas}`);
      console.log(`postFormattedNumCommas: ${postFormattedNumCommas}`);
      console.log(`currentCaretPosition: ${currentCaretPosition}`);
      const addedCommasBeforeCaret = postFormattedNumCommas - preFormattedNumCommas;
      newValue = formattedValue;
      setDisplayValue(formattedValue);
      const adjustedCaretPosition = currentCaretPosition + addedCommasBeforeCaret;
      // Set the caret position
      requestAnimationFrame(() => {
          if (inputRef.current) {
              //If it's a single digit after typing, we want to put the caret position at the end
              //Usecase: Ctrl + A, then '1'.
              const position = inputRef.current.value.length === 2 ? 2 : Math.min(adjustedCaretPosition, formattedValue.length);
              inputRef.current.selectionStart = inputRef.current.selectionEnd = position;
          }
      });
    } else {
      // Existing logic for percent and other types...
      newValue = inputElement.value;
      setDisplayValue(inputElement.value);
      console.log("Non-currency Value Set:", inputElement.value);
    }

    onChange(newValue);
};

  const adjustCaretPosition = (inputType: string) => {
    console.log(`adjustCaretPosition `);
    if (inputRef.current) {
      let caretPosition = inputRef.current.selectionStart || 0;
      console.log(`caretPosition: ${caretPosition}`);

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

  const handleOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
    adjustCaretPosition(type);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home') {
      requestAnimationFrame(() => {
        adjustCaretPosition(type);
      });
    }
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
          onClick={handleOnClick}
          onKeyDown={handleKeyDown}
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