import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import './CalculatorExpenses.css';
import '../Charts/Chart.css';
import { CalculationUtils, Frequency } from '@bpenwell/rei-module';
import PieChart, { IPieChartProps } from '../Charts/PieChart';

export const CalculatorExpenses: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
  const calculationUtils: CalculationUtils = new CalculationUtils();
  let taxes = props.currentYearData.expenseDetails.propertyTaxes;
  let insurance = props.currentYearData.expenseDetails.insurance;

  let rehabCost = 0;
  if (props.currentYearData.purchaseDetails.rehabbingProperty && props.currentYearData.purchaseDetails.rehabRepairCosts) {
    rehabCost = props.currentYearData.purchaseDetails.rehabRepairCosts;
  }
  
  const mortgage = calculationUtils.calculateMortgagePayment(props.currentYearData);

  if (props.currentYearData.expenseDetails.propertyTaxFrequency === Frequency.Annual) {
    taxes /= 12;
  }
  if (props.currentYearData.expenseDetails.insuranceFrequency === Frequency.Annual) {
    insurance /= 12;
  }

  const totalFixedExpenses = (
    props.currentYearData.expenseDetails.electricity +
    props.currentYearData.expenseDetails.garbage +
    props.currentYearData.expenseDetails.gas +
    props.currentYearData.expenseDetails.other +
    props.currentYearData.expenseDetails.hoaFees +
    props.currentYearData.expenseDetails.waterAndSewer
  );

  const totalVariableExpenses = (
    props.currentYearData.expenseDetails.capitalExpenditure +
    props.currentYearData.expenseDetails.managementFee +
    props.currentYearData.expenseDetails.maintenance +
    props.currentYearData.expenseDetails.vacancy
  );

  const monthlyTotalExpenses: number = calculationUtils.calculateRentalTotalExpense(props.currentYearData);

  const pieChartProps: IPieChartProps = {
    labels: ['Mortgage', 'Taxes', 'Insurance', 'Variable Expenses', 'Fixed Expenses'],
    data: [mortgage, taxes, insurance, totalVariableExpenses, totalFixedExpenses],
    backgroundColors: [
        '#4A7A40',  // Muted green
        '#C47766',  // Muted reddish-brown
        '#D9B98A',  // Muted beige
        '#617A40',  // Dark olive green
        '#A4BBA0'   // Muted light green
    ],
    hoverBackgroundColors: [
        '#4A7A40',
        '#C47766',
        '#D9B98A',
        '#617A40',
        '#A4BBA0'
    ],
  };

  return (
    <div className="calculator-container">
      <div className="expenses-container">
        <h2 className='rc-header'>Expenses</h2>
        <div className="expenses-content">
          {/* Pie Chart */}
          <div className="chart-box">
            <PieChart {...pieChartProps} />
          </div>

          {/* Total Expenses Section with Labels */}
          <div className="expenses-box">
            <div className="expense-header">
              <h3>Total Expenses</h3>
              <p>${monthlyTotalExpenses.toFixed(0)}</p>
            </div>
            <div className="sub-utilities">
              <div className="expense-item">
                <span className="label-circle mortgage-color"></span>
                <h4>Mortgage</h4>
                <p>${mortgage.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <span className="label-circle taxes-color"></span>
                <h4>Taxes</h4>
                <p>${taxes.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <span className="label-circle insurance-color"></span>
                <h4>Insurance</h4>
                <p>${insurance.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <span className="label-circle fixed-color"></span>
                <h4>Fixed Expenses</h4>
                <p>${totalFixedExpenses.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <span className="label-circle variable-color"></span>
                <h4>Variable Expenses</h4>
                <p>${totalVariableExpenses.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Fixed Expenses Section */}
          <div className="expenses-box">
            <div className="expense-header">
              <h4>Fixed Expenses</h4>
              <p>${totalFixedExpenses.toFixed(0)}</p>
            </div>
            <div className="sub-utilities">
              <div className="expense-item">
                <h5>Electricity</h5>
                <p>${props.currentYearData.expenseDetails.electricity.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>Water & Sewer</h5>
                <p>${props.currentYearData.expenseDetails.waterAndSewer.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>Gas</h5>
                <p>${props.currentYearData.expenseDetails.gas.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>Trash</h5>
                <p>${props.currentYearData.expenseDetails.garbage.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Variable Expenses Section */}
          <div className="expenses-box">
            <div className="expense-header">
              <h4>Variable Expenses</h4>
              <p>${totalVariableExpenses.toFixed(0)}</p>
            </div>
            <div className="sub-utilities">
              <div className="expense-item">
                <h5>Vacancy</h5>
                <p>${props.currentYearData.expenseDetails.vacancy.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>Maintenance</h5>
                <p>${props.currentYearData.expenseDetails.maintenance.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>CapEx</h5>
                <p>${props.currentYearData.expenseDetails.capitalExpenditure.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>Management</h5>
                <p>${props.currentYearData.expenseDetails.managementFee.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
