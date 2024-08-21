import React, { useEffect, useMemo, useState } from 'react';
import './SensitivityTable.css';
import { IRentalCalculatorPageProps } from '../../interfaces';
import {
    CalculationUtils,
    getInterestRateDisplayConfig,
    getLoanTermDisplayConfig,
    getLoanToValuePercentDisplayConfig,
    getManagementFeesDisplayConfig,
    getOtherExpensesDisplayConfig,
    getPurchasePriceDisplayConfig,
    getRentalIncomeDisplayConfig,
    getVacancyDisplayConfig,
    IDataDisplayConfig,
    getDisplayByDataClassifier,
    IRentalCalculatorData,
    DataClassifier,
    printObjectFields,
} from '@bpenwell/rei-module';
import { SelectableButton } from '../Button/SelectableButton';

const inputOptions: DataClassifier[] = [
    DataClassifier.RentalIncome,
    DataClassifier.CustomExpenses,
    DataClassifier.Vacancy,
    DataClassifier.PurchasePrice,
    DataClassifier.ManagementFees,
    DataClassifier.LoanToValuePercent,
    DataClassifier.LoanTerm,
    DataClassifier.InterestRate,
];

const outputOptions: DataClassifier[] = [
    DataClassifier.CashOnCashReturnOnInvestment,
    DataClassifier.FiveYearAnnualizedReturn
];

type InputOption = typeof inputOptions[number];
type OutputOption = typeof outputOptions[number];

interface ITableEntry {
    data: number[];
    displayFormat: IDataDisplayConfig;
}

const STEPS_PER_INPUT = 10;

export const SensitivityTable: React.FC<IRentalCalculatorPageProps> = (props) => {
    const { initialRentalReportData, fullLoanTermRentalReportData } = props;
    const calculatorUtils = new CalculationUtils();
    const initialData: IRentalCalculatorData = structuredClone(initialRentalReportData);
    const [selectedInputs, setSelectedInputs] = useState<InputOption[]>([]);
    const [selectedOutput, setSelectedOutput] = useState<OutputOption | null>(null);
    const [generatedTable, setGeneratedTable] = useState<(string | number)[][]>([]);
    const [tableData, setTableData] = useState<ITableEntry[]>([]);
    const [initialDataClone, setInitialDataClone] = useState(initialData);

    useEffect(() => {
        console.debug('[DEBUG][USE_EFFECT] initialRentalReportData updating!');
        console.debug(initialDataClone.expenseDetails.vacancy);
        console.debug(initialDataClone.expenseDetails.vacancyPercent);
    },[initialDataClone]);

    const handleInputChange = (input: InputOption) => {
        const newSelectedInputs = selectedInputs.includes(input)
            ? selectedInputs.filter((i) => i !== input)
            : [...selectedInputs, input];
        setSelectedInputs(newSelectedInputs);
    };

    const handleOutputChange = (output: OutputOption) => {
        setSelectedOutput(selectedOutput === output ? null : output);
    };
    
    const generateTable = () => {
        if (selectedInputs.length !== 2 || selectedOutput === null) {
            alert('Please select exactly 2 input variables and 1 output variable.');
            return;
        }
    
        const tableData = formatTableInputData(initialDataClone, selectedInputs);
        setTableData(tableData);
    
        //Contains the table display values
        const table: (string | number)[][] = [];
        //Contains the table numerical values
        let rowValueArray: number[] = [];
        const tableValueArray: (number)[][] = [];

        const tableColumnData = tableData[0];
        const tableRowData = tableData[1];
        const outputOption = outputOptions[0];
    
        const topRow = [selectedOutput as string].concat(
            tableColumnData.data.map((value) => {
                rowValueArray.push(value);
                return getDisplayByDataClassifier(value, tableColumnData.displayFormat.dataClassifier);
            })
        );
        tableValueArray.push(rowValueArray);
        table.push(topRow);
    
        tableRowData.data.forEach((rowInputData, rowIndex) => {
            const displayString = getDisplayByDataClassifier(tableRowData.data[rowIndex], tableRowData.displayFormat.dataClassifier);
            const row: (string | number)[] = [displayString];
            rowValueArray = [];
    
            tableColumnData.data.forEach((columnInputData, colIndex) => {
                const hypotheticalReportData = calculatorUtils.calculateFullLoanTermRentalReportDataWithSensitivityData(
                    initialDataClone,
                    columnInputData,
                    tableColumnData.displayFormat.dataClassifier,
                    rowInputData,
                    tableRowData.displayFormat.dataClassifier
                );
    
                const hypotheticalBusinessMetric = calculatorUtils.calculateBusinessMetricOnFullLoanTermRentalReportData(hypotheticalReportData, selectedOutput);
    
                const initialColumnValue = calculatorUtils.getDataByDataClassifier(initialDataClone, tableColumnData.displayFormat.dataClassifier);
                const initialRowValue = calculatorUtils.getDataByDataClassifier(initialDataClone, tableRowData.displayFormat.dataClassifier);
    
                let cellValue;
                if (initialColumnValue === columnInputData && initialRowValue === rowInputData) {
                    const fullLoanTermRentalReportDataBusinessMetric = calculatorUtils.calculateBusinessMetricOnFullLoanTermRentalReportData(fullLoanTermRentalReportData, selectedOutput);
                    cellValue = fullLoanTermRentalReportDataBusinessMetric;
                } else {
                    cellValue = hypotheticalBusinessMetric;
                }
                rowValueArray.push(Number(cellValue));  // Add to the array for gradient calculation
                row.push(getDisplayByDataClassifier(cellValue, outputOption));
            });
            tableValueArray.push(rowValueArray);
            table.push(row);
        });
    
        // Calculate min and max values for gradient
        const minValue = Math.min(...rowValueArray);
        const maxValue = Math.max(...rowValueArray);
    
        setGeneratedTable(table);
    
        // Apply gradient colors based on the values
        setTimeout(() => {
            const tableRows = document.querySelectorAll('.sensitivity-table tr');
            tableRows.forEach((tr, rowIndex) => {
                const cells = tr.querySelectorAll('td');
                cells.forEach((cell, colIndex) => {
                    if (rowIndex != 0 && colIndex != 0) {
                        const value = tableValueArray[rowIndex - 1][colIndex - 1];
                        const ratio = (value - minValue) / (maxValue - minValue);
                        const green = Math.round(255 * ratio);
                        const red = 255 - green;
                        cell.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
                        cell.classList.add('gradient-cell');
                    }
                });
            });
        }, 0);
    };
        
    const populateTableDataByRange = (initialData: IRentalCalculatorData, displayConfig: IDataDisplayConfig): number[] => {
        if (displayConfig.max === undefined || displayConfig.min === undefined) {
            throw new Error(`Invalid display configuration. Max and min values must be provided.`);
        }

        if (STEPS_PER_INPUT % 2 === 1) {
            throw new Error(`Invalid step size for generating data. Step size must be an odd number to fit current initial data as an entry.`);
        }
        
        const stepSize = (displayConfig.max - displayConfig.min) / STEPS_PER_INPUT;
        const data: number[] = [];
        for (let i = 0; i < STEPS_PER_INPUT; i++) {
            const nextValue = displayConfig.min + i * stepSize;
            if (i === (STEPS_PER_INPUT/2)) {
                console.debug(`[DEBUG] Step size`);
                const currentDataEntry = calculatorUtils.getDataByDataClassifier(initialData, displayConfig.dataClassifier);

                //Inject current initialData data into table
                data.push(currentDataEntry);
            }
            else {
                data.push(nextValue);
            }
        }
        return data;
    };

    const formatTableInputData = (initialData: IRentalCalculatorData, selectedInputs: string[]): ITableEntry[] => {
        const formattedData: ITableEntry[] = [];
        selectedInputs.forEach((input) => {
            let data: ITableEntry;
            let displayConfig: IDataDisplayConfig;
            switch (input) {
                case 'Rental Income':
                    displayConfig = getRentalIncomeDisplayConfig(Number(initialData.rentalIncome.grossMonthlyIncome.toFixed(0)));
                    break;
                case 'Custom Expenses':
                    displayConfig = getOtherExpensesDisplayConfig(Number(initialData.expenseDetails.other.toFixed(0)));
                    break;
                case 'Vacancy':
                    displayConfig = getVacancyDisplayConfig(initialData.expenseDetails.vacancyPercent);
                    break;
                case 'Purchase Price':
                    displayConfig = getPurchasePriceDisplayConfig(Number(initialData.purchaseDetails.purchasePrice.toFixed(0)));
                    break;
                case 'Management Fees':
                    displayConfig = getManagementFeesDisplayConfig(initialData.expenseDetails.managementFees);
                    break;
                case 'Loan To Value %':
                    displayConfig = getLoanToValuePercentDisplayConfig(calculatorUtils.calculateLoanPercentage(props.currentYearData));
                    break;
                case 'Loan Term':
                    displayConfig = getLoanTermDisplayConfig(initialData.loanDetails.loanTerm);
                    break;
                case 'Interest Rate':
                    displayConfig = getInterestRateDisplayConfig(initialData.loanDetails.interestRate);
                    break;
                default:
                    throw new Error(`Invalid input option: ${input}`);
            }
            data = {
                data: populateTableDataByRange(initialData, displayConfig),
                displayFormat: displayConfig,
            };
            formattedData.push(data);
        });
        return formattedData;
    };

    console.debug(`[DEBUG][render] ultra-before grossMonthlyIncome=${initialData.rentalIncome.grossMonthlyIncome}`);
    console.debug(`[DEBUG][render] ultra-before vacancy=${initialData.expenseDetails.vacancy}`);
    console.debug(`[DEBUG][render] ultra-before vacancyPercent=${initialData.expenseDetails.vacancyPercent}`);
    
    return (
        <div className="sensitivity-table-container">
            <h2 className="header">Sensitivity Table</h2>
            <div className="form-group">
                <label className="label bold-label">Select Input Variables:</label>
                <div className="button-group">
                    {inputOptions.map((input) => (
                    <SelectableButton
                        key={input}
                        label={input}
                        isSelected={selectedInputs.includes(input)}
                        onClick={() => handleInputChange(input)}
                        isDisabled={selectedInputs.length >= 2 && !selectedInputs.includes(input)}
                        className="selectable-button"
                    />
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label className="label bold-label">Select Output Variables:</label>
                <div className="button-group">
                    {outputOptions.map((output) => (
                    <SelectableButton
                        key={output}
                        label={output}
                        isSelected={selectedOutput === output}
                        onClick={() => handleOutputChange(output)}
                        isDisabled={selectedOutput !== null && selectedOutput !== output}
                        className="selectable-button"
                    />
                    ))}
                </div>
            </div>
            <button className="submit-button" onClick={generateTable}>
                Generate Table
            </button>

            {generatedTable.length > 0 && (
                <div className="grid-container">
                    <div className="top-header">
                        {tableData[0]?.displayFormat.label}
                    </div>
                    <div className="side-header">
                        {tableData[1]?.displayFormat.label}
                    </div>
                    <div className="table-wrapper">
                        <table className="sensitivity-table">
                            <tbody>
                                {generatedTable.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className={rowIndex === 0 || cellIndex === 0 ? 'bold-cell' : ''}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};