import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Button,
  Container,
  Header,
  Table,
  TextContent
} from '@cloudscape-design/components';

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
  getApplicableLoanTermTimePeriods
} from '@bpenwell/instantlyanalyze-module';

import { LoadingBar } from '../LoadingBar/LoadingBar';

/** 
 * --- STYLES ---
 * Includes your original .grid-container layout, 
 * plus the overrides for table padding/borders.
 */
const styles = `
/* Container styling (optional) */
.calculator-container {
  /* ... */
}

/* FORM / BUTTON GROUPS */
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.label {
  margin-bottom: 8px;
}
.bold-label {
  font-weight: bold;
}

/* LEGEND */
.legend-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.legend {
  display: flex;
  align-items: center;
  font-size: 1rem;
}
.legend-color-box {
  width: 20px;
  height: 20px;
  background-color: #8a8d00; /* highlight color for closest cell */
  border: 1px solid #303030;
  margin-right: 8px;
}

/* AXIS LABELS & TABLE LAYOUT */
.grid-container {
  display: grid;
  grid-template-columns: auto 1fr; /* side-header + table */
  grid-template-rows: auto 1fr;   /* top-header + table */
  gap: 0;
  margin-top: 1rem; /* Spacing above table */
}
.top-header {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
.side-header {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
.table-wrapper {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

/* Remove default border, spacing, etc. */
.awsui-table-container .awsui-table {
  border-collapse: collapse !important;
  border-spacing: 0 !important;
}
.awsui-table-container .awsui-table-td,
.awsui-table-container .awsui-table-th {
  border: none !important; 
}

/* 
 * Override hashed "body-cell-content" classes that add 
 * left/right padding. We set them to 0 so the background 
 * color can fill the entire cell horizontally.
 */
.awsui-table-container .awsui-table-td > [class*="body-cell-content"] {
  padding-inline-start: 0 !important;
  padding-inline-end: 0 !important;
  padding-block-start: 0 !important;
  padding-block-end: 0 !important;
}

/* (Optional) Give the final table a custom class 
   so we can easily select it for coloring. */
.sensitivity-table {
  width: 100%;
}
`;

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

interface ITableMetadata {
  rowIndex: number;
  colIndex: number;
}

const STEPS_PER_INPUT = 10;

export const CalculatorSensitivityTable: React.FC<IRentalCalculatorPageProps> = (props) => {
  // Inject our CSS styles once on mount
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const { initialRentalReportData } = props;
  const calculatorUtils = new CalculationUtils();
  const initialData: IRentalCalculatorData = structuredClone(initialRentalReportData);

  const [selectedInputs, setSelectedInputs] = useState<InputOption[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<OutputOption | null>(null);
  const [generatedTable, setGeneratedTable] = useState<(string | number)[][]>([]);
  const [isTableCleared, setIsTableCleared] = useState(false);
  const [tableData, setTableData] = useState<ITableEntry[]>([]);
  const [initialDataClone] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Numeric values for color gradient
  const [tableValueArray, setTableValueArray] = useState<number[][]>([]);
  const [tableMinValue, setTableMinValue] = useState(Infinity);
  const [tableMaxValue, setTableMaxValue] = useState(-Infinity);

  // Closest cell to current configuration
  const [closestCellCoords, setClosestCellCoords] = useState<ITableMetadata>({ rowIndex: -1, colIndex: -1 });

  const resetTable = () => {
    setGeneratedTable([]);
    setLoading(false);
    setTableValueArray([]);
    setTableMinValue(Infinity);
    setTableMaxValue(-Infinity);
    setClosestCellCoords({ rowIndex: -1, colIndex: -1 });
  };

  // If the underlying report data changes, clear the table
  useEffect(() => {
    if (generatedTable.length > 0) {
      setIsTableCleared(true);
      resetTable();
    }
  }, [initialRentalReportData]);

  const handleInputChange = (input: InputOption) => {
    const newSelectedInputs = selectedInputs.includes(input)
      ? selectedInputs.filter((i) => i !== input)
      : [...selectedInputs, input];
    setSelectedInputs(newSelectedInputs);
  };

  const handleOutputChange = (output: OutputOption) => {
    setSelectedOutput(selectedOutput === output ? null : output);
  };

  const handleGenerateTable = () => {
    if (selectedInputs.length !== 2 || selectedOutput === null) {
      alert('Please select exactly 2 input variables and 1 output variable.');
      return;
    }
    resetTable();
    setIsTableCleared(false);
    setLoading(true);
    // Slight timeout to let the UI show loading
    setTimeout(generateTable, 50);
  };

  const generateTable = () => {
    const newTableData = formatTableInputData(initialDataClone, selectedInputs);
    setTableData(newTableData);

    const table: (string | number)[][] = [];
    let localTableValueArray: number[][] = [];
    let localTableMinValue = Infinity;
    let localTableMaxValue = -Infinity;
    let localClosestCellCoords: ITableMetadata = { rowIndex: -1, colIndex: -1 };
    let closestRowDistance = Infinity;
    let closestColDistance = Infinity;

    const tableColumnData = newTableData[0]; // columns
    const tableRowData = newTableData[1];    // rows

    const initialColumnValue = calculatorUtils.getDataByDataClassifier(
      initialDataClone,
      tableColumnData.displayFormat.dataClassifier
    );
    const initialRowValue = calculatorUtils.getDataByDataClassifier(
      initialDataClone,
      tableRowData.displayFormat.dataClassifier
    );

    // Build the header row
    const topRow = [selectedOutput as string].concat(
      tableColumnData.data.map((value) =>
        getDisplayByDataClassifier(value, tableColumnData.displayFormat.dataClassifier)
      )
    );
    // localTableValueArray[0] can be an empty row for the header
    localTableValueArray.push([]);
    table.push(topRow);

    // Fill data rows
    tableRowData.data.forEach((rowInputData, rowIndex) => {
      const rowDisplayString = getDisplayByDataClassifier(
        rowInputData,
        tableRowData.displayFormat.dataClassifier);
      const rowCells: (string | number)[] = [rowDisplayString];
      let localRowValues: number[] = [];

      tableColumnData.data.forEach((columnInputData, colIndex) => {
        const hypotheticalReportData = calculatorUtils.calculateFullLoanTermRentalReportDataWithSensitivityData(
          initialDataClone,
          columnInputData,
          tableColumnData.displayFormat.dataClassifier,
          rowInputData,
          tableRowData.displayFormat.dataClassifier
        );
        const hypotheticalMetric = calculatorUtils.calculateBusinessMetricOnFullLoanTermRentalReportData(
          hypotheticalReportData,
          selectedOutput as DataClassifier
        );

        const cellValue = Number(hypotheticalMetric);
        localRowValues.push(cellValue);
        rowCells.push(getDisplayByDataClassifier(cellValue, selectedOutput as DataClassifier));

        // Track closest cell
        const rowDistance = Math.abs(rowInputData - initialRowValue);
        const colDistance = Math.abs(columnInputData - initialColumnValue);
        if (rowDistance < closestRowDistance) {
          closestRowDistance = rowDistance;
          localClosestCellCoords.rowIndex = rowIndex + 1; // offset for header
        }
        if (colDistance < closestColDistance) {
          closestColDistance = colDistance;
          localClosestCellCoords.colIndex = colIndex + 1; // offset for header
        }
      });

      localTableValueArray.push(localRowValues);
      localTableMinValue = Math.min(localTableMinValue, ...localRowValues);
      localTableMaxValue = Math.max(localTableMaxValue, ...localRowValues);
      table.push(rowCells);
    });

    setClosestCellCoords(localClosestCellCoords);
    setTableMinValue(localTableMinValue);
    setTableMaxValue(localTableMaxValue);
    setTableValueArray(localTableValueArray);
    setGeneratedTable(table);
    setLoading(false);
  };

  const populateTableDataByRange = (
    initialData: IRentalCalculatorData,
    displayConfig: IDataDisplayConfig
  ): number[] => {
    if (displayConfig.max === undefined || displayConfig.min === undefined) {
      throw new Error('Invalid display configuration. Max and min must be provided.');
    }
    if (STEPS_PER_INPUT % 2 === 1) {
      throw new Error('STEPS_PER_INPUT must be an even number so current value is in the middle.');
    }

    const data: number[] = [];
    if (displayConfig.dataClassifier === DataClassifier.LoanTerm) {
      // e.g. 15-year, 30-year
      getApplicableLoanTermTimePeriods(initialData).forEach((timePeriod) => data.push(timePeriod));
    } else {
      const stepSize = (displayConfig.max - displayConfig.min) / STEPS_PER_INPUT;
      for (let i = 0; i < STEPS_PER_INPUT; i++) {
        data.push(displayConfig.min + i * stepSize);
      }
    }
    return data;
  };

  const formatTableInputData = (initialData: IRentalCalculatorData, selectedInputs: string[]): ITableEntry[] => {
    return selectedInputs.map((input) => {
      let displayConfig: IDataDisplayConfig;
      switch (input) {
        case 'Rental Income':
          displayConfig = getRentalIncomeDisplayConfig(
            Number(initialData.rentalIncome.grossMonthlyIncome.toFixed(0))
          );
          break;
        case 'Custom Expenses':
          displayConfig = getOtherExpensesDisplayConfig(
            Number(initialData.expenseDetails.other.toFixed(0))
          );
          break;
        case 'Vacancy':
          displayConfig = getVacancyDisplayConfig(initialData.expenseDetails.vacancyPercent, true);
          break;
        case 'Purchase Price':
          displayConfig = getPurchasePriceDisplayConfig(
            Number(initialData.purchaseDetails.purchasePrice.toFixed(0))
          );
          break;
        case 'Management Fees':
          displayConfig = getManagementFeesDisplayConfig(
            initialData.expenseDetails.managementFeePercent,
            false
          );
          break;
        case 'Loan To Value %':
          displayConfig = getLoanToValuePercentDisplayConfig(
            calculatorUtils.calculateLoanPercentage(props.currentYearData)
          );
          break;
        case 'Loan Term':
          displayConfig = getLoanTermDisplayConfig(initialData.loanDetails.loanTerm);
          break;
        case 'Interest Rate':
          displayConfig = getInterestRateDisplayConfig(initialData.loanDetails.interestRate, true);
          break;
        default:
          throw new Error(`Invalid input option: ${input}`);
      }
      return {
        data: populateTableDataByRange(initialData, displayConfig),
        displayFormat: displayConfig,
      };
    });
  };

  // Build items/columns for the Cloudscape Table, but do NOT color them here
  // (we'll color via the old "colorTable" function in a useEffect).
  const cloudscapeTableData = useMemo(() => {
    if (generatedTable.length === 0 || tableValueArray.length === 0) {
      return { items: [], columns: [], tableHeader: '' };
    }

    const headerRow = generatedTable[0];
    const dataRows = generatedTable.slice(1);

    // Build items
    const items = dataRows.map((row, rowIndex) => {
      const item: Record<string, any> = { __rowIndex: rowIndex };
      row.forEach((cell, colIndex) => {
        // row label
        if (colIndex === 0) {
          item[`col${colIndex}`] = cell;
        } else {
          const rawValue = tableValueArray[rowIndex][colIndex - 1];
          item[`col${colIndex}`] = {
            display: cell,
            value: rawValue
          };
        }
      });
      return item;
    });

    // Build columns
    const columns = headerRow.map((header, colIndex) => {
      if (colIndex === 0) {
        return {
          id: `col${colIndex}`,
          header: '', // empty header for row labels
          minWidth: 100,
          cell: (item: any) => item[`col${colIndex}`]
        };
      } else {
        // We won't color here. We'll just display the text.
        return {
          id: `col${colIndex}`,
          header,
          minWidth: 100,
          cell: (item: any) => {
            const cellData = item[`col${colIndex}`];
            if (!cellData) return null;
            return <div style={{ textAlign: 'center', padding: '8px', color: 'white' }}>
              {cellData.display}
            </div>;
          }
        };
      }
    });

    // The first cell in the header row is our table title
    const tableHeader = String(headerRow[0]);

    return {
      tableHeader,
      items,
      columns
    };
  }, [
    generatedTable,
    tableValueArray
  ]);

  /**
   * -- The old colorTable logic, using DOM queries --
   * We replicate your exact code, but we apply it after
   * the Cloudscape table has rendered. 
   */
  const colorTable = useCallback(() => {
    const tableRows = document.querySelectorAll('.sensitivity-table table tr');
    if (!tableRows.length) return;

    tableRows.forEach((tr, rowIndex) => {
      const cells = tr.querySelectorAll('td');
      cells.forEach((cell, colIndex) => {
        // Skip the first column (labels)
        if (colIndex !== 0) {
          if (
            rowIndex === closestCellCoords.rowIndex && 
            colIndex === closestCellCoords.colIndex
          ) {
            // highlight
            (cell as HTMLElement).style.backgroundColor = '#8a8d00';
          } else {
            // gradient
            const value = tableValueArray[rowIndex][colIndex - 1];
            let ratio: number;
            const difference = tableMaxValue - tableMinValue;
            const epsilon = 1e-10;

            if (Math.abs(difference) < epsilon) {
              ratio = 0.5; 
            } else {
              ratio = (value - tableMinValue) / difference;
            }

            ratio = Math.max(0, Math.min(1, ratio));

            const greenHex = '#004A00';
            const redHex = '#A40000';

            const red = Math.round(
              parseInt(redHex.slice(1, 3), 16) * (1 - ratio) +
              parseInt(greenHex.slice(1, 3), 16) * ratio
            );
            const green = Math.round(
              parseInt(redHex.slice(3, 5), 16) * (1 - ratio) +
              parseInt(greenHex.slice(3, 5), 16) * ratio
            );
            const blue = Math.round(
              parseInt(redHex.slice(5, 7), 16) * (1 - ratio) +
              parseInt(greenHex.slice(5, 7), 16) * ratio
            );

            (cell as HTMLElement).style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
            cell.classList.add('gradient-cell');
          }
        }
      });
    });
  }, [
    closestCellCoords,
    tableValueArray,
    tableMinValue,
    tableMaxValue
  ]);

  /**
   * After the table has rendered, we apply colorTable
   */
  useEffect(() => {
    // Only color if we have a table
    if (!loading && generatedTable.length > 0) {
      colorTable();
    }
  }, [loading, generatedTable, colorTable]);

  return (
    <Container className="calculator-container">
      <Header variant="h2" description='Select 2 input variables and 1 output to get started'>Sensitivity Analysis</Header>
      <TextContent>

        {/* INPUT VARIABLE SELECTION */}
        <div className="form-group">
          <label className="label bold-label">Select Input Variables:</label>
          <div className="button-group">
            {inputOptions.map((input) => (
              <Button
                key={input}
                onClick={() => handleInputChange(input)}
                disabled={selectedInputs.length >= 2 && !selectedInputs.includes(input)}
                variant={selectedInputs.includes(input) ? 'primary' : 'normal'}
              >
                {input}
              </Button>
            ))}
          </div>
        </div>

        {/* OUTPUT VARIABLE SELECTION */}
        <div className="form-group">
          <label className="label bold-label">Select Output Variables:</label>
          <div className="button-group">
            {outputOptions.map((output) => (
              <Button
                key={output}
                onClick={() => handleOutputChange(output)}
                disabled={selectedOutput !== null && selectedOutput !== output}
                variant={selectedOutput === output ? 'primary' : 'normal'}
              >
                {output}
              </Button>
            ))}
          </div>
        </div>

        {/* GENERATE TABLE BUTTON */}
        <Button variant="primary" onClick={handleGenerateTable}>
          Generate Table
        </Button>

        {isTableCleared && (
          <p className="form-group" style={{ marginTop: '1rem' }}>
            Table cleared due to report data updating.
          </p>
        )}

        {/* TABLE OR LOADING BAR */}
        {loading ? (
          <div style={{ marginTop: '1rem' }}>
            <LoadingBar />
          </div>
        ) : (
          generatedTable.length > 0 && (
            <div className="grid-container">
              {/* Top axis label (column axis) */}
              <div className="top-header">
                {tableData[0]?.displayFormat.label /* e.g. "Vacancy" */}
              </div>

              {/* Side axis label (row axis) */}
              <div className="side-header">
                {tableData[1]?.displayFormat.label /* e.g. "Rental Income" */}
              </div>

              {/* The table itself. 
                  We'll wrap it in a div with className="sensitivity-table"
                  so we can do "querySelectorAll('.sensitivity-table table tr')".
               */}
              <div className="table-wrapper sensitivity-table">
                <Table
                  items={cloudscapeTableData.items}
                  columnDefinitions={cloudscapeTableData.columns}
                  variant="container"
                  contentDensity="compact"
                  header={<Header variant="h2">{cloudscapeTableData.tableHeader}</Header>}
                />
              </div>
            </div>
          )
        )}

        {/* OPTIONAL LEGEND */}
        {generatedTable.length > 0 && !loading && (
          <div className="legend-container">
            <div className="legend">
              <div className="legend-color-box"></div>
              <span>Closest Report Configuration</span>
            </div>
          </div>
        )}

      </TextContent>
    </Container>
  );
};
