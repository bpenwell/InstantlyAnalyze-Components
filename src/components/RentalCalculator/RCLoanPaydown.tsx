import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import LineChart, { ILineChartDataset } from '../Charts/LineChart';
import { CalculationUtils, printObjectFields } from '@bpenwell/rei-module';
import { TIME_PERIODS, CHART_COLORS } from '../../constants';

export const RCLoanPaydown: React.FC<IRentalCalculatorPageProps> = (props) => {
  const calculationUtils = new CalculationUtils();
  const { fullLoanTermRentalReportData } = props;
  const loanAmount = (year: number): number => {
    return calculationUtils.calculateRemainingLoanAmount(fullLoanTermRentalReportData[year], year)
  };

  const loanBalanceData: ILineChartDataset = {
    label: 'Loan Balance',
    data: TIME_PERIODS.map(year => loanAmount(year)),
    borderColor: CHART_COLORS.complementaryRed,
    backgroundColor: 'rgba(164, 0, 0, 0.75)',
  };

  const equityData: ILineChartDataset = {
    label: 'Equity',
    data: TIME_PERIODS.map(year => {
      const propertyValue = fullLoanTermRentalReportData[year]?.purchaseDetails.reportPropertyValue || 0;
      const loanBalance = loanAmount(year);
      return propertyValue - loanBalance;
    }),
    borderColor: CHART_COLORS.variableExpensesOrange,
    backgroundColor: 'rgba(230, 159, 0, 0.75)',
  };

  const propertyValueData: ILineChartDataset = {
    label: 'Property Value',
    data: TIME_PERIODS.map(year => fullLoanTermRentalReportData[year]?.purchaseDetails.reportPropertyValue || 0),
    borderColor: CHART_COLORS.mainGreen,
    backgroundColor: 'rgba(0, 74, 0, 0.75)',
  };

  const chartProps = {
    datasets: [loanBalanceData, equityData, propertyValueData],
    labels: TIME_PERIODS.map(year => `${year}`),
    interactive: false,
  };

  return (
    <section className="rc-loan-paydown">
      <h2 className="rc-header">Loan Paydown Overview</h2>
      <div className="chart-container">
        <LineChart {...chartProps} />
      </div>
      <table className="loan-paydown-table">
        <tbody>
          <tr>
            <td>Property Value</td>
            {propertyValueData.data.map((value, index) => (
              <td key={index}>{`$${value.toFixed(2)}`}</td>
            ))}
          </tr>
          <tr>
            <td>Equity</td>
            {equityData.data.map((value, index) => (
              <td key={index}>{`$${value.toFixed(2)}`}</td>
            ))}
          </tr>
          <tr>
            <td>Loan Balance</td>
            {loanBalanceData.data.map((value, index) => (
              <td key={index}>{`$${value.toFixed(2)}`}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
};