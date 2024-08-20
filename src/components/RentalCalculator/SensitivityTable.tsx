import React, { useState } from 'react';
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
    getDisplayByValueType,
} from '@bpenwell/rei-module';
import { SelectableButton } from '../Button/SelectableButton';

const inputOptions = [
    'Rental Income',
    'Custom Expenses',
    'Vacancy',
    'Purchase Price',
    'Management Fees',
    'Loan To Value %',
    'Loan Term',
    'Interest Rate',
] as const;

const outputOptions = ['CoC ROI', '5-year annualized return'] as const;

type InputOption = typeof inputOptions[number];
type OutputOption = typeof outputOptions[number];

interface ITableEntry {
    data: number[];
    displayFormat: IDataDisplayConfig;
}

const STEPS_PER_INPUT = 10;

export const SensitivityTable: React.FC<IRentalCalculatorPageProps> = (props) => {
    const calculatorUtils = new CalculationUtils();
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

        const tableData = formatTableInputData(selectedInputs);
        setTableData(tableData);

        console.log("Table Data:", tableData); // Debugging statement to inspect tableData

        const table: (string | number)[][] = [];

        // Add the top row data for the range of input data
        const topRow = [selectedOutput as string].concat(tableData[0].data.map((value, index) => {
            const displayValue = getDisplayByValueType(value, tableData[0].displayFormat.valueType);
            console.log(`Top Row Value ${index}:`, displayValue); // Debugging statement to inspect each value in the top row
            return displayValue;
        }));
        table.push(topRow);

        // Add rows for the side header and calculation placeholders
        for (let i = 0; i < tableData[1].data.length; i++) {
            const row = [
                getDisplayByValueType(tableData[1].data[i], tableData[1].displayFormat.valueType),
                ...tableData[0].data.map(() => 0), // Placeholder for calculation
            ];
            table.push(row);
        }

        console.log("Generated Table:", table); // Debugging statement to inspect the final generated table
        setGeneratedTable(table);
    };

    const populateTableDataByRange = (displayConfig: IDataDisplayConfig): number[] => {
        if (displayConfig.max === undefined || displayConfig.min === undefined) {
            throw new Error(`Invalid display configuration. Max and min values must be provided.`);
        }

        const stepSize = (displayConfig.max - displayConfig.min) / STEPS_PER_INPUT;
        const data: number[] = [];
        for (let i = 0; i < STEPS_PER_INPUT; i++) {
            data.push(displayConfig.min + i * stepSize);
        }
        return data;
    };

    const formatTableInputData = (selectedInputs: string[]): ITableEntry[] => {
        const formattedData: ITableEntry[] = [];
        selectedInputs.forEach((input) => {
            let data: ITableEntry;
            let displayConfig: IDataDisplayConfig;
            switch (input) {
                case 'Rental Income':
                    displayConfig = getRentalIncomeDisplayConfig(Number(props.fullLoanTermRentalReportData[0].rentalIncome.grossMonthlyIncome.toFixed(0)));
                    break;
                case 'Custom Expenses':
                    displayConfig = getOtherExpensesDisplayConfig(Number(props.fullLoanTermRentalReportData[0].expenseDetails.other.toFixed(0)));
                    break;
                case 'Vacancy':
                    displayConfig = getVacancyDisplayConfig(calculatorUtils.calculateVacancyPercentage(props.currentYearData));
                    break;
                case 'Purchase Price':
                    displayConfig = getPurchasePriceDisplayConfig(Number(props.fullLoanTermRentalReportData[0].purchaseDetails.purchasePrice.toFixed(0)));
                    break;
                case 'Management Fees':
                    displayConfig = getManagementFeesDisplayConfig(Number(props.fullLoanTermRentalReportData[0].expenseDetails.managementFees.toFixed(0)));
                    break;
                case 'Loan To Value %':
                    displayConfig = getLoanToValuePercentDisplayConfig(calculatorUtils.calculateLoanPercentage(props.currentYearData));
                    break;
                case 'Loan Term':
                    displayConfig = getLoanTermDisplayConfig(props.fullLoanTermRentalReportData[0].loanDetails.loanTerm);
                    break;
                case 'Interest Rate':
                    displayConfig = getInterestRateDisplayConfig(props.fullLoanTermRentalReportData[0].loanDetails.interestRate);
                    break;
                default:
                    throw new Error(`Invalid input option: ${input}`);
            }
            data = {
                data: populateTableDataByRange(displayConfig),
                displayFormat: displayConfig,
            };
            formattedData.push(data);
        });
        return formattedData;
    };

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