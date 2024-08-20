import React, { useState, useMemo } from 'react';
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
import './RCCustomize.css';
import {
    CalculationUtils,
    getHigherRangeSliderValue,
    getLowerRangeSliderValue,
    SliderValueType,
    getSliderStep,
    displayAsMoney
} from '@bpenwell/rei-module';

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ISliderProps {
    min: number;
    max: number;
    step: number;
};

export const RCCustomize: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
    const calculatorUtils = new CalculationUtils();
    const initialRentalReportData = props.fullLoanTermRentalReportData[0];
    const [rentalIncome, setRentalIncome] = useState(Number(props.currentYearData.rentalIncome.grossMonthlyIncome.toFixed(0)));
    const [otherExpenses, setOtherExpenses] = useState(Number(props.currentYearData.expenseDetails.other.toFixed(0)));
    const [vacancy, setVacancy] = useState(calculatorUtils.calculateVacancyPercentage(props.currentYearData));
    const [managementFees, setManagementFees] = useState(Number(props.currentYearData.expenseDetails.managementFees.toFixed(0)));
    const [purchasePrice, setPurchasePrice] = useState(Number(props.currentYearData.purchaseDetails.purchasePrice.toFixed(0)));
    const [loanToValuePercent, setLoanToValuePercent] = useState(calculatorUtils.calculateLoanPercentage(props.currentYearData));
    const [loanTerm, setLoanTerm] = useState(props.currentYearData.loanDetails.loanTerm);
    const [interestRate, setInterestRate] = useState(props.currentYearData.loanDetails.interestRate);

    const rentalIncomeSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(rentalIncome, SliderValueType.RentValue),
            max: getHigherRangeSliderValue(rentalIncome, SliderValueType.RentValue),
            step: getSliderStep(rentalIncome, SliderValueType.RentValue),
        }
    }, []);
    const otherExpensesSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(otherExpenses, SliderValueType.Default),
            max: getHigherRangeSliderValue(otherExpenses, SliderValueType.Default),
            step: getSliderStep(otherExpenses, SliderValueType.Default),
        }
    }, []);
    const vacancySliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(vacancy, SliderValueType.FeePercent),
            max: getHigherRangeSliderValue(vacancy, SliderValueType.FeePercent),
            step: getSliderStep(vacancy, SliderValueType.FeePercent),
        }
    }, []);
    const managementFeesSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(managementFees, SliderValueType.FeePercent),
            max: getHigherRangeSliderValue(managementFees, SliderValueType.FeePercent),
            step: getSliderStep(managementFees, SliderValueType.FeePercent),
        }
    }, []);
    const purchasePriceSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(purchasePrice, SliderValueType.PurchaseValue),
            max: getHigherRangeSliderValue(purchasePrice, SliderValueType.PurchaseValue),
            step: getSliderStep(purchasePrice, SliderValueType.PurchaseValue),
        }
    }, []);
    const loanToValuePercentSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(loanToValuePercent, SliderValueType.LoanToValue),
            max: getHigherRangeSliderValue(loanToValuePercent, SliderValueType.LoanToValue),
            step: getSliderStep(loanToValuePercent, SliderValueType.LoanToValue),
        }
    }, []);
    const loanTermSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(loanTerm, SliderValueType.LoanTerm),
            max: getHigherRangeSliderValue(loanTerm, SliderValueType.LoanTerm),
            step: getSliderStep(loanTerm, SliderValueType.LoanTerm),
        }
    }, []);
    const interestRateSliderProps = useMemo<ISliderProps>(() => {
        return {
            min: getLowerRangeSliderValue(interestRate, SliderValueType.InterestPercent),
            max: getHigherRangeSliderValue(interestRate, SliderValueType.InterestPercent),
            step: getSliderStep(interestRate, SliderValueType.InterestPercent),
        }
    }, []);
    console.debug('[DEBUG] Render RCCustomize');

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

    /**
     * 
     * @param sectionTitle 
     * @param sliderLabel exact label suffix (might need to include spaces as needed)
     * @returns 
     */
    const makeSliderContainer = (sectionTitle: string, sliderLabel: string, currentSliderValue: number, sliderMinMaxStep: ISliderProps, handleOnChange: React.Dispatch<React.SetStateAction<number>>, handleValueChange: (newValue: number) => void) => {
        return (
            <div className="slider-container">
                <span className="analysis-form-label">
                    <span>{sectionTitle}</span>
                    <span className="slider-value">{sliderLabel}</span>
                </span>
                <Slider
                className='custom-slider'
                aria-label="Small steps"
                value={currentSliderValue}
                getAriaValueText={(value, _) => {return sliderLabel}}
                step={sliderMinMaxStep.step}
                marks
                min={sliderMinMaxStep.min}
                max={sliderMinMaxStep.max}
                valueLabelDisplay="auto"
                onChangeCommitted={(event, newValue) => {
                    if ((newValue as number[]).length > 1) {
                        throw Error(`Weird newValue: ${newValue}`);
                    }
                    handleValueChange(newValue as number);
                }}
                onChange={(event, newValue) => {
                    if ((newValue as number[]).length > 1) {
                        throw Error(`Weird newValue: ${newValue}`);
                    }
                    handleOnChange(newValue as number)
                }}
                />
            </div>
        );
    };

    return (
        <section className='rc-graph'>
            <h2 style={{ textAlign: 'center' }}>Test Different Scenarios</h2>
            <div className='graph-box'>
                <div className="report-section">
                    <div className="section-header">
                        <h3 className="section-title">Rental income</h3>
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Rental Income: ', `${displayAsMoney(rentalIncome)}`, rentalIncome, rentalIncomeSliderProps, setRentalIncome, handleRentalIncomeChange)}
                    </div>
                </div>
                <div className="report-section">
                    <div className="section-header">
                        <h3 className="section-title">Expenses</h3>
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Custom Expenses: ', `${displayAsMoney(otherExpenses)}`, otherExpenses, otherExpensesSliderProps, setOtherExpenses, handleOtherExpensesChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Vacancy: ', `${vacancy}%`, vacancy, vacancySliderProps, setVacancy, handleVacancyChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Management Fees: ', `${managementFees}%`, managementFees, managementFeesSliderProps, setManagementFees, handleManagementFeesChange)}
                    </div>
                </div>
                <div className="report-section">
                    <div className="section-header">
                        <h3 className="section-title">Loan details</h3>
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Purchase price: ', `${displayAsMoney(purchasePrice)}`, purchasePrice, purchasePriceSliderProps, setPurchasePrice, handlePurchasePriceChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Loan To Value (LTV): ', `${displayAsMoney(loanToValuePercent * purchasePrice)}`, loanToValuePercent, loanToValuePercentSliderProps, setLoanToValuePercent, handleLoanPercentageChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Loan term: ', `${loanTerm} years`, loanTerm, loanTermSliderProps, setLoanTerm, handleLoanTermChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Interest rate: ', `${interestRate}%`, interestRate, interestRateSliderProps, setInterestRate, handleInterestRateChange)}
                    </div>
                </div>
            </div>
        </section>
    );
};
