import React from 'react';
import './Separator.css';

interface SeparatorProps {
    width?: number; // Width as a percentage (0-100)
}

export const Separator: React.FC<SeparatorProps> = ({ width = 60 }) => {
    return (
        <div className="separator-container">
            <div className="separator" style={{ width: `${width}%` }}></div>
        </div>
    );
};