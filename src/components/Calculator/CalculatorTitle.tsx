import React from 'react';
import './CalculatorTitle.css';
import { IRentalCalculatorPageProps } from '../../interfaces';

export const CalculatorTitle: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
  return (
    <div className="calculator-container">
      <div className="title-container">
        <img src='/public/propertyImage.png' alt="Property"/>
        <h2 className="text-3xl font-bold">{props.currentYearData.propertyInformation.streetAddress}</h2>
        <h3 className="text-xl font-bold">{props.currentYearData.propertyInformation.city}, {props.currentYearData.propertyInformation.state}</h3>
      </div>
    </div>
  );
}
