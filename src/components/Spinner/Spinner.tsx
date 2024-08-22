import React from 'react';
import './Spinner.css'; // Create a separate CSS file for styling

export const Spinner = () => {
    return (
        <div className="loading-container">
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        </div>
    );
};