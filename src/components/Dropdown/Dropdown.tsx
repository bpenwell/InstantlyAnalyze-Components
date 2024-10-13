import React from 'react';
import './Dropdown.css'; // Import the existing styles

interface DropdownProps {
  id: string;
  label: string;
  options: string[];
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ id, label, options, value, onChange }) => {
  return (
    <div className="input-container">
      <label htmlFor={id} className="label">{label}</label>
      <select
        id={id}
        className="input-field"
        value={value}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};