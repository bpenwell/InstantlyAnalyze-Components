import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { CalculationUtils, displayAsMoney, displayAsPercent } from '@bpenwell/instantlyanalyze-module';
import './CalculatorRulesOfThumb.css';
import { Container, Header, TextContent } from '@cloudscape-design/components';

export const CalculatorRulesOfThumb: React.FC<IRentalCalculatorPageProps> = (props) => {
    const calculationUtils = new CalculationUtils();
    const { initialRentalReportData } = props;

    const noi = calculationUtils.calculateNOI(initialRentalReportData);
    const cocROI = calculationUtils.calculateCoCROI(initialRentalReportData);
    const goingInCapRate = calculationUtils.calculateGoingInCapRate(initialRentalReportData);
    const fiftyPercentRuleCashFlow = calculationUtils.calculate50PercentRuleCashFlow(initialRentalReportData);

    return (
        <Container className="calculator-container">
            <TextContent>
            <section className="calculator-rules-of-thumb">
                <Header variant="h2">Rules of Thumb</Header>
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
            </TextContent>
        </Container>
    );
};
