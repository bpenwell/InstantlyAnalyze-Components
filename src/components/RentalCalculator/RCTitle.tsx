import React from 'react';
import './RCTitle.css';

export const RCTitle: React.FC = () => {
  return (
    <header className="mb-4">
      <h1 className="text-3xl font-bold">Rental Property Analysis Report</h1>
      <p className="text-gray-600">Analysis for property at 123 Main St.</p>
    </header>
  );
}