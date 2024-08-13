import React from 'react';
import './RCTitle.css';
import { IRentalCalculatorPageData } from '../../interfaces';

export const RCTitle: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
  return (
    <section className="rc-title">
      <div className="title-container">
        <img src='/public/propertyImage.jpg' alt="Property"/>
        <h2 className="text-3xl font-bold">{props.currentYearData.propertyInformation.streetAddress}</h2>
        <h3 className="text-xl font-bold">{props.currentYearData.propertyInformation.city}, {props.currentYearData.propertyInformation.state}</h3>
      </div>
    </section>
  );
}
