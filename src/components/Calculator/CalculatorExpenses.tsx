// CalculatorExpenses.tsx
import React, { useEffect, useState } from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import './CalculatorExpenses.scss';
import '../Charts/Chart.css';
import { CalculationUtils, Frequency } from '@bpenwell/instantlyanalyze-module';
import { CloudscapePieChart } from '../Charts/PieChart';
import { Container, Header, TextContent } from '@cloudscape-design/components';
import { useAppContext } from '../../utils/AppContextProvider';
import { Mode } from '@cloudscape-design/global-styles';

export const CalculatorExpenses: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
  const calculationUtils: CalculationUtils = new CalculationUtils();
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();

  const [taxes, setTaxes] = useState(props.currentYearData.expenseDetails.propertyTaxes);
  const [insurance, setInsurance] = useState(props.currentYearData.expenseDetails.insurance);
  const [rehabCost, setRehabCost] = useState(0);
  const [mortgage, setMortgage] = useState(0);
  const [totalFixedExpenses, setTotalFixedExpenses] = useState(0);
  const [totalOperationalExpenses, setTotalOperationalExpenses] = useState(0);
  const [monthlyTotalExpenses, setMonthlyTotalExpenses] = useState(0);

  useEffect(() => {
    let updatedTaxes = props.currentYearData.expenseDetails.propertyTaxes;
    let updatedInsurance = props.currentYearData.expenseDetails.insurance;

    if (props.currentYearData.strategyDetails.isRehabbingProperty && props.currentYearData.strategyDetails.rehabRepairCosts) {
      setRehabCost(props.currentYearData.strategyDetails.rehabRepairCosts);
    }

    const updatedMortgage = calculationUtils.calculateMortgagePayment(props.currentYearData);
    setMortgage(updatedMortgage);

    if (props.currentYearData.expenseDetails.propertyTaxFrequency === Frequency.Annual) {
      updatedTaxes /= 12;
    }
    if (props.currentYearData.expenseDetails.insuranceFrequency === Frequency.Annual) {
      updatedInsurance /= 12;
    }

    const updatedTotalFixedExpenses = (
      props.currentYearData.expenseDetails.electricity +
      props.currentYearData.expenseDetails.garbage +
      props.currentYearData.expenseDetails.gas +
      props.currentYearData.expenseDetails.other +
      props.currentYearData.expenseDetails.hoaFees +
      props.currentYearData.expenseDetails.waterAndSewer +
      props.currentYearData.expenseDetails.managementFee
    );
    setTotalFixedExpenses(updatedTotalFixedExpenses);

    const updatedTotalOperationalExpenses = (
      props.currentYearData.expenseDetails.capitalExpenditure +
      props.currentYearData.expenseDetails.maintenance +
      props.currentYearData.expenseDetails.vacancy
    );
    setTotalOperationalExpenses(updatedTotalOperationalExpenses);

    const updatedMonthlyTotalExpenses = calculationUtils.calculateRentalTotalExpensePerMonth(props.currentYearData);
    setMonthlyTotalExpenses(updatedMonthlyTotalExpenses);

    setTaxes(updatedTaxes);
    setInsurance(updatedInsurance);

  }, [props.currentYearData]);

  return (
    <div className={appMode}>
      <Container className="calculator-container">
        <Header variant="h2" description='Visualize where your money is being spent'>Expenses</Header>
        <TextContent>
          <div className="expenses-content">
            {/* Pie Chart */}
            <div className="chart-box">
              <CloudscapePieChart
                labels={['Mortgage', 'Taxes', 'Insurance', 'Budgeting Expenses', 'Fixed Expenses']}
                data={[mortgage, taxes, insurance, totalOperationalExpenses, totalFixedExpenses]}
                title="Expense Breakdown"
              />
            </div>

            {/* Total Expenses Section with Hierarchy */}
            <div className={`expenses-box ${appMode}`}>
            <div className="expense-header">
              <h3>Total Expenses</h3>
              <p>${monthlyTotalExpenses.toFixed(0)}</p>
            </div>
            <div className="expense-tree">
              {/* Main expense categories */}
              <div className="expense-item expense-main">
                <div className="expense-item-content">
                  <div className="expense-indicator mortgage"></div>
                  <span>Mortgage</span>
                </div>
                <span className="expense-amount">${mortgage.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-main">
                <div className="expense-item-content">
                  <div className="expense-indicator taxes"></div>
                  <span>Taxes</span>
                </div>
                <span className="expense-amount">${taxes.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-main">
                <div className="expense-item-content">
                  <div className="expense-indicator insurance"></div>
                  <span>Insurance</span>
                </div>
                <span className="expense-amount">${insurance.toFixed(0)}</span>
              </div>
              
              {/* Fixed Expenses with subtotal */}
              <div className="expense-item expense-subtotal">
                <div className="expense-item-content">
                  <div className="expense-indicator fixed"></div>
                  <span>Fixed Expenses</span>
                </div>
                <span className="expense-amount">${totalFixedExpenses.toFixed(0)}</span>
              </div>
              
              {/* Fixed expense sub-items */}
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Electricity</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.electricity.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Water & Sewer</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.waterAndSewer.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Gas</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.gas.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Trash</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.garbage.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Management</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.managementFee.toFixed(0)}</span>
              </div>
              
              {/* Budgeting Expenses with subtotal */}
              <div className="expense-item expense-subtotal">
                <div className="expense-item-content">
                  <div className="expense-indicator operational"></div>
                  <span>Budgeting Expenses</span>
                </div>
                <span className="expense-amount">${totalOperationalExpenses.toFixed(0)}</span>
              </div>
              
              {/* Budgeting expense sub-items */}
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Vacancy</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.vacancy.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>Maintenance</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.maintenance.toFixed(0)}</span>
              </div>
              
              <div className="expense-item expense-sub">
                <div className="expense-item-content">
                  <span>CapEx</span>
                </div>
                <span className="expense-amount">${props.currentYearData.expenseDetails.capitalExpenditure.toFixed(0)}</span>
              </div>
            </div>
          </div>

          </div>
        </TextContent>
      </Container>
    </div>
  );
};