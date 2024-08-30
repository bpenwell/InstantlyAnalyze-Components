import React, {
    useState,
    useMemo,
    Dispatch,
    SetStateAction
} from 'react';
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
import './CalculatorCustomize.css';
import {
    CalculationUtils,
    displayAsMoney,
    IDataDisplayConfig,
    getRentalIncomeDisplayConfig,
    getOtherExpensesDisplayConfig,
    getVacancyDisplayConfig,
    getInterestRateDisplayConfig,
    getLoanTermDisplayConfig,
    getLoanToValuePercentDisplayConfig,
    getPurchasePriceDisplayConfig,
    getManagementFeesDisplayConfig,
    printObjectFields,
    IRentalCalculatorData,
    displayAsPercent,
    Percentage,
    ValueType
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

export const CalculatorCustomize: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
    const { initialRentalReportData, currentYearData } = props;
    const calculatorUtils = new CalculationUtils();
    const [rentalIncome, setRentalIncome] = useState(Number(currentYearData.rentalIncome.grossMonthlyIncome.toFixed(0)));
    const [otherExpenses, setOtherExpenses] = useState(Number(currentYearData.expenseDetails.other.toFixed(0)));
    const [vacancy, setVacancy] = useState(currentYearData.expenseDetails.vacancyPercent);
    const [managementFees, setManagementFees] = useState(currentYearData.expenseDetails.managementFeePercent);
    const [purchasePrice, setPurchasePrice] = useState(Number(currentYearData.purchaseDetails.purchasePrice.toFixed(0)));
    const [loanToValuePercent, setLoanToValuePercent] = useState(currentYearData.loanDetails.loanToValuePercent);
    const [loanTerm, setLoanTerm] = useState(currentYearData.loanDetails.loanTerm);
    const [interestRate, setInterestRate] = useState(currentYearData.loanDetails.interestRate);

    const rentalIncomeSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getRentalIncomeDisplayConfig(rentalIncome);
    }, []);
    const otherExpensesSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getOtherExpensesDisplayConfig(otherExpenses);
    }, []);
    const vacancySliderProps = useMemo<IDataDisplayConfig>(() => {
        return getVacancyDisplayConfig(vacancy);
    }, []);
    const managementFeesSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getManagementFeesDisplayConfig(managementFees);
    }, []);
    const purchasePriceSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getPurchasePriceDisplayConfig(purchasePrice);
    }, []);
    const loanToValuePercentSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getLoanToValuePercentDisplayConfig(loanToValuePercent);
    }, []);
    const loanTermSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getLoanTermDisplayConfig(loanTerm);
    }, []);
    const interestRateSliderProps = useMemo<IDataDisplayConfig>(() => {
        return getInterestRateDisplayConfig(interestRate);
    }, []);

    const handleRentalIncomeChange = (newValue: ValueType) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            rentalIncome: {
                ...initialRentalReportData.rentalIncome,
                grossMonthlyIncome: newValue as number
            }
        });
    };
    const handleOtherExpensesChange = (newValue: ValueType) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            expenseDetails: {
                ...initialRentalReportData.expenseDetails,
                other: newValue as number
            }
        });
    };
    const handleVacancyChange = (newValue: ValueType) => {
        const newData: IRentalCalculatorData = {
            ...initialRentalReportData, 
            expenseDetails: {
                ...initialRentalReportData.expenseDetails,
                vacancyPercent: newValue as Percentage,
            }
        };
        newData.expenseDetails.vacancy = calculatorUtils.calculateVacancyAbsoluteValue(newData);
        props.updateInitialData(newData);
    };
    const handleManagementFeesChange = (newValue: ValueType) => {
        const newData: IRentalCalculatorData = {
            ...initialRentalReportData, 
            expenseDetails: {
                ...initialRentalReportData.expenseDetails,
                managementFeePercent: newValue as Percentage,
            }
        };
        newData.expenseDetails.managementFee = calculatorUtils.calculateManagementFeeAbsoluteValue(newData);
        props.updateInitialData(newData);
    };
    const handlePurchasePriceChange = (newValue: ValueType) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            purchaseDetails: {
                ...initialRentalReportData.purchaseDetails,
                purchasePrice: newValue as number
            }
        });
    };
    const handleLoanPercentageChange = (newValue: ValueType) => {
        const ltvPercent: Percentage = (newValue * 100) as Percentage;
        const downPaymentPercent = 100 - ltvPercent;
        const downPayment = (downPaymentPercent / 100) * initialRentalReportData.purchaseDetails.purchasePrice;
    
        let newData: IRentalCalculatorData = {
            ...initialRentalReportData, 
            loanDetails: {
                ...initialRentalReportData.loanDetails,
                downPayment: downPayment, 
                downPaymentPercent: downPaymentPercent as Percentage,
                loanToValuePercent: ltvPercent,
            }
        };
        props.updateInitialData(newData);
    };
    const handleInterestRateChange = (newValue: ValueType) => {
        props.updateInitialData({
            ...initialRentalReportData, 
            loanDetails: {
                ...initialRentalReportData.loanDetails,
                interestRate: newValue as Percentage,
            }
        });
    };
    const handleLoanTermChange = (newValue: ValueType) => {
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
    const makeSliderContainer = (sectionTitle: string, sliderLabel: string, currentSliderValue: number, dataDisplayConfig: IDataDisplayConfig, handleOnChange: Dispatch<SetStateAction<number>>, handleValueChange: (newValue: ValueType) => void) => {
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
                step={dataDisplayConfig.step}
                marks
                min={dataDisplayConfig.min}
                max={dataDisplayConfig.max}
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
                    handleOnChange(newValue as number);
                }}
                />
            </div>
        );
    };

    return (
        <div className='calculator-container'>
            <h2 className='rc-header'>Test Different Scenarios</h2>
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
                        {makeSliderContainer('Vacancy: ', `${displayAsPercent(vacancy, 0)}`, vacancy, vacancySliderProps, setVacancy as Dispatch<SetStateAction<number>>, handleVacancyChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Management Fees: ', `${displayAsPercent(managementFees, 0)}`, managementFees, managementFeesSliderProps, setManagementFees as Dispatch<SetStateAction<number>>, handleManagementFeesChange)}
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
                        {makeSliderContainer('Loan To Value (LTV): ', `${displayAsPercent(loanToValuePercent, 0, true)}`, loanToValuePercent, loanToValuePercentSliderProps, setLoanToValuePercent as Dispatch<SetStateAction<number>>, handleLoanPercentageChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Loan term: ', `${loanTerm} years`, loanTerm, loanTermSliderProps, setLoanTerm, handleLoanTermChange)}
                    </div>
                    <div className="section-body">
                        {makeSliderContainer('Interest rate: ', `${displayAsPercent(interestRate, 0)}`, interestRate, interestRateSliderProps, setInterestRate as Dispatch<SetStateAction<number>>, handleInterestRateChange)}
                    </div>
                </div>
            </div>
        </div>
    );
};
