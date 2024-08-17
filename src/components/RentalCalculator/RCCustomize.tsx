import React, { useState, useEffect, useMemo } from 'react';
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
    const initialRentalReportData = useMemo(() => props.fullLoanTermRentalReportData[0], [props.fullLoanTermRentalReportData]);
    const rentalIncome = useMemo(() => Number(props.currentYearData.rentalIncome.grossMonthlyIncome.toFixed(0)), [props.currentYearData]);
    const otherExpenses = useMemo(() => Number(props.currentYearData.expenseDetails.other.toFixed(0)), [props.currentYearData]);
    const vacancy = useMemo(() => calculatorUtils.calculateVacancyPercentage(props.currentYearData), [props.currentYearData]);
    const managementFees = useMemo(() => Number(props.currentYearData.expenseDetails.managementFees.toFixed(0)), [props.currentYearData]);
    const purchasePrice = useMemo(() => Number(props.currentYearData.purchaseDetails.purchasePrice.toFixed(0)), [props.currentYearData]);
    const loanToValuePercent = useMemo(() => calculatorUtils.calculateLoanPercentage(props.currentYearData), [props.currentYearData]);
    const loanTerm = useMemo(() => props.currentYearData.loanDetails.loanTerm, [props.currentYearData]);
    const interestRate = useMemo(() => props.currentYearData.loanDetails.interestRate, [props.currentYearData]);

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
    const makeSliderContainer = (sectionTitle: string, sliderLabel: string, currentSliderValue: number, initialSliderValue: number, isPercentDisplay: boolean, handleValueChange: (newValue: number) => void) => {
        return (
            <div className="slider-container">
                <span className="analysis-form-label">
                    <span>{sectionTitle}</span>
                    <span className="slider-value">{sliderLabel}</span>
                </span>
                <Slider
                aria-label="Small steps"
                defaultValue={currentSliderValue}
                getAriaValueText={(value, _) => {return sliderLabel}}
                step={1}
                marks
                //min={getLowerRangeValue(initialSliderValue, isPercentDisplay)}
                //max={getHigherRangeValue(initialSliderValue, isPercentDisplay)}
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
            <div className='graph-box'>
                <h2>Test Different Scenarios</h2>
                <div className="report-section">
                    <div className="section-header">
                        <h3 className="section-title">Rental income</h3>
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Rental Income: ', `$${rentalIncome}`, rentalIncome, rentalIncome, false, handleRentalIncomeChange)}
                    </div>
                </div>
                <div className="report-section">
                    <div className="section-header">
                        <h3 className="section-title">Expenses</h3>
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Custom Expenses: ', `$${otherExpenses}`, otherExpenses, otherExpenses, false, handleOtherExpensesChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Vacancy: ', `${vacancy}%`, vacancy, vacancy, true, handleVacancyChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Management Fees: ', `${managementFees}%`, managementFees, managementFees, true, handleManagementFeesChange)}
                    </div>
                </div>
                <div className="report-section">
                    <div className="section-header">
                        <h3 className="section-title">Loan details</h3>
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Purchase price: ', `$${purchasePrice}`, purchasePrice, purchasePrice, false, handlePurchasePriceChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Loan To Value (LTV)', `$${loanToValuePercent}`, loanToValuePercent, loanToValuePercent, false, handleLoanPercentageChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Loan term', `${loanTerm} years`, loanTerm, loanTerm, false, handleLoanTermChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Interest rate', `${interestRate}%`, interestRate, interestRate, true, handleInterestRateChange)}
                    </div>
                </div>
            </div>
        </section>
    );
};
