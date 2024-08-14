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
    updateDataYear
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
      borderColor: 'green', // Set the line color to green for income data
      backgroundColor: 'rgba(0, 255, 0, 0.35)',
    };
    const expenseData: ILineChartDataset = {
      label: 'Expense Data',
      data: [],
      borderColor: 'red', // Set the line color to green for income data
      backgroundColor: 'rgba(255, 0, 0, 0.35)',
    };
    const labels: string[] = [];

    fullLoanTermRentalReportData.forEach((data: IRentalCalculatorData, index: number) => {
      const year = index + 1;
      if (shouldDisplayChartTermYear(year)) {
        incomeData.data.push(calculationUtils.calculateRentalIncome(data));
        expenseData.data.push(calculationUtils.calculateRentalTotalExpense(data));
        labels.push(`${year}`);
      }
    });

    return {
      datasets: [incomeData], // Add datasets here
      labels,
      onPointClick: handlePointClick,
    };
  };

  const summaryChartProps = getSummaryChartInputs();

  return (
    <section className='rc-summary'>
      <div className='summary-container'>
        <h2>Cash Flow</h2>
        <div className='chart-box-small-centered'>
          <LineChart 
            {...summaryChartProps}
          />
        </div>
      </div>
    </section>
  );
}