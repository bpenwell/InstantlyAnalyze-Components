import React, { useMemo, useState } from 'react';
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
    const { initialRentalReportData } = props;
    const calculatorUtils = new CalculationUtils();
    const initialData: IRentalCalculatorData = Object.assign(initialRentalReportData);
    const [selectedInputs, setSelectedInputs] = useState<InputOption[]>([]);
    const [selectedOutput, setSelectedOutput] = useState<OutputOption | null>(null);
    const [generatedTable, setGeneratedTable] = useState<(string | number)[][]>([]);
    const [tableData, setTableData] = useState<ITableEntry[]>([]);

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

        console.debug(`[DEBUG][generateTable] before grossMonthlyIncome=${initialData.rentalIncome.grossMonthlyIncome}`);
        console.debug(`[DEBUG][generateTable] before vacancy=${initialData.expenseDetails.vacancy}`);
        console.debug(`[DEBUG][generateTable] before vacancyPercent=${initialData.expenseDetails.vacancyPercent}`);
        
        const tableData = formatTableInputData(initialData, selectedInputs);
        setTableData(tableData);
    
        const table: (string | number)[][] = [];
        const tableColumnData = tableData[0];
        const tableRowData = tableData[1];
        const outputOption = outputOptions[0];
    
        const topRow = [selectedOutput as string].concat(
            tableColumnData.data.map((value, index) => getDisplayByDataClassifier(value, tableColumnData.displayFormat.dataClassifier))
        );
        table.push(topRow);
    
        tableRowData.data.forEach((rowInputData, rowIndex) => {
            const row: string[] = [
                getDisplayByDataClassifier(tableRowData.data[rowIndex], tableRowData.displayFormat.dataClassifier)
            ];

            console.debug(`[DEBUG][generateTable] grossMonthlyIncome=${initialData.rentalIncome.grossMonthlyIncome}`);
            console.debug(`[DEBUG][generateTable] vacancy=${initialData.expenseDetails.vacancy}`);
            console.debug(`[DEBUG][generateTable] vacancyPercent=${initialData.expenseDetails.vacancyPercent}`);
    
            tableColumnData.data.forEach((columnInputData, colIndex) => {
                const hypotheticalReportData = calculatorUtils.calculateFullLoanTermRentalReportDataWithSensitivityData(
                    initialData,
                    columnInputData,
                    tableColumnData.displayFormat.dataClassifier,
                    rowInputData,
                    tableRowData.displayFormat.dataClassifier
                );
    
                // Generate business metric for the hypothetical data
                const hypotheticalBusinessMetric = calculatorUtils.calculateBusinesMetricOnFullLoanTermRentalReportData(hypotheticalReportData, selectedOutput);
    
                // Compare the current data to the initial data; only skip if they're identical
                const initialColumnValue = calculatorUtils.getDataByDataClassifier(initialData, tableColumnData.displayFormat.dataClassifier);
                const initialRowValue = calculatorUtils.getDataByDataClassifier(initialData, tableRowData.displayFormat.dataClassifier);
    
                // Only skip the entry if both column and row data match the initial data
                if (initialColumnValue === columnInputData && initialRowValue === rowInputData) {
                    console.debug(`[DEBUG][generateTable] Skipping identical data at column ${colIndex} and row ${rowIndex}`);
                    console.debug(`[DEBUG][generateTable] initialColumnValue=${initialColumnValue}. columnInputData=${columnInputData}. initialRowValue=${initialRowValue}. rowInputData=${rowInputData}.`);
                    row.push('-'); // Insert a placeholder or skip the actual value
                } else {
                    row.push(getDisplayByDataClassifier(hypotheticalBusinessMetric, outputOption));
                }
            });
    
            table.push(row);
        });
    
        setGeneratedTable(table);
    };
    
    const populateTableDataByRange = (initialData: IRentalCalculatorData, displayConfig: IDataDisplayConfig): number[] => {
        if (displayConfig.max === undefined || displayConfig.min === undefined) {
            throw new Error(`Invalid display configuration. Max and min values must be provided.`);
        }

        if (STEPS_PER_INPUT % 2 === 1) {
            throw new Error(`Invalid step size for generating data. Step size must be an even number to fit current initial data as an entry.`);
        }
        
        const stepSize = (displayConfig.max - displayConfig.min) / STEPS_PER_INPUT;
        const data: number[] = [];
        for (let i = 0; i < STEPS_PER_INPUT; i++) {
            const nextValue = displayConfig.min + i * stepSize;
            if (i === (STEPS_PER_INPUT/2)) {
                const currentDataEntry = calculatorUtils.getDataByDataClassifier(initialData, displayConfig.dataClassifier);

                //Inject current initialData data into table
                data.push(currentDataEntry);
                
                //If this index's value is the same as the current data entry, do not double add it
                //In this case, the table size will be STEPS_PER_INPUT instead of STEPS_PER_INPUT + 1
                if (nextValue !== currentDataEntry) {
                    data.push(nextValue);
                }
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
            <div className="form-group">
                <label className="label bold-label">Select Output Variable:</label>
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