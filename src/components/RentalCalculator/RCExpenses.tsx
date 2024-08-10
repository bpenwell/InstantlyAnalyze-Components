import React from 'react';
import { IRentalCalculatorPageData } from '../../interfaces';
import './RCExpenses.css';

export const RCExpenses: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
  let monthlyTaxes = props.currentYearData.expenseDetails.propertyTaxes;
  let monthlyInsurance = props.currentYearData.expenseDetails.insurance;
  
  // Adjust for annual vs yearly inputs
  if (props.currentYearData.expenseDetails.propertyTaxFrequency === 'annual') {
    monthlyTaxes /= 12;
  }
  if (props.currentYearData.expenseDetails.insuranceFrequency === 'annual') {
    monthlyInsurance /= 12;
  }

  const getTotalUtilities = () => {
    return props.currentYearData.expenseDetails.electricity +
      props.currentYearData.expenseDetails.garbage + 
      props.currentYearData.expenseDetails.gas + 
      props.currentYearData.expenseDetails.waterAndSewer; 
  };
  let monthlyTotalUtilities = getTotalUtilities();

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Expenses</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-blue-600">Property Taxes:</h3>
            <p className="text-lg text-gray-700">${monthlyTaxes}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-blue-600">Home Insurance:</h3>
            <p className="text-lg text-gray-700">${monthlyInsurance}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-blue-600">Utilities (total):</h3>
            <p className="text-lg text-gray-700">${monthlyTotalUtilities}</p>
          </div>
          <div className="ml-4 space-y-1">
            <div className="flex justify-between">
              <h4 className="text-base font-medium text-gray-600">Electricity:</h4>
              <p className="text-base text-gray-600">${props.currentYearData.expenseDetails.electricity}</p>
            </div>
            <div className="flex justify-between">
              <h4 className="text-base font-medium text-gray-600">Water & Sewer:</h4>
              <p className="text-base text-gray-600">${props.currentYearData.expenseDetails.waterAndSewer}</p>
            </div>
            <div className="flex justify-between">
              <h4 className="text-base font-medium text-gray-600">Gas:</h4>
              <p className="text-base text-gray-600">${props.currentYearData.expenseDetails.gas}</p>
            </div>
            <div className="flex justify-between">
              <h4 className="text-base font-medium text-gray-600">Trash:</h4>
              <p className="text-base text-gray-600">${props.currentYearData.expenseDetails.garbage}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
