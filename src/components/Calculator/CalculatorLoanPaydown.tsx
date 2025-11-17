import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import {
  CalculationUtils,
  displayAsMoney,
  displayAsPercent,
  TimelineEventType,
  IMonthlyCalculationData,
} from '@bpenwell/instantlyanalyze-module';

import {
  Container,
  Header,
  SpaceBetween,
  Box,
  LineChart,
  Table
} from '@cloudscape-design/components';
import { TIME_PERIODS } from '@bpenwell/instantlyanalyze-module';
// Adjust these imports/paths to match your code base:
import { CHART_COLORS } from '../../constants';
import './CalculatorLoanPaydown.css';

// Example component
export const CalculatorLoanPaydown: React.FC<IRentalCalculatorPageProps> = (props) => {
  const calculationUtils = new CalculationUtils();
  const { initialRentalReportData, fullLoanTermRentalReportData } = props;

  // Check for timeline events and determine loan lifecycle
  let maxYear = initialRentalReportData.loanDetails.loanTerm;
  let refinanceYear: number | null = null;
  let saleYear: number | null = null;

  if (initialRentalReportData.timelineDetails && initialRentalReportData.timelineDetails.events) {
    const refinanceEvent = initialRentalReportData.timelineDetails.events.find(
      e => e.type === TimelineEventType.REFINANCE
    );
    if (refinanceEvent) {
      refinanceYear = Math.floor(refinanceEvent.month / 12);
    }

    const saleEvent = initialRentalReportData.timelineDetails.events.find(
      e => e.type === TimelineEventType.SALE
    );
    if (saleEvent) {
      saleYear = Math.floor(saleEvent.month / 12);
      maxYear = Math.min(maxYear, saleYear);
    }
  }

  // For BRRRR deals with refinance, adjust maxYear to account for refinance timing
  if (refinanceYear !== null) {
    const yearsAfterRefinance = maxYear - refinanceYear;
    const refinanceLoanTerm = initialRentalReportData.loanDetails.loanTerm;
    maxYear = Math.min(maxYear, refinanceYear + refinanceLoanTerm);
  }

  // Filter applicable time periods based on the loan term and sale event
  const applicableLoanTermTimePeriods = TIME_PERIODS.filter(
    (period) => period <= maxYear
  );

  const loanAmount = (year: number): number =>
    calculationUtils.calculateRemainingLoanAmount(fullLoanTermRentalReportData[year], year);

  // Prepare chart series for the LineChart
  const loanBalanceSeries = {
    type: 'line' as const,
    title: 'Loan Balance',
    data: applicableLoanTermTimePeriods.map((year) => ({
        x: year, // use a number instead of a string
        y: Number(loanAmount(year).toFixed(2)),
    })),
    color: CHART_COLORS.complementaryRed,
  };

  const equitySeries = {
    type: 'line' as const,
    title: 'Equity',
    data: applicableLoanTermTimePeriods.map((year) => {
      const propertyValue =
        fullLoanTermRentalReportData[year]?.purchaseDetails.reportPropertyValue || 0;
      return { x: year, y: Number((propertyValue - loanAmount(year)).toFixed(2)) };
    }),
    color: CHART_COLORS.variableExpensesOrange,
  };

  const propertyValueSeries = {
    type: 'line' as const,
    title: 'Property Value',
    data: applicableLoanTermTimePeriods.map((year) => ({
      x: year,
      y: Number((fullLoanTermRentalReportData[year]?.purchaseDetails.reportPropertyValue || 0).toFixed(2)),
    })),
    color: CHART_COLORS.mainGreen,
  };

  // Combine all lines into a single array
  const series = [loanBalanceSeries, equitySeries, propertyValueSeries];

  // Table data calculations
  const cashFlowData = applicableLoanTermTimePeriods.map((year: number) =>
    calculationUtils.calculateCashFlow(fullLoanTermRentalReportData[year])
  );
  const mortgagePaymentData = applicableLoanTermTimePeriods.map((year: number) =>
    calculationUtils.calculateMortgagePayment(fullLoanTermRentalReportData[year])
  );
  const beforeTaxEquityReversionData = applicableLoanTermTimePeriods.map((year: number) =>
    calculationUtils.calculateBeforeTaxEquityReversion([fullLoanTermRentalReportData[year]])
  );

  const getAnnualizedReturn = (year: number, includeSellExpenses: boolean): number => {
    if (year === 0) return 0;
    return calculationUtils.calculateAnnualizedReturn(
      fullLoanTermRentalReportData.slice(1, year + 1),
      includeSellExpenses
    );
  };

  const annualizedReturnDataBeforeSell = applicableLoanTermTimePeriods.map((year) =>
    getAnnualizedReturn(year, false)
  );
  const annualizedReturnDataAfterSell = applicableLoanTermTimePeriods.map((year) =>
    getAnnualizedReturn(year, true)
  );

  // Get monthly timeline data for event metrics
  const monthlyTimelineData: IMonthlyCalculationData[] = calculationUtils.calculateMonthlyTimelineData(initialRentalReportData);

  // Extract event metrics by year
  const refinanceCashoutByYear: number[] = applicableLoanTermTimePeriods.map(() => 0);
  const saleProceedsByYear: number[] = applicableLoanTermTimePeriods.map(() => 0);

  monthlyTimelineData.forEach((monthData) => {
    const yearIndex = Math.floor(monthData.month / 12);
    if (yearIndex < refinanceCashoutByYear.length) {
      if (monthData.refinanceCashout !== undefined) {
        refinanceCashoutByYear[yearIndex] = monthData.refinanceCashout;
      }
      if (monthData.saleProceeds !== undefined) {
        saleProceedsByYear[yearIndex] = monthData.saleProceeds;
      }
    }
  });

  // Build Cloudscape Table column definitions
  const columns = [
    {
      id: 'metric',
      header: '',
      cell: (item: any) => item.metric,
      width: 200,
    },
    ...applicableLoanTermTimePeriods.map((year, index) => {
      let headerLabel = index === 0 ? '-' : `Year ${year}`;

      // For BRRRR deals, add clarifying labels for refinance year
      if (refinanceYear !== null && year === refinanceYear) {
        headerLabel += ' (Refi)';
      }

      return {
        id: `year-${index}`,
        header: headerLabel,
        cell: (item: any) => item[`year-${index}`],
        align: 'center',
      };
    }),
  ];

  type TableRow = {
    metric: React.ReactNode;
    data: number[];
    formatter: (value: number, index: number) => React.ReactNode;
  };

  // Define each row in the table
  const rows: TableRow[] = [
    {
      metric: (
        <>
          <span
            className="color-box"
            style={{ backgroundColor: CHART_COLORS.mainGreen }}
          ></span>
          Property Value
        </>
      ),
      data: propertyValueSeries.data.map((d) => d.y),
      formatter: (value) => displayAsMoney(value, 0, '$', true),
    },
    {
      metric: (
        <>
          <span
            className="color-box"
            style={{ backgroundColor: CHART_COLORS.variableExpensesOrange }}
          ></span>
          Equity
        </>
      ),
      data: equitySeries.data.map((d) => d.y),
      formatter: (value) => displayAsMoney(value, 0, '$', true),
    },
    {
      metric: (
        <>
          <span
            className="color-box"
            style={{ backgroundColor: CHART_COLORS.complementaryRed }}
          ></span>
          Loan Balance
        </>
      ),
      data: loanBalanceSeries.data.map((d) => d.y),
      formatter: (value) => displayAsMoney(value, 0, '$', false, true),
    },
    {
      metric: 'Cash Flow',
      data: cashFlowData,
      formatter: (value) => displayAsMoney(value, 0, '$', false, true),
    },
    {
      metric: 'Mortgage Payment',
      data: mortgagePaymentData,
      formatter: (value) => displayAsMoney(value, 0, '$', true),
    },
    {
      metric: 'Before Tax Equity Reversion',
      data: beforeTaxEquityReversionData,
      formatter: (value) => displayAsMoney(value, 0, '$', true),
    },
    {
      metric: 'Annualized Return (if NOT sold)',
      data: annualizedReturnDataBeforeSell,
      formatter: (value, index) => (index === 0 ? '-' : displayAsPercent(value, 2, true)),
    },
    {
      metric: 'Annualized Return (if sold)',
      data: annualizedReturnDataAfterSell,
      formatter: (value, index) => (index === 0 ? '-' : displayAsPercent(value, 2, true)),
    },
  ];

  // Transform row data into the shape required by the Table
  const items = rows.map((row) => {
    const item: Record<string, React.ReactNode> = { metric: row.metric };
    row.data.forEach((val, index) => {
      item[`year-${index}`] = row.formatter(val, index);
    });
    return item;
  });

  return (
    <SpaceBetween direction="vertical" size="l">
      {/* Chart Section */}
      <Container header={<Header variant="h2" description='Understand your exit strategy'>Loan Paydown</Header>}>
        {/* Give the chart a fixed height */}
        <Box margin="l">
            <LineChart
                className="half-width-chart"
                series={series}
                ariaLabel="Loan Paydown Chart"
                hideFilter={true}
                xScaleType="linear"
                xDomain={[0, maxYear]}
            />
        </Box>
        <Table
          columnDefinitions={columns}
          items={items}
          variant="embedded"
          wrapLines
          stripedRows
          ariaLabels={{
            tableLabel: 'Paydown Details',
          }}
        />
      </Container>
    </SpaceBetween>
  );
};
