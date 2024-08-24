import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import LineChart, { ILineChartDataset } from '../Charts/LineChart';
import { CalculationUtils, displayAsMoney, displayAsPercent } from '@bpenwell/rei-module';
import { TIME_PERIODS, CHART_COLORS } from '../../constants';
import './CalculatorLoanPaydown.css';

export const CalculatorLoanPaydown: React.FC<IRentalCalculatorPageProps> = (props) => {
    const calculationUtils = new CalculationUtils();
    const { fullLoanTermRentalReportData } = props;

    const loanAmount = (year: number): number => {
        return calculationUtils.calculateRemainingLoanAmount(fullLoanTermRentalReportData[year], year);
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

    const cashFlowData = TIME_PERIODS.map(year => calculationUtils.calculateCashFlow(fullLoanTermRentalReportData[year]));
    const mortgagePaymentData = TIME_PERIODS.map(year => calculationUtils.calculateMortgagePayment(fullLoanTermRentalReportData[year]));
    const profitIfSoldData = TIME_PERIODS.map(year => calculationUtils.calculateProfitIfSold([fullLoanTermRentalReportData[year]]));
    const annualizedReturnData = TIME_PERIODS.map(year => calculationUtils.calculateAnnualizedReturn([fullLoanTermRentalReportData[year]]));

    const chartProps = {
        datasets: [loanBalanceData, equityData, propertyValueData],
        labels: TIME_PERIODS.map(year => `${year}`),
        interactive: false,
    };

    return (
        <div className="calculator-container" style={{ textAlign: 'center', marginBottom: '0px' }}>
            <div className='loan-paydown-container'>
                <h2>Loan Paydown Overview</h2>
                <div className="chart-container" style={{ maxWidth: '50%', height: '20%' }}>
                    <LineChart {...chartProps} />
                </div>
                <table className="loan-paydown-table">
                    <thead>
                        <tr>
                            <td></td>
                            {TIME_PERIODS.map((year, index) => (
                                <td key={index}>Year {year}</td>
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
                                <td key={index}>{displayAsMoney(value, 0, "$", true)}</td>
                            ))}
                        </tr>
                        {/* New Rows */}
                        <tr>
                            <td>Cash Flow</td>
                            {cashFlowData.map((value, index) => (
                                <td key={index}>{displayAsMoney(value, 0, "$", true)}</td>
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
                            <td>Annualized Return</td>
                            {annualizedReturnData.map((value, index) => (
                                <td key={index}>{displayAsPercent(value)}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
