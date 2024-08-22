import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { CalculationUtils } from '@bpenwell/rei-module';

export const RCRulesOfThumb: React.FC<IRentalCalculatorPageProps> = (props) => {
  const calculationUtils = new CalculationUtils();
  const { currentYearData } = props;

  const noi = calculationUtils.calculateRentalIncome(currentYearData) - calculationUtils.calculateRentalTotalExpense(currentYearData);
  const cocROI = calculationUtils.calculateCoCROI(currentYearData);
  const purchaseCap = (noi / currentYearData.purchaseDetails.purchasePrice) * 100;

  return (
    <section className="rc-rules-of-thumb">
      <h2 className="rc-header">Rules of Thumb</h2>
      <table className="rules-of-thumb-table">
        <tbody>
          <tr>
            <td>NOI</td>
            <td>{`$${noi.toFixed(2)}`}</td>
          </tr>
          <tr>
            <td>CoC ROI</td>
            <td>{`${cocROI.toFixed(2)}%`}</td>
          </tr>
          <tr>
            <td>Purchase Cap Rate</td>
            <td>{`${purchaseCap.toFixed(2)}%`}</td>
          </tr>
          {/* Add more rules of thumb as needed */}
        </tbody>
      </table>
    </section>
  );
};