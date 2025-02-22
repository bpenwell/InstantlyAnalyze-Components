import React, { useState, useMemo, Dispatch, SetStateAction } from 'react';
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
  IRentalCalculatorData,
  displayAsPercent,
  Percentage,
  ValueType,
} from '@bpenwell/instantlyanalyze-module';
// Import Cloudscape components and types
import {
  Container,
  Header,
  TextContent,
  Slider,
  SliderProps,
  NonCancelableCustomEvent,
} from '@cloudscape-design/components';
import './CalculatorCustomize.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const CalculatorCustomize: React.FC<IRentalCalculatorPageProps> = (props: IRentalCalculatorPageProps) => {
  const { initialRentalReportData, currentYearData } = props;
  const calculatorUtils = new CalculationUtils();

  const [rentalIncome, setRentalIncome] = useState<number>(
    Number(currentYearData.rentalIncome.grossMonthlyIncome.toFixed(0))
  );
  const [otherExpenses, setOtherExpenses] = useState<number>(
    Number(currentYearData.expenseDetails.other.toFixed(0))
  );
  const [vacancy, setVacancy] = useState<number>(currentYearData.expenseDetails.vacancyPercent);
  const [managementFeePercent, setManagementFeePercent] = useState<number>(
    currentYearData.expenseDetails.managementFeePercent
  );
  const [purchasePrice, setPurchasePrice] = useState<number>(
    Number(currentYearData.purchaseDetails.purchasePrice.toFixed(0))
  );
  const [loanToValuePercent, setLoanToValuePercent] = useState<number>(
    currentYearData.loanDetails.loanToValuePercent
  );
  const [loanTerm, setLoanTerm] = useState<number>(currentYearData.loanDetails.loanTerm);
  const [interestRate, setInterestRate] = useState<number>(currentYearData.loanDetails.interestRate);
  const [totalCashNeeded, setTotalCashNeeded] = useState<number>(
    calculatorUtils.calculateTotalCashNeeded(initialRentalReportData)
  );

  const rentalIncomeSliderProps: IDataDisplayConfig = useMemo(
    () => getRentalIncomeDisplayConfig(rentalIncome),
    //Don't update based on this changing, it will change min/max too
    []
  );
  const otherExpensesSliderProps: IDataDisplayConfig = useMemo(
    () => getOtherExpensesDisplayConfig(otherExpenses),
    //Don't update based on this changing, it will change min/max too
    []
  );
  const vacancySliderProps: IDataDisplayConfig = useMemo(
    () => getVacancyDisplayConfig(vacancy),
    [vacancy]
  );
  const managementFeesSliderProps: IDataDisplayConfig = useMemo(
    () => getManagementFeesDisplayConfig(managementFeePercent),
    [managementFeePercent]
  );
  const purchasePriceSliderProps: IDataDisplayConfig = useMemo(
    () => getPurchasePriceDisplayConfig(purchasePrice),
    //Don't update based on this changing, it will change min/max too
    []
  );
  const loanToValuePercentSliderProps: IDataDisplayConfig = useMemo(
    () => getLoanToValuePercentDisplayConfig(loanToValuePercent),
    [loanToValuePercent]
  );
  const loanTermSliderProps: IDataDisplayConfig = useMemo(
    () => getLoanTermDisplayConfig(loanTerm),
    [loanTerm]
  );
  const interestRateSliderProps: IDataDisplayConfig = useMemo(
    () => getInterestRateDisplayConfig(interestRate),
    [interestRate]
  );

  const handleRentalIncomeChange = (newValue: ValueType): void => {
    const newData: IRentalCalculatorData = {
      ...initialRentalReportData,
      rentalIncome: {
        ...initialRentalReportData.rentalIncome,
        grossMonthlyIncome: newValue as number,
      },
    };
    newData.expenseDetails.capitalExpenditure = calculatorUtils.calculateCapitalExpenditureAbsoluteValue(newData);
    newData.expenseDetails.maintenance = calculatorUtils.calculateMaintanenceAbsoluteValue(newData);
    newData.expenseDetails.managementFee = calculatorUtils.calculateManagementFeeAbsoluteValue(newData);
    newData.expenseDetails.vacancy = calculatorUtils.calculateVacancyAbsoluteValue(newData);

    props.updateInitialData(newData);
  };

  const handleOtherExpensesChange = (newValue: ValueType): void => {
    props.updateInitialData({
      ...initialRentalReportData,
      expenseDetails: {
        ...initialRentalReportData.expenseDetails,
        other: newValue as number,
      },
    });
  };

  const handleVacancyChange = (newValue: ValueType): void => {
    const newData: IRentalCalculatorData = {
      ...initialRentalReportData,
      expenseDetails: {
        ...initialRentalReportData.expenseDetails,
        vacancyPercent: newValue as Percentage,
      },
    };
    newData.expenseDetails.vacancy = calculatorUtils.calculateVacancyAbsoluteValue(newData);
    props.updateInitialData(newData);
  };

  const handleManagementFeesChange = (newValue: ValueType): void => {
    const newData: IRentalCalculatorData = {
      ...initialRentalReportData,
      expenseDetails: {
        ...initialRentalReportData.expenseDetails,
        managementFeePercent: newValue as Percentage,
      },
    };
    newData.expenseDetails.managementFee = calculatorUtils.calculateManagementFeeAbsoluteValue(newData);
    props.updateInitialData(newData);
  };

  const handlePurchasePriceChange = (newValue: ValueType): void => {
    props.updateInitialData({
      ...initialRentalReportData,
      purchaseDetails: {
        ...initialRentalReportData.purchaseDetails,
        purchasePrice: newValue as number,
      },
    });
  };

  const handleLoanPercentageChange = (newValue: ValueType): void => {
    const ltvPercent: Percentage = newValue as Percentage;
    const downPaymentPercent: number = 100 - ltvPercent;
    const downPayment: number =
      (downPaymentPercent / 100) * initialRentalReportData.purchaseDetails.purchasePrice;

    const newData: IRentalCalculatorData = {
      ...initialRentalReportData,
      loanDetails: {
        ...initialRentalReportData.loanDetails,
        downPayment: downPayment,
        downPaymentPercent: downPaymentPercent as Percentage,
        loanToValuePercent: ltvPercent,
      },
    };
    setTotalCashNeeded(calculatorUtils.calculateTotalCashNeeded(newData));
    props.updateInitialData(newData);
  };

  const handleInterestRateChange = (newValue: ValueType): void => {
    props.updateInitialData({
      ...initialRentalReportData,
      loanDetails: {
        ...initialRentalReportData.loanDetails,
        interestRate: newValue as Percentage,
      },
    });
  };

  const handleLoanTermChange = (newValue: ValueType): void => {
    props.updateInitialData({
      ...initialRentalReportData,
      loanDetails: {
        ...initialRentalReportData.loanDetails,
        loanTerm: newValue,
      },
    });
  };

  /**
   * Creates a slider container using Cloudscape’s Slider.
   */
  const makeSliderContainer = (
    sectionTitle: string,
    sliderLabel: string,
    currentSliderValue: number,
    dataDisplayConfig: IDataDisplayConfig,
    handleOnChange: Dispatch<SetStateAction<number>>,
    handleValueChange: (newValue: ValueType) => void
  ): JSX.Element => {
    if (dataDisplayConfig.min === undefined || dataDisplayConfig.max === undefined) {
      throw Error('Not min/max defined on sliders');
    }
    return (
      <div className="slider-container">
        <span className="analysis-form-label">
          <span>{sectionTitle}</span>
          <span className="slider-value">{sliderLabel}</span>
        </span>
        <Slider
          value={currentSliderValue}
          min={dataDisplayConfig.min}
          max={dataDisplayConfig.max}
          step={dataDisplayConfig.step}
          // Fix: Use the actual value passed in to properly format each tick.
          valueFormatter={(value: number): string => value.toString()}
          ariaLabel={sectionTitle}
          onChange={(
            event: NonCancelableCustomEvent<SliderProps.ChangeDetail>
          ): void => {
            const newValue: number = event.detail.value;
            handleOnChange(newValue);
            handleValueChange(newValue);
          }}
          tickMarks={true}
        />
      </div>
    );
  };  

  return (
    <Container className="calculator-container">
      <Header variant="h2">Test Different Scenarios</Header>
      <TextContent>
        <div className="graph-box">
          <div className="report-section">
            <div className="section-header">
              <h3 className="section-title">Rental income</h3>
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Rental Income: ',
                `${displayAsMoney(rentalIncome)}`,
                rentalIncome,
                rentalIncomeSliderProps,
                setRentalIncome,
                handleRentalIncomeChange
              )}
            </div>
          </div>
          <div className="report-section">
            <div className="section-header">
              <h3 className="section-title">Expenses</h3>
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Custom Expenses: ',
                `${displayAsMoney(otherExpenses)}`,
                otherExpenses,
                otherExpensesSliderProps,
                setOtherExpenses,
                handleOtherExpensesChange
              )}
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Vacancy: ',
                `${displayAsPercent(vacancy, 0)}`,
                vacancy,
                vacancySliderProps,
                setVacancy,
                handleVacancyChange
              )}
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Management Fees: ',
                `${displayAsPercent(managementFeePercent, 0)}`,
                managementFeePercent,
                managementFeesSliderProps,
                setManagementFeePercent,
                handleManagementFeesChange
              )}
            </div>
          </div>
          <div className="report-section">
            <h3 className="section-title">Total Cash Needed</h3>
            <div className="total-cash-value">
              {displayAsMoney(totalCashNeeded, 0, '$', false, true)}
            </div>
            <div className="section-header">
              <h3 className="section-title">Loan details</h3>
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Purchase price: ',
                `${displayAsMoney(purchasePrice)}`,
                purchasePrice,
                purchasePriceSliderProps,
                setPurchasePrice,
                handlePurchasePriceChange
              )}
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Loan To Value (LTV): ',
                `${displayAsPercent(loanToValuePercent, 0, false)}`,
                loanToValuePercent,
                loanToValuePercentSliderProps,
                setLoanToValuePercent,
                handleLoanPercentageChange
              )}
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Loan term: ',
                `${loanTerm} years`,
                loanTerm,
                loanTermSliderProps,
                setLoanTerm,
                handleLoanTermChange
              )}
            </div>
            <div className="section-body">
              {makeSliderContainer(
                'Interest rate: ',
                `${displayAsPercent(interestRate, 1)}`,
                interestRate,
                interestRateSliderProps,
                setInterestRate,
                handleInterestRateChange
              )}
            </div>
          </div>
        </div>
      </TextContent>
    </Container>
  );
};
