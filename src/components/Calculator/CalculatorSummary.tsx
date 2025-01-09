// CalculatorSummary.tsx

import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { CalculationUtils, displayAsMoney, displayAsPercent, IRentalCalculatorData } from '@bpenwell/instantlyanalyze-module';
import {
  Container,
  Header,
  Box,
  ColumnLayout,
  SpaceBetween,
  TextContent,
} from '@cloudscape-design/components';
import { CloudscapeLineChart, ILineChartDataset, ILineChartProps} from './../Charts/CloudscapeLineChart';
import './CalculatorSummary.css';

export interface ICalculatorSummary extends IRentalCalculatorPageProps {
  updateDataYear: (loanTermIndex: number) => void;
}

export const CalculatorSummary: React.FC<ICalculatorSummary> = (props: ICalculatorSummary) => {
  const calculationUtils = new CalculationUtils();
  const { fullLoanTermRentalReportData, updateDataYear, currentYearData, currentYear } = props;

  const handlePointClick = (index: number, value: number, label: string) => {
    const newYear: number = Number(label);
    updateDataYear(newYear);
  };

  const shouldDisplayChartTermYear = (termYear: number): boolean => {
    const overrideAcceptedYears = [0, 1, 2, 3, 4];
    const generalAcceptedYearMultiplier = 5;
    return (
      overrideAcceptedYears.includes(termYear) ||
      termYear % generalAcceptedYearMultiplier === 0
    );
  };

  const getSummaryChartInputs = (): ILineChartProps => {
    const incomeData: ILineChartDataset = {
      label: 'Rental Income',
      data: [],
      borderColor: '#004A00', // Main green
      backgroundColor: 'rgba(0, 74, 0, 0.75)', // Transparent green background
    };
    const expenseData: ILineChartDataset = {
      label: 'Expenses',
      data: [],
      borderColor: '#A40000', // Complementary red
      backgroundColor: 'rgba(164, 0, 0, 0.75)', // Transparent red background
    };
    const cashFlowData: ILineChartDataset = {
      label: 'Cash Flow',
      data: [],
      borderColor: '#000000', // Black for cash flow
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Transparent black background
    };

    const labels: string[] = [];

    fullLoanTermRentalReportData.forEach((data: IRentalCalculatorData, index: number) => {
      const year = index + 1;
      if (shouldDisplayChartTermYear(year)) {
        const totalIncome = calculationUtils.calculateRentalIncomePerMonth(data);
        const totalExpenses = calculationUtils.calculateRentalTotalExpensePerMonth(data);
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

  const income = calculationUtils.calculateRentalIncomePerMonth(currentYearData);
  const expenses = calculationUtils.calculateRentalTotalExpensePerMonth(currentYearData);
  const monthlyCashFlow = income - expenses;
  const cashOnCashROI = calculationUtils.calculateCoCROI(currentYearData);

  const fiveYearOrLessYear =
    fullLoanTermRentalReportData.length >= 5 ? 5 : fullLoanTermRentalReportData.length;
  const fiveYearReturn = calculationUtils.calculateFiveYearAnnualizedReturn(fullLoanTermRentalReportData);
  const mortgagePayment = displayAsMoney(
    calculationUtils.calculateMortgagePayment(currentYearData),
    2
  );

  return (
    <Container /*header={<Header variant="h2">Cash Flow</Header>}*/>
      <SpaceBetween size="l">
        <div className="line-container">
          <CloudscapeLineChart {...summaryChartProps} />
        </div>
        <Box>
          <TextContent>
            <h3>
              {`Monthly Cash Flow${currentYear !== 0 ? ` (at year ${currentYear})` : ''}`}
            </h3>
            <Box variant="strong" fontSize="display-l">
              ${monthlyCashFlow.toFixed(0)} /mo
            </Box>
          </TextContent>
        </Box>
        {/* Need space under the chart for legend */}
        <SpaceBetween size="l"/>
        <SpaceBetween size="s"/>
        {/* Need space under the chart for legend */}
        <ColumnLayout columns={3} variant="text-grid">
          <Box>
            <TextContent>
              <h4>Income</h4>
              <Box>${income.toFixed(0)} /mo</Box>
            </TextContent>
          </Box>
          <Box>
            <TextContent>
              <h4>Expenses</h4>
              <Box>${expenses.toFixed(0)} /mo</Box>
            </TextContent>
          </Box>
          <Box>
            <TextContent>
              <h4>CoC ROI</h4>
              <Box>{cashOnCashROI.toFixed(2)}%</Box>
            </TextContent>
          </Box>
        </ColumnLayout>
        <ColumnLayout columns={2}>
          <Box>
            <TextContent>
              <h4>Mortgage Payment</h4>
              <Box variant="strong">{mortgagePayment}</Box>
            </TextContent>
          </Box>
          <Box>
            <TextContent>
              <h4>{`${fiveYearOrLessYear}-Year Annualized Return`}</h4>
              <Box variant="strong">{displayAsPercent(fiveYearReturn, 2, true)}</Box>
            </TextContent>
          </Box>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};
