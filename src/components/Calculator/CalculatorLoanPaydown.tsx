import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import LineChart, { ILineChartDataset, ILineChartProps } from '../Charts/LineChart';
import { TIME_PERIODS, CalculationUtils, displayAsMoney, displayAsPercent } from '@bpenwell/instantlyanalyze-module';
import { CHART_COLORS } from '../../constants';
import './CalculatorLoanPaydown.css';
import { Container, Header, TextContent } from '@cloudscape-design/components';

export const CalculatorLoanPaydown: React.FC<IRentalCalculatorPageProps> = (props) => {
    const calculationUtils = new CalculationUtils();
    const { initialRentalReportData, fullLoanTermRentalReportData } = props;

    const applicableLoanTermTimePeriods = TIME_PERIODS.filter((period) => {
        return period <= initialRentalReportData.loanDetails.loanTerm ||
            !TIME_PERIODS.includes(initialRentalReportData.loanDetails.loanTerm);
    });

    const loanAmount = (year: number): number => {
        return calculationUtils.calculateRemainingLoanAmount(fullLoanTermRentalReportData[year], year);
    };

    const loanBalanceData: ILineChartDataset = {
        label: 'Loan Balance',
        data: applicableLoanTermTimePeriods.map(year => loanAmount(year)),
        borderColor: CHART_COLORS.complementaryRed,
        backgroundColor: 'rgba(164, 0, 0, 0.75)',
    };

    const equityData: ILineChartDataset = {
        label: 'Equity',
        data: applicableLoanTermTimePeriods.map(year => {
            const propertyValue = fullLoanTermRentalReportData[year]?.purchaseDetails.reportPropertyValue || 0;
            const loanBalance = loanAmount(year);
            return propertyValue - loanBalance;
        }),
        borderColor: CHART_COLORS.variableExpensesOrange,
        backgroundColor: 'rgba(230, 159, 0, 0.75)',
    };

    const propertyValueData: ILineChartDataset = {
        label: 'Property Value',
        data: applicableLoanTermTimePeriods.map(year => fullLoanTermRentalReportData[year]?.purchaseDetails.reportPropertyValue || 0),
        borderColor: CHART_COLORS.mainGreen,
        backgroundColor: 'rgba(0, 74, 0, 0.75)',
    };

    const getAnnualizedReturn = (year: number, includeSellExpenses: boolean): number => {
        if (year === 0) {
            return 0;
        }

        const allNonInitialReportData = fullLoanTermRentalReportData.slice(1);
        return calculationUtils.calculateAnnualizedReturn(allNonInitialReportData.slice(0, year), includeSellExpenses)
    };

    const cashFlowData = applicableLoanTermTimePeriods.map(year => calculationUtils.calculateCashFlow(fullLoanTermRentalReportData[year]));
    const mortgagePaymentData = applicableLoanTermTimePeriods.map(year => calculationUtils.calculateMortgagePayment(fullLoanTermRentalReportData[year]));
    const profitIfSoldData = applicableLoanTermTimePeriods.map(year => calculationUtils.calculateProfitIfSold([fullLoanTermRentalReportData[year]]));
    const annualizedReturnDataBeforeSell = applicableLoanTermTimePeriods.map(year => getAnnualizedReturn(year, false));
    const annualizedReturnDataAfterSell = applicableLoanTermTimePeriods.map(year => getAnnualizedReturn(year, true));

    const chartProps: ILineChartProps = {
        datasets: [loanBalanceData, equityData, propertyValueData],
        labels: applicableLoanTermTimePeriods.map(year => `${year}`),
        interactive: false,
    };

    return (
        <Container /*className="calculator-container"*/>
            <div className='loan-paydown-container'>
                <Header variant="h2">Loan Paydown Overview</Header>
                <div className="chart-container" style={{ maxWidth: '50%', height: '20%' }}>
                    <LineChart {...chartProps} />
                </div>
                <TextContent>
                    <table className="loan-paydown-table">
                        <thead>
                            <tr>
                                <td></td>
                                {applicableLoanTermTimePeriods.map((year, index) => (
                                    <td key={index}>{index === 0 ? '-' : `Year ${year}`}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span className="color-box" style={{ backgroundColor: CHART_COLORS.mainGreen }}></span>
                                    Property Value
                                </td>
                                {propertyValueData.data.map((value, index) => (
                                    <td key={index}>{displayAsMoney(value, 0, "$", true)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>
                                    <span className="color-box" style={{ backgroundColor: CHART_COLORS.variableExpensesOrange }}></span>
                                    Equity
                                </td>
                                {equityData.data.map((value, index) => (
                                    <td key={index}>{displayAsMoney(value, 0, "$", true)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>
                                    <span className="color-box" style={{ backgroundColor: CHART_COLORS.complementaryRed }}></span>
                                    Loan Balance
                                </td>
                                {loanBalanceData.data.map((value, index) => (
                                    <td key={index}>{displayAsMoney(value, 0, "$", false, true)}</td>
                                ))}
                            </tr>
                            {/* New Rows */}
                            <tr>
                                <td>Cash Flow</td>
                                {cashFlowData.map((value, index) => (
                                    <td key={index}>{displayAsMoney(value, 0, "$", false, true)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Mortgage Payment</td>
                                {mortgagePaymentData.map((value, index) => (
                                    <td key={index}>{displayAsMoney(value, 0, "$", true)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Profit if Sold</td>
                                {profitIfSoldData.map((value, index) => (
                                    <td key={index}>{displayAsMoney(value, 0, "$", true)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Annualized Return (w/o sell fees)</td>
                                {annualizedReturnDataBeforeSell.map((value, index) => (
                                    <td key={index}>{index === 0 ? '-' : `${displayAsPercent(value, 2, true)}`}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Annualized Return (w/ sell fees)</td>
                                {annualizedReturnDataAfterSell.map((value, index) => (
                                    <td key={index}>{index === 0 ? '-' : `${displayAsPercent(value, 2, true)}`}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </TextContent>
            </div>
        </Container>
    );
};
