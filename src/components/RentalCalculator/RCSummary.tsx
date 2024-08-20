import React, { useState, useMemo } from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import './RCSummary.css';
import LineChart, { ILineChartProps, ILineChartDataset } from '../Charts/LineChart';
import { CalculationUtils, displayAsMoney, IRentalCalculatorData } from '@bpenwell/rei-module';

export interface IRCSummary extends IRentalCalculatorPageProps {
  updateDataYear: (loanTermIndex: number) => void;
}

export const RCSummary: React.FC<IRCSummary> = (props: IRCSummary) => {
  const calculationUtils: CalculationUtils = new CalculationUtils();
  const { fullLoanTermRentalReportData, updateDataYear, currentYearData } = props;
  const [currentYear, updateCurrentYear] = useState<number>(0);

  const handlePointClick = (index: number, value: number, label: string) => {
    const newYear: number = Number(label);
    updateDataYear(newYear);
    updateCurrentYear(newYear);
  };

  const shouldDisplayChartTermYear = (termYear: number): boolean => {
    const overrideAcceptedYears: number[] = [0, 1, 2, 3, 4];
    const generalAcceptedYearMultiplier: number = 5;
    return overrideAcceptedYears.includes(termYear) || termYear % generalAcceptedYearMultiplier === 0;
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

    return {
      datasets: [incomeData, expenseData, cashFlowData],
      labels,
      onPointClick: handlePointClick,
    };
  };

  const summaryChartProps = getSummaryChartInputs();

  const income = calculationUtils.calculateRentalIncome(currentYearData);
  const expenses = calculationUtils.calculateRentalTotalExpense(currentYearData);
  const monthlyCashFlow = income - expenses;
  const cashOnCashROI = calculationUtils.calculateCoCROI(currentYearData);
  const fiveYearReturn = displayAsMoney(calculationUtils.calculateFiveYearAnnualizedReturn(fullLoanTermRentalReportData), 2, '');
  const mortgagePayment = displayAsMoney(calculationUtils.calculateMortgagePayment(currentYearData));

  return (
    <section className='rc-summary'>
      <div className='summary-container'>
        <h2>Cash Flow</h2>
        <div className='chart-box-small-centered'>
          <LineChart {...summaryChartProps} />
          <div className="analysis-report-cashflow-aside">
            <div className="analysis-report-cashflow-breakdown-cashflow">
              <p>Monthly Cashflow</p>
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
                <span className="analysis-report-cashflow-aside-coc-roi">{cashOnCashROI.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
        {/* Add the Mortgage payment and 5-year annualized return below the charts */}
        <div className="summary-return-container">
          <div>
            <p className='return-header'>Mortgage Payment:</p>
            <span className='mortgage-payment'>{mortgagePayment}</span>
          </div>
          <div>
            <p className='return-header'>5-Year Annualized Return:</p>
            <span className='five-year-return'>{fiveYearReturn}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
