import React, { useEffect, useState } from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import './CalculatorExpenses.scss';
import '../Charts/Chart.css';
import { CalculationUtils, Frequency } from '@bpenwell/instantlyanalyze-module';
import PieChart, { IPieChartProps } from '../Charts/PieChart';
import { Container, Header } from '@cloudscape-design/components';

export const CalculatorExpenses: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
  const calculationUtils: CalculationUtils = new CalculationUtils();
  
  const [taxes, setTaxes] = useState(props.currentYearData.expenseDetails.propertyTaxes);
  const [insurance, setInsurance] = useState(props.currentYearData.expenseDetails.insurance);
  const [rehabCost, setRehabCost] = useState(0);
  const [mortgage, setMortgage] = useState(0);
  const [totalFixedExpenses, setTotalFixedExpenses] = useState(0);
  const [totalVariableExpenses, setTotalVariableExpenses] = useState(0);
  const [monthlyTotalExpenses, setMonthlyTotalExpenses] = useState(0);
  const [pieChartProps, setPieChartProps] = useState<IPieChartProps>({
    labels: [],
    data: [],
    backgroundColors: [],
    hoverBackgroundColors: [],
  });

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
      props.currentYearData.expenseDetails.waterAndSewer
    );
    setTotalFixedExpenses(updatedTotalFixedExpenses);

    const updatedTotalVariableExpenses = (
      props.currentYearData.expenseDetails.capitalExpenditure +
      props.currentYearData.expenseDetails.managementFee +
      props.currentYearData.expenseDetails.maintenance +
      props.currentYearData.expenseDetails.vacancy
    );
    setTotalVariableExpenses(updatedTotalVariableExpenses);

    const updatedMonthlyTotalExpenses = calculationUtils.calculateRentalTotalExpense(props.currentYearData);
    setMonthlyTotalExpenses(updatedMonthlyTotalExpenses);

    const updatedPieChartProps: IPieChartProps = {
      labels: ['Mortgage', 'Taxes', 'Insurance', 'Variable Expenses', 'Fixed Expenses'],
      data: [updatedMortgage, updatedTaxes, updatedInsurance, updatedTotalVariableExpenses, updatedTotalFixedExpenses],
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
    setPieChartProps(updatedPieChartProps);

    setTaxes(updatedTaxes);
    setInsurance(updatedInsurance);

  }, [props.currentYearData]); // Dependency array to trigger useEffect on props change

  console.debug(`taxes.toFixed=${taxes.toFixed}`)
  return (
    <Container className="calculator-container">
      <Header variant="h2">Expenses</Header>
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
    </Container>
  );
};
