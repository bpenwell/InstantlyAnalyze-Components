import React from 'react';
import styled from 'styled-components';
import './Input.css'; // Import the CSS file

// Asterisk component
const Asterisk = styled.span`
  color: red;
  margin-left: 4px;
`;

interface InputProps {
    label: string;
    type?: string;
    options?: string[]; // Add options prop for select input
    value: any;
    onChange: (value: any) => void;
    required?: boolean;
}

export const Input = (props: InputProps) => {
    const { label, type = 'text', options, value, onChange, required } = props;

    const renderInput = () => {
        if (type === 'select' && options) {
            return (
                <select value={value} onChange={(e) => onChange(e.target.value)} className='input-field'>
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
                    required={required}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className='input-field'
                />
            );
        }
    };

    return (
        <div className='input-container'>
            <label className='label'>
                {label}
                {required && <Asterisk>*</Asterisk>}
            </label>
            {renderInput()}
        </div>
    );
};