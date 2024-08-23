import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { CalculationUtils, displayAsMoney, displayAsPercent } from '@bpenwell/rei-module';
import './CalculatorRulesOfThumb.css';

export const CalculatorRulesOfThumb: React.FC<IRentalCalculatorPageProps> = (props) => {
    const calculationUtils = new CalculationUtils();
    const { currentYearData } = props;

    const noi = calculationUtils.calculateRentalIncome(currentYearData) - calculationUtils.calculateRentalTotalExpense(currentYearData);
    const cocROI = calculationUtils.calculateCoCROI(currentYearData);
    const purchaseCap = (noi / currentYearData.purchaseDetails.purchasePrice) * 100;
    const cashFlow = calculationUtils.calculateCashFlow(currentYearData);
    const mortgagePayment = calculationUtils.calculateMortgagePayment(currentYearData);

    return (
        <div className="calculator-container">
            <section className="calculator-rules-of-thumb">
                <h2>Rules of Thumb</h2>
                <table className="rules-of-thumb-table">
                    <tbody>
                        <tr>
                            <td>NOI</td>
                            <td>{displayAsMoney(noi, 0, "$", true)}</td>
                        </tr>
                        <tr>
                            <td>CoC ROI</td>
                            <td>{displayAsPercent(cocROI)}</td>
                        </tr>
                        <tr>
                            <td>Purchase Cap Rate</td>
                            <td>{displayAsPercent(purchaseCap)}</td>
                        </tr>
                        <tr>
                            <td>Mortgage Payment</td>
                            <td>{displayAsMoney(mortgagePayment, 0, "$", true)}</td>
                        </tr>
                        <tr>
                            <td>Cash Flow</td>
                            <td>{displayAsMoney(cashFlow, 0, "$", true)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};
