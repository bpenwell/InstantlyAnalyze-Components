// components/Input.tsx
import React from 'react';
import './Input.css'; // Import the CSS file

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
            <label className='label'>{label}</label>
            {renderInput()}
        </div>
    );
};

export default Input;