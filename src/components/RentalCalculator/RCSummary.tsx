import React from 'react';
import { IRentalCalculatorPageData } from '../../interfaces';
import './RCSummary.css';
import LineChart, { ILineChartProps, ILineChartDataset } from '../Charts/LineChart';
import { CalculationUtils, IRentalCalculatorData } from '@bpenwell/rei-module';

export interface IRCSummary extends IRentalCalculatorPageData {
  fullLoanTermRentalReportData: IRentalCalculatorData[];
  updateDataYear: (loanTermIndex: number) => void;
};

export const RCSummary: React.FC<IRCSummary> = (props: IRCSummary) => {
  const calculationUtils: CalculationUtils = new CalculationUtils();
  const {
    fullLoanTermRentalReportData,
    updateDataYear,
    currentYearData
  } = props;

  const handlePointClick = (index: number, value: number, label: string) => {
    updateDataYear(index);
  };

  const shouldDisplayChartTermYear = (termYear: number): boolean => {
    const overrideAcceptedYears: number[] = [0, 1, 2, 3, 4];
    const generalAcceptedYearMultiplier: number = 5;
    
    // Check if termYear is in the overrideAcceptedYears array
    if (overrideAcceptedYears.includes(termYear)) {
      return true;
    }
    
    // Check if termYear is a multiple of generalAcceptedYearMultiplier
    return termYear % generalAcceptedYearMultiplier === 0;
  };
  
  const getSummaryChartInputs = (): ILineChartProps => {
    const incomeData: ILineChartDataset = {
      label: 'Income Data',
      data: [],
      borderColor: 'green',
      backgroundColor: 'rgba(14, 205, 99, 0.75)',
    };
    const expenseData: ILineChartDataset = {
      label: 'Expense Data',
      data: [],
      borderColor: 'red',
      backgroundColor: 'rgba(250, 150, 86, 0.75)',
    };
    const cashFlowData: ILineChartDataset = {
      label: 'Cash Flow Data',
      data: [],
      borderColor: 'black',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    };
    const labels: string[] = [];

    fullLoanTermRentalReportData.forEach((data: IRentalCalculatorData, index: number) => {
      const year = index + 1;
      if (shouldDisplayChartTermYear(year)) {
        const totalIncome = calculationUtils.calculateRentalIncome(data);
        const totalExpenses = calculationUtils.calculateRentalTotalExpense(data);
        const cashFlow = totalIncome - totalExpenses;
        incomeData.data.push(totalIncome);
        expenseData.data.push(totalExpenses);
        cashFlowData.data.push(cashFlow);
        labels.push(`${year}`);
      }
    });

    // Use CoC ROI for whatever you need
    //const cashOnCashROI = calculationUtils.calculateCoCROI(data);

    return {
      datasets: [incomeData, expenseData, cashFlowData], // Add datasets here
      labels,
      onPointClick: handlePointClick,
    };
  };

  const summaryChartProps = getSummaryChartInputs();

  // Example values (replace these with dynamic values)
  const income = calculationUtils.calculateRentalIncome(currentYearData);
  const expenses = calculationUtils.calculateRentalTotalExpense(currentYearData);
  const monthlyCashFlow = income - expenses;
  const cocROI = calculationUtils.calculateRentalTotalExpense(currentYearData);

  return (
    <section className='rc-summary'>
      <div className='summary-container'>
        <h2>Cash Flow</h2>
        <div className='chart-box-small-centered'>
          <LineChart {...summaryChartProps} />
        </div>
        <div className="analysis-report-cashflow-aside">
          <div className="analysis-report-cashflow-breakdown-cashflow">
            <p>Monthly cash flow (at year 1)</p>
            <span className="analysis-report-cashflow-aside-cashflow">${monthlyCashFlow.toFixed(0)}</span>
          </div>
          <div className="analysis-report-cashflow-breakdown-other">
            <div>
              <p>Income</p>
              <span className="analysis-report-cashflow-aside-income">${income.toFixed(0)}</span>
            </div>
            <div>
              <p>Expenses</p>
              <span className="analysis-report-cashflow-aside-expenses">${expenses.toFixed(0)}</span>
            </div>
            <div>
              <p>CoC ROI</p>
              <span className="analysis-report-cashflow-aside-coc-roi">{cocROI.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}