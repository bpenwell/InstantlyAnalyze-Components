import React from 'react';
import { IRentalCalculatorPageData } from '../../interfaces';

export const RCSummary: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
  return (
    <section className="mb-4">
      <h2 className="text-2xl font-semibold">Summary</h2>
      <p>Overview of the property analysis.</p>
    </section>
  );
}