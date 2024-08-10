import React from 'react';
import { IRentalCalculatorPageData } from '../../interfaces';
import './RCSummary.css';

export const RCSummary: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
  return (
    <section className='rc-summary'>
      <div className='summary-container'>
        <h2>Summary</h2>
      </div>
    </section>
  );
}