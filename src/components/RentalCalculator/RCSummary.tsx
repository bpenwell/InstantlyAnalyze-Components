import React from 'react';
import { IRentalCalculatorPageData } from '../../interfaces';
import './RCSummary.css';
import LineChart, { ILineChartProps } from '../Charts/LineChart';
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

  const getSummaryChartInputs = (): ILineChartProps => {
    const lineChartProps: ILineChartProps = {
      data: [],
      labels: []
    };
  
    fullLoanTermRentalReportData.forEach((data: IRentalCalculatorData, index: number) => {
      lineChartProps.data.push(calculationUtils.calculateRentalIncome(data));
      lineChartProps.labels.push(`${index + 1}`);
    });
  
    return lineChartProps;
  };
  
  const summaryChartInputs = getSummaryChartInputs();

  return (
    <section className='rc-summary'>
      <div className='summary-container'>
        <h2>Cash Flow</h2>
        <div className='chart-box-small-centered'>
          <LineChart 
            data={summaryChartInputs.data}
            labels={summaryChartInputs.labels}
            onPointClick={handlePointClick}
          />
        </div>
      </div>
    </section>
  );
}