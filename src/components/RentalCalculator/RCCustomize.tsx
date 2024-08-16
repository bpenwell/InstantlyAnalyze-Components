import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { Slider } from '@mui/material';
//import 'rc-slider/assets/index.css';
import './RCCustomize.css';
import { CalculationUtils } from '@bpenwell/rei-module';

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const RCCustomize: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
    const calculatorUtils = new CalculationUtils();
    const initialRentalReportData = props.fullLoanTermRentalReportData[0];
    const rentalIncome = Number(props.currentYearData.rentalIncome.grossMonthlyIncome.toFixed(0));
    const otherExpenses = Number(props.currentYearData.expenseDetails.other.toFixed(0));
    const vacancy = calculatorUtils.calculateVacancyPercentage(props.currentYearData);
    const managementFees = Number(props.currentYearData.expenseDetails.managementFees.toFixed(0));
    const purhcasePrice = Number(props.currentYearData.purchaseDetails.purchasePrice.toFixed(0));
    const loanToValuePercent = calculatorUtils.calculateLoanPercentage(props.currentYearData);
    const loanTerm = props.currentYearData.loanDetails.loanTerm;
    const interestRate = props.currentYearData.loanDetails.interestRate;

    const [initalRentalIncome, setInitalRentalIncome] = useState(0);
    const handleRentalIncomeChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            rentalIncome: {
                ...initialRentalReportData.rentalIncome,
                grossMonthlyIncome: newValue as number
            }
        });
    };
    const handleOtherExpensesChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            expenseDetails: {
                ...initialRentalReportData.expenseDetails,
                other: newValue as number
            }
        });
    };
    const handleVacancyChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            expenseDetails: {
                ...initialRentalReportData.expenseDetails,
                vacancy: newValue as number
            }
        });
    };
    const handleManagementFeesChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            expenseDetails: {
                ...initialRentalReportData.expenseDetails,
                managementFees: newValue as number
            }
        });
    };
    const handlePurchasePriceChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            purchaseDetails: {
                ...initialRentalReportData.purchaseDetails,
                purchasePrice: newValue as number
            }
        });
    };
    const handleLoanPercentageChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            loanDetails: {
                ...initialRentalReportData.loanDetails,
                downPayment: newValue * initialRentalReportData.purchaseDetails.purchasePrice,
            }
        });
    };
    const handleInterestRateChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            loanDetails: {
                ...initialRentalReportData.loanDetails,
                interestRate: newValue,
            }
        });
    };
    const handleLoanTermChange = (newValue: number) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            loanDetails: {
                ...initialRentalReportData.loanDetails,
                loanTerm: newValue,
            }
        });
    };

    useEffect(() => {
        console.debug(`initalRentalIncome: ${initalRentalIncome}`);
        setInitalRentalIncome(rentalIncome);
    }, []);

    const getLowerRangeValue = (value: number, isPercent: boolean): number => {
        if (isPercent) {
            return 0;
        }
        return value * 0.5;
    };

    /**
     * @param isPercent if true, max is 20%
     * @returns 
     */
    const getHigherRangeValue = (value: number, isPercent: boolean): number => {
        if (isPercent) {
            return 20;
        }
        return value * 1.5;
    };

    /**
     * 
     * @param sectionTitle 
     * @param sliderLabel exact label suffix (might need to include spaces as needed)
     * @returns 
     */
    const makeSliderContainer = (sectionTitle: string, sliderLabel: string, sliderValue: number, isPercentDisplay: boolean, handleValueChange: (newValue: number) => void) => {
        return (
            <div className="analysis-report-slider-container">
                <span className="analysis-form-label">
                    <span>{sectionTitle}</span>
                    <span className="analysis-report-slider-value">{sliderLabel}</span>
                </span>
                <Slider
                aria-label="Small steps"
                defaultValue={sliderValue}
                getAriaValueText={(value, _) => {return sliderLabel}}
                step={1}
                marks
                min={getLowerRangeValue(initalRentalIncome, isPercentDisplay)}
                max={getHigherRangeValue(initalRentalIncome, isPercentDisplay)}
                valueLabelDisplay="auto"
                onChange={(event, newValue) => {
                    if ((newValue as number[]).length > 1) {
                        throw Error(`Weird newValue: ${newValue}`);
                    }
                    handleValueChange(newValue as number);
                }}
                />
            </div>
        );
    };

    return (
        <section className='rc-graph'>
            <div className='graph-container'>
                <h2>Test Different Scenarios</h2>
                <div className="analysis-report-section">
                    <div className="analysis-report-section-header">
                        <h3 className="analysis-report-section-title">Rental income</h3>
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Rental Income', `$${rentalIncome}`, rentalIncome, false, handleRentalIncomeChange)}
                    </div>
                </div>
                <div className="analysis-report-section">
                    <div className="analysis-report-section-header">
                        <h3 className="analysis-report-section-title">Expenses</h3>
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Custom Expenses', `$${otherExpenses}`, otherExpenses, false, handleOtherExpensesChange)}
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Vacancy', `${vacancy}%`, vacancy, true, handleVacancyChange)}
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Management Fees', `${managementFees}%`, managementFees, true, handleManagementFeesChange)}
                    </div>
                </div>
                <div className="analysis-report-section">
                    <div className="analysis-report-section-header">
                        <h3 className="analysis-report-section-title">Loan details</h3>
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Purchase price', `$${purhcasePrice}`, purhcasePrice, false, handlePurchasePriceChange)}
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Loan To Value (LTV)', `$${loanToValuePercent}`, loanToValuePercent, false, handleLoanPercentageChange)}
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Loan term', `${loanTerm} years`, loanTerm, false, handleLoanTermChange)}
                    </div>
                    <div className="analysis-report-section-body">
                        {makeSliderContainer('Interest rate', `${interestRate}%`, interestRate, true, handleInterestRateChange)}
                    </div>
                </div>
            </div>
        </section>
    );
};
