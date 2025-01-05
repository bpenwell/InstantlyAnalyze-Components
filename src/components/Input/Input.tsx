import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './Input.css'; // Import the CSS file

// Asterisk component
const Asterisk = styled.span`
  color: red;
  margin-left: 4px;
`;

const LockButton = styled.button`
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
`;

const MAX_CURRENCY_VALUE = 9007199254740991;
const MIN_CURRENCY_VALUE = -9007199254740991;
const MAX_PERCENT_VALUE = 100;
const MIN_PERCENT_VALUE = 0;

interface InputProps {
  id?: string;
  label: string;
  type?: string;
  options?: string[];
  value: any;
  onChange: (value: any) => void;
  required?: boolean;
  checked?: boolean;
  /**
   * Is unlockable
   */
  locked?: boolean;
}

export const Input = (props: InputProps) => {
  const { id, label, type = 'text', options, value, onChange, required, locked } = props;
  const valueNotUndefined = value !== undefined ? value : '';
  const [displayValue, setDisplayValue] = useState<string>(valueNotUndefined.toString());
  const [isLocked, setIsLocked] = useState(locked);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === 'currency') {
      setDisplayValue(formatCurrency(valueNotUndefined.toString()));
      adjustCaretPosition(type);
    } else if (type === 'percent') {
      const sanitizedValue = valueNotUndefined.toString().replace(/[^0-9.]/g, ''); // Remove non-numeric characters
      const parsedValue = sanitizedValue ? parseFloat(sanitizedValue).toString() : '';
      setDisplayValue(parsedValue ? `${parsedValue}%` : ''); // Only append % if valid number exists
      adjustCaretPosition(type);
    } else if (type === 'checkbox') {
      //nothing
    } else if (type === 'text' || type === 'select' || type === 'number') {
      setDisplayValue(valueNotUndefined.toString());
    }
    else {
      throw new Error(`Invalid Input type: ${type}. Use currency, checkbox, percent, select, or dont set this value.`)
    }
  }, [valueNotUndefined]);

  const formatCurrency = (value: string) => {
    if (value === '' || value === undefined) {
      return '';
    }
    let [integerPart, decimalPart] = value.split('.');

    integerPart = integerPart.replace(/[^\d]/g, ''); // Remove any non-digit characters
    integerPart = parseInt(integerPart || '0').toLocaleString('en-US');

    if (decimalPart !== undefined) {
      decimalPart = decimalPart.substring(0, 2); // Limit to 2 digits
      return `$${integerPart}.${decimalPart}`;
    }

    return `$${integerPart}`;
  };

  const getOutOfBoundsMessage = (type: string, numericValue: number) => {
    const isCurrency = type === 'currency';
    const isTooSMall = numericValue < MIN_CURRENCY_VALUE;
    return `Value is too ${isTooSMall ? 'small' : 'big'}, must be ${isTooSMall ? `greater than ${isCurrency ? MIN_CURRENCY_VALUE : MIN_PERCENT_VALUE}`: `lesser than ${isCurrency ? MAX_CURRENCY_VALUE : MAX_PERCENT_VALUE}`}!`
  };

  const setCurrencyCaretPosition = (requestedCaretPosition: number, formattedValue: string) => {
    requestAnimationFrame(() => {
      if (inputRef.current) {
          //If it's a single digit after typing, we want to put the caret position at the end
          //Usecase: Ctrl + A, then '1'.
          const position = inputRef.current.value.length === 2 ? 2 : Math.min(requestedCaretPosition, formattedValue.length);
          inputRef.current.selectionStart = inputRef.current.selectionEnd = position;
      }
    });
  };
  const setPercentCaretPosition = (requestedCaretPosition: number, formattedValue: string) => {
    requestAnimationFrame(() => {
      if (inputRef.current) {
          //If it's a single digit after typing, we want to put the caret position at the end
          const position =  Math.min(requestedCaretPosition, formattedValue.length - 1);
          inputRef.current.selectionStart = inputRef.current.selectionEnd = position;
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const inputElement = e.target;
    let rawInputValue = inputElement.value.replace('$', '').replace('%', '').replace(/,/g, '').replace(/[^0-9.]/g, ''); // Remove the currency symbol and commas
    //Prevent multiple `.`
    const parts = rawInputValue.split('.');
    if (parts[1]?.length > 2) {
        parts[1] = parts[1].substring(0, 2);
    }
    rawInputValue = parts.join('.');
    const currentCaretPosition = (inputElement as any).selectionStart || 0; // Save the current caret position

    let newValue = '';
    if (type === 'percent') {
      // Check if the value is within the allowed range
      const numericValue = parseFloat(rawInputValue);
      if (numericValue > MAX_PERCENT_VALUE || numericValue < MIN_PERCENT_VALUE) {
        inputElement.setCustomValidity(getOutOfBoundsMessage(type, numericValue));
        inputElement.reportValidity(); // This will trigger the built-in popup
        setPercentCaretPosition(currentCaretPosition, newValue);
        return;
      } else {
        inputElement.setCustomValidity(''); // Clear the custom validity message
      }

      newValue = rawInputValue + '%';
      // Set the caret position
      setPercentCaretPosition(currentCaretPosition, newValue);
    }
    else if (type === 'currency') {
      // Check if the value is within the allowed range
      const numericValue = parseFloat(rawInputValue);
      if (numericValue > MAX_CURRENCY_VALUE || numericValue < MIN_CURRENCY_VALUE) {
        inputElement.setCustomValidity(getOutOfBoundsMessage(type, numericValue));
        inputElement.reportValidity(); // This will trigger the built-in popup
        return;
      } else {
        inputElement.setCustomValidity(''); // Clear the custom validity message
      }

      // Format the input as currency
      let formattedValue: string = formatCurrency(rawInputValue);
      const countCommas = (str: string) => {
        return str.split(',').length - 1;
      };

      const preFormattedNumCommas = countCommas(inputElement.value);
      const postFormattedNumCommas = countCommas(formattedValue);
      const addedCommasBeforeCaret = postFormattedNumCommas - preFormattedNumCommas;
      newValue = formattedValue;
      const adjustedCaretPosition = currentCaretPosition + addedCommasBeforeCaret;
      // Set the caret position
      setCurrencyCaretPosition(adjustedCaretPosition, formattedValue);
    } else {
      // Existing logic for percent and other types...
      newValue = inputElement.value;
    }
    
    setDisplayValue(newValue);
    onChange(newValue);
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
    const inputClassName = `input-field ${isLocked ? 'locked' : ''}`;
    const toggleLock = () => {
      setIsLocked(!isLocked);
    };
    
    if (type === 'select' && options) {
      return (
        <select id={id} value={displayValue} onChange={handleInputChange} className={inputClassName} disabled={isLocked}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            id={id}
            required={required}
            type={type}
            value={displayValue}
            onChange={handleInputChange}
            onClick={handleOnClick}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className={inputClassName}
            checked={props.checked}
            disabled={isLocked}
          />
          {isLocked && (
            <LockButton onClick={toggleLock}>
              🔓
            </LockButton>
          )}
        </div>
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