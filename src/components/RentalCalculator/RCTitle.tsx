import { IRentalCalculatorData } from '@bpenwell/rei-module';
import React from 'react';
import './RCTitle.css';
import { IRentalCalculatorPageData } from '../../interfaces';

export const RCTitle: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
  return (
    <header className="mb-4">
      <h1 className="text-3xl font-bold">{props.currentYearData.propertyInformation.streetAddress}</h1>
      <h1 className="text-2xl font-bold">{props.currentYearData.propertyInformation.city}, {props.currentYearData.propertyInformation.state}</h1>
      <p className="text-gray-600">.</p>
    </header>
  );
}