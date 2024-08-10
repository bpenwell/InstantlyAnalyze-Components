import React from 'react';
import { IRentalCalculatorPageData } from '../../interfaces';
import './RCExpenses.css';
import { CalculationUtils } from '@bpenwell/rei-module';

export const RCExpenses: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
  const calculationUtils: CalculationUtils = new CalculationUtils();
  let taxes = props.currentYearData.expenseDetails.propertyTaxes;
  let insurance = props.currentYearData.expenseDetails.insurance;

  const loanAmount = props.currentYearData.purchaseDetails.purchasePrice - props.currentYearData.loanDetails.downPayment;
  
  let rehabCost = 0;
  if (props.currentYearData.purchaseDetails.rehabbingProperty && props.currentYearData.purchaseDetails.rehabRepairCosts) {
    rehabCost = props.currentYearData.purchaseDetails.rehabRepairCosts;
  }
  const totalCashNeeded = loanAmount
    + props.currentYearData.purchaseDetails.purchaseClosingCosts
    + rehabCost;

  const mortgage = calculationUtils.calculateMortgagePayment(loanAmount,
    props.currentYearData.loanDetails.interestRate,
    props.currentYearData.loanDetails.loanTerm);

  // Adjust for annual vs yearly inputs
  if (props.currentYearData.expenseDetails.propertyTaxFrequency === 'annual') {
    taxes /= 12;
  }
  if (props.currentYearData.expenseDetails.insuranceFrequency === 'annual') {
    insurance /= 12;
  }

  const getTotalFixedExpenses = () => {
    return (
      props.currentYearData.expenseDetails.electricity +
      props.currentYearData.expenseDetails.garbage +
      props.currentYearData.expenseDetails.gas +
      props.currentYearData.expenseDetails.other +
      props.currentYearData.expenseDetails.hoaFees +
      props.currentYearData.expenseDetails.waterAndSewer
    );
  };
  let totalFixedExpenses = getTotalFixedExpenses();

  const getTotalVariableExpenses = () => {
    return (
      props.currentYearData.expenseDetails.capitalExpenditures +
      props.currentYearData.expenseDetails.managementFees +
      props.currentYearData.expenseDetails.repairsAndMaintenance +
      props.currentYearData.expenseDetails.vacancy
    );
  };
  let totalVariableExpenses = getTotalVariableExpenses();

  const getTotalExpenses = () => {
    return (
      mortgage +
      insurance +
      taxes +
      totalFixedExpenses +
      totalVariableExpenses
    );
  };
  let monthlyTotalExpenses = getTotalExpenses();

  return (
    <section className="rc-expenses">
      <div className="expenses-container">
        <h2>Expenses</h2>
        <div className="expenses-content">
          {/* Left Column: Total Expenses */}
          <div className="expenses-box">
            <div className="expense-header">
              <h3>Total Expenses</h3>
              <p>${monthlyTotalExpenses.toFixed(0)}</p>
            </div>
            <div className="sub-utilities">
              <div className="expense-item">
                <h4>Mortgage</h4>
                <p>${mortgage.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h4>Taxes</h4>
                <p>${taxes.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h4>Insurance</h4>
                <p>${insurance.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h4>Variable Expenses</h4>
                <p>${totalVariableExpenses.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h4>Fixed Expenses</h4>
                <p>${totalFixedExpenses.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Middle Column: fixed expenses Box */}
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
          {/* Right Column: variable expenses Box */}
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
                <p>${props.currentYearData.expenseDetails.repairsAndMaintenance.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>CapEx</h5>
                <p>${props.currentYearData.expenseDetails.capitalExpenditures.toFixed(0)}</p>
              </div>
              <div className="expense-item">
                <h5>Management fees</h5>
                <p>${props.currentYearData.expenseDetails.managementFees.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
