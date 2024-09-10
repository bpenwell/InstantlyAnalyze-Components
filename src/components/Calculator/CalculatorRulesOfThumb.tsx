import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { CalculationUtils, displayAsMoney, displayAsPercent } from '@bpenwell/rei-module';
import './CalculatorRulesOfThumb.css';

export const CalculatorRulesOfThumb: React.FC<IRentalCalculatorPageProps> = (props) => {
    const calculationUtils = new CalculationUtils();
    const { initialRentalReportData } = props;

    const noi = calculationUtils.calculateNOI(initialRentalReportData);
    const cocROI = calculationUtils.calculateCoCROI(initialRentalReportData);
    const goingInCapRate = calculationUtils.calculateGoingInCapRate(initialRentalReportData);
    const fiftyPercentRuleCashFlow = calculationUtils.calculate50PercentRuleCashFlow(initialRentalReportData);

    return (
        <div className="calculator-container">
            <section className="calculator-rules-of-thumb">
                <h2>Rules of Thumb</h2>
                <table className="rules-of-thumb-table">
                    <tbody>
                        <tr>
                            <td>NOI</td>
                            <td>{displayAsMoney(noi, 0, "$", false, true)}</td>
                        </tr>
                        <tr>
                            <td>CoC ROI</td>
                            <td>{displayAsPercent(cocROI)}</td>
                        </tr>
                        <tr>
                            <td>Going In Cap Rate</td>
                            <td>{displayAsPercent(goingInCapRate)}</td>
                        </tr>
                        <tr>
                            <td>50% Rule Cash Flow</td>
                            <td>{displayAsMoney(fiftyPercentRuleCashFlow, 0, '$')}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};
