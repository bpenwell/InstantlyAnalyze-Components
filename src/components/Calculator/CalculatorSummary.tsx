// CalculatorSummary.tsx
import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import { CalculationUtils, displayAsMoney, displayAsPercent, IRentalCalculatorData, TimelineEventType, ITimelineEvent } from '@bpenwell/instantlyanalyze-module';
import {
  Container,
  Header,
  Box,
  ColumnLayout,
  SpaceBetween,
  TextContent,
} from '@cloudscape-design/components';
import { CloudscapeLineChart, ILineChartDataset, ILineChartProps, ITimelineMarker} from './../Charts/CloudscapeLineChart';
import './CalculatorSummary.css';

export interface ICalculatorSummary extends IRentalCalculatorPageProps {
  updateDataYear: (loanTermIndex: number) => void;
}

export const CalculatorSummary: React.FC<ICalculatorSummary> = (props: ICalculatorSummary) => {
  const calculationUtils = new CalculationUtils();
  const { fullLoanTermRentalReportData, updateDataYear, currentYearData, currentYear } = props;

  const handlePointClick = (index: number, value: number, label: string) => {
    const newYear: number = Number(label);
    updateDataYear(newYear);
  };

  const shouldDisplayChartTermYear = (termYear: number): boolean => {
    const overrideAcceptedYears = [0, 1, 2, 3, 4];
    const generalAcceptedYearMultiplier = 5;
    return (
      overrideAcceptedYears.includes(termYear) ||
      termYear % generalAcceptedYearMultiplier === 0
    );
  };

  const getSummaryChartInputs = (): ILineChartProps => {
    console.log('[CalculatorSummary] getSummaryChartInputs START');
    const incomeData: ILineChartDataset = {
      label: 'Rental Income',
      data: [],
      borderColor: '#004A00', // Main green
      backgroundColor: 'rgba(0, 74, 0, 0.75)', // Transparent green background
    };
    const expenseData: ILineChartDataset = {
      label: 'Expenses',
      data: [],
      borderColor: '#A40000', // Complementary red
      backgroundColor: 'rgba(164, 0, 0, 0.75)', // Transparent red background
    };
    const cashFlowData: ILineChartDataset = {
      label: 'Cash Flow',
      data: [],
      borderColor: '#000000', // Black for cash flow
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Transparent black background
    };

    const labels: string[] = [];
    const xValues: number[] = [];  // Store actual x-axis values

    // Use hybrid data: monthly for first 2 years, yearly thereafter
    const hybridData = calculationUtils.getHybridChartData(currentYearData);
    console.log(`[CalculatorSummary] Received ${hybridData.length} hybrid data points`);

    let pointsShown = 0;
    let pointsFiltered = 0;

    hybridData.forEach((dataPoint, index) => {
      // Filter logic: show every 3rd month for monthly data, filter yearly data by shouldDisplayChartTermYear
      const yearValue = Math.floor(dataPoint.x / 12);

      // For monthly data (months 0-23): show every 3rd month (0, 3, 6, 9, 12, 15, 18, 21, 24)
      // For yearly data (months 24+): use existing year filter
      const shouldShow = dataPoint.isMonthly
        ? (dataPoint.month !== undefined && dataPoint.month % 3 === 0)  // Show every 3rd month
        : shouldDisplayChartTermYear(yearValue);

      if (index < 3 || index >= hybridData.length - 3) {
        console.log(`[CalculatorSummary] Point ${index}:`, {
          x: dataPoint.x,
          isMonthly: dataPoint.isMonthly,
          shouldShow,
          income: dataPoint.income,
          expenses: dataPoint.expenses,
          cashFlow: dataPoint.cashFlow
        });
      }

      if (shouldShow) {
        pointsShown++;
        incomeData.data.push(dataPoint.income);
        expenseData.data.push(dataPoint.expenses);
        cashFlowData.data.push(dataPoint.cashFlow);
        xValues.push(dataPoint.x);  // Store the actual x-value

        // Create appropriate label based on granularity
        if (dataPoint.isMonthly && dataPoint.month !== undefined) {
          // Format as "Mo X" for monthly data
          labels.push(`Mo ${dataPoint.month}`);
        } else {
          // Format as "Yr X" for yearly data
          const yearForDisplay = Math.floor(dataPoint.x / 12);
          labels.push(`Yr ${yearForDisplay}`);
        }
      } else {
        pointsFiltered++;
      }
    });

    console.log(`[CalculatorSummary] Points shown: ${pointsShown}, Points filtered: ${pointsFiltered}`);

    // Create timeline markers from timeline events (if present)
    const timelineMarkers: ITimelineMarker[] = [];
    const timelineDetails = currentYearData.timelineDetails;

    if (timelineDetails && Array.isArray(timelineDetails.events)) {
      // Map of event types to colors
      const eventColors: Record<TimelineEventType, string> = {
        [TimelineEventType.PURCHASE]: '#0073BB',
        [TimelineEventType.REHAB_START]: '#8B4513',
        [TimelineEventType.REHAB_END]: '#228B22',
        [TimelineEventType.RENT_START]: '#00A000',
        [TimelineEventType.REFINANCE]: '#FF8C00',
        [TimelineEventType.SALE]: '#DC143C',
      };

      timelineDetails.events.forEach((event: ITimelineEvent) => {
        // Use month directly since our x-axis is in months
        const monthValue = event.month;

        // Only show markers for important events (skip Purchase since it's at 0)
        if (event.type !== TimelineEventType.PURCHASE && monthValue > 0) {
          timelineMarkers.push({
            x: monthValue, // Use month value directly for alignment
            label: event.type.replace(' ', '\n'), // Line break for better display
            color: eventColors[event.type] || '#FF8C00',
          });
        }
      });
    }

    console.log('[CalculatorSummary] Final chart data:', {
      labelsCount: labels.length,
      labels: labels,
      xValues: xValues,
      incomeDataPoints: incomeData.data.length,
      expenseDataPoints: expenseData.data.length,
      cashFlowDataPoints: cashFlowData.data.length,
      firstFewIncomeValues: incomeData.data.slice(0, 5),
      firstFewExpenseValues: expenseData.data.slice(0, 5),
      firstFewCashFlowValues: cashFlowData.data.slice(0, 5),
      timelineMarkersCount: timelineMarkers.length,
      timelineMarkers: timelineMarkers
    });

    return {
      datasets: [incomeData, expenseData, cashFlowData],
      labels,
      xValues,  // Pass the actual x-axis values
      onPointClick: handlePointClick,
      timelineMarkers,
    };
  };

  const getEquityChartInputs = (): ILineChartProps => {
    console.log('[CalculatorSummary] getEquityChartInputs START');
    const equityData: ILineChartDataset = {
      label: 'Equity',
      data: [],
      borderColor: '#FF8C00', // Orange/gold color
      backgroundColor: 'rgba(255, 140, 0, 0.75)', // Transparent orange background
    };

    const labels: string[] = [];
    const xValues: number[] = [];  // Store actual x-axis values

    // Use hybrid data: monthly for first 2 years, yearly thereafter
    const hybridData = calculationUtils.getHybridChartData(currentYearData);
    //console.log(`[CalculatorSummary] Equity chart received ${hybridData.length} hybrid data points`);

    let pointsShown = 0;

    hybridData.forEach((dataPoint, index) => {
      // Debug log equity at key months BEFORE filtering
      const equity = dataPoint.propertyValue - dataPoint.loanBalance;
      if ((dataPoint.isMonthly && (dataPoint.month === 0 || dataPoint.month === 12 || dataPoint.month === 21)) ||
          (!dataPoint.isMonthly && dataPoint.x === 36)) {
        /*console.log(`[CalculatorSummary] Equity at ${dataPoint.isMonthly ? 'month' : 'year'} ${dataPoint.isMonthly ? dataPoint.month : dataPoint.x / 12}:`, {
          x: dataPoint.x,
          propertyValue: dataPoint.propertyValue,
          loanBalance: dataPoint.loanBalance,
          equity: equity,
          isMonthly: dataPoint.isMonthly,
          refinanceCashout: dataPoint.refinanceCashout
        });*/
      }

      // Filter logic: show every 3rd month for monthly data, filter yearly data by shouldDisplayChartTermYear
      const yearValue = Math.floor(dataPoint.x / 12);

      // For monthly data (months 0-23): show every 3rd month (0, 3, 6, 9, 12, 15, 18, 21, 24)
      // For yearly data (months 24+): use existing year filter
      const shouldShow = dataPoint.isMonthly
        ? (dataPoint.month !== undefined && dataPoint.month % 3 === 0)  // Show every 3rd month
        : shouldDisplayChartTermYear(yearValue);

      if (shouldShow) {
        pointsShown++;
        equityData.data.push(equity);
        xValues.push(dataPoint.x);  // Store the actual x-value

        // Create appropriate label based on granularity
        if (dataPoint.isMonthly && dataPoint.month !== undefined) {
          // Format as "Mo X" for monthly data
          labels.push(`Mo ${dataPoint.month}`);
        } else {
          // Format as "Yr X" for yearly data
          const yearForDisplay = Math.floor(dataPoint.x / 12);
          labels.push(`Yr ${yearForDisplay}`);
        }
      }
    });

    console.log(`[CalculatorSummary] Equity chart points shown: ${pointsShown}`);

    // Create timeline markers from timeline events (same as summary chart)
    const timelineMarkers: ITimelineMarker[] = [];
    const timelineDetails = currentYearData.timelineDetails;

    if (timelineDetails && Array.isArray(timelineDetails.events)) {
      // Map of event types to colors
      const eventColors: Record<TimelineEventType, string> = {
        [TimelineEventType.PURCHASE]: '#0073BB',
        [TimelineEventType.REHAB_START]: '#8B4513',
        [TimelineEventType.REHAB_END]: '#228B22',
        [TimelineEventType.RENT_START]: '#00A000',
        [TimelineEventType.REFINANCE]: '#FF8C00',
        [TimelineEventType.SALE]: '#DC143C',
      };

      timelineDetails.events.forEach((event: ITimelineEvent) => {
        // Use month directly since our x-axis is in months
        const monthValue = event.month;

        // Only show markers for important events (skip Purchase since it's at 0)
        if (event.type !== TimelineEventType.PURCHASE && monthValue > 0) {
          timelineMarkers.push({
            x: monthValue, // Use month value directly for alignment
            label: event.type.replace(' ', '\n'), // Line break for better display
            color: eventColors[event.type] || '#FF8C00',
          });
        }
      });
    }

    console.log('[CalculatorSummary] Equity chart data:', {
      labelsCount: labels.length,
      equityDataPoints: equityData.data.length,
      firstFewEquityValues: equityData.data.slice(0, 5),
      timelineMarkersCount: timelineMarkers.length,
    });

    return {
      datasets: [equityData],
      labels,
      xValues,  // Pass the actual x-axis values
      timelineMarkers,
    };
  };

  const summaryChartProps = getSummaryChartInputs();
  const equityChartProps = getEquityChartInputs();

  const income = calculationUtils.calculateRentalIncomePerMonth(currentYearData);
  const expenses = calculationUtils.calculateRentalTotalExpensePerMonth(currentYearData);
  const totalCashNeeded = calculationUtils.calculateTotalCashNeeded(currentYearData);

  // Get cash flow by phase (replaces single monthlyNetCashFlow)
  const cashFlowByPhase = calculationUtils.getCashFlowByPhase(currentYearData);

  // Get rehab budget if rehabbing
  const rehabBudget = currentYearData.strategyDetails.isRehabbingProperty && currentYearData.strategyDetails.rehabRepairCosts
    ? currentYearData.strategyDetails.rehabRepairCosts
    : undefined;

  // Get event metrics from timeline data
  const monthlyTimelineData = calculationUtils.calculateMonthlyTimelineData(currentYearData);
  const refinanceCashout = monthlyTimelineData.find(m => m.refinanceCashout !== undefined)?.refinanceCashout;
  const saleProceeds = monthlyTimelineData.find(m => m.saleProceeds !== undefined)?.saleProceeds;

  // Check if this is a BRRRR deal and calculate cash in deal after refinance
  const isBRRRR = currentYearData.strategyDetails.isRehabbingProperty && currentYearData.strategyDetails.isRefinancingProperty;
  const totalCashInDealAfterRefinance = isBRRRR
    ? calculationUtils.calculateTotalCashInDealAfterRefinance(currentYearData)
    : undefined;

  // Debug: Compare equity chart vs cash in deal calculation
  if (isBRRRR && refinanceCashout !== undefined && totalCashInDealAfterRefinance !== undefined) {
    console.log('[CalculatorSummary] BRRRR Deal Finance Comparison:', {
      totalCashNeeded: totalCashNeeded,
      refinanceCashout: refinanceCashout,
      calculatedCashInDeal: totalCashNeeded - refinanceCashout,
      displayedCashInDealAfterRefinance: totalCashInDealAfterRefinance,
      difference: (totalCashNeeded - refinanceCashout) - totalCashInDealAfterRefinance,
      note: 'If difference is non-zero, there may be closing costs or other fees not accounted for'
    });
  }

  const fiveYearOrLessYear =
    fullLoanTermRentalReportData.length >= 5 ? 5 : fullLoanTermRentalReportData.length;
  const tenYearOrLessYear =
    fullLoanTermRentalReportData.length >= 10 ? 10 : fullLoanTermRentalReportData.length;
  const fiveYearReturn = calculationUtils.calculateFiveYearAnnualizedReturn(fullLoanTermRentalReportData);
  const tenYearReturn = calculationUtils.calculateTenYearAnnualizedReturn(fullLoanTermRentalReportData);
  const mortgagePayment = displayAsMoney(
    calculationUtils.calculateMortgagePayment(currentYearData),
    1
  );

  return (
    <SpaceBetween direction="vertical" size="l">
      <Container /*header={<Header variant="h2">Cash Flow</Header>}*/>
        <SpaceBetween size="l">
          {/* Multi-Phase Net Cash Flow Display */}
          <Box>
            <TextContent>
              <Header variant='h3' info=' | Includes all budgeting for variable + fixed expenses'>
                Net Cash Flow
              </Header>
            </TextContent>
            <ColumnLayout columns={3} variant="text-grid">
              {cashFlowByPhase.atPurchase && (
                <Box>
                  <SpaceBetween size="xs">
                    <TextContent>
                      <h4>At Purchase</h4>
                    </TextContent>
                    <Box variant="strong" fontSize="display-l">
                      ${cashFlowByPhase.atPurchase.cashFlow.toFixed(1)} /mo
                    </Box>
                    <TextContent>
                      <Box fontSize="body-s" color="text-body-secondary">
                        CoC ROI: {cashFlowByPhase.atPurchase.cocROI.toFixed(2)}%
                      </Box>
                    </TextContent>
                  </SpaceBetween>
                </Box>
              )}
              {cashFlowByPhase.afterRehab && (
                <Box>
                  <SpaceBetween size="xs">
                    <TextContent>
                      <h4>After Rehab</h4>
                    </TextContent>
                    <Box variant="strong" fontSize="display-l">
                      ${cashFlowByPhase.afterRehab.cashFlow.toFixed(1)} /mo
                    </Box>
                    <TextContent>
                      <Box fontSize="body-s" color="text-body-secondary">
                        CoC ROI: {cashFlowByPhase.afterRehab.cocROI.toFixed(2)}%
                      </Box>
                    </TextContent>
                  </SpaceBetween>
                </Box>
              )}
              {cashFlowByPhase.afterRefinance && (
                <Box>
                  <SpaceBetween size="xs">
                    <TextContent>
                      <h4>After Refinance (Stabilized)</h4>
                    </TextContent>
                    <Box variant="strong" fontSize="display-l">
                      ${cashFlowByPhase.afterRefinance.cashFlow.toFixed(1)} /mo
                    </Box>
                    <TextContent>
                      <Box fontSize="body-s" color="text-body-secondary">
                        CoC ROI: {cashFlowByPhase.afterRefinance.cocROI.toFixed(2)}%
                      </Box>
                    </TextContent>
                  </SpaceBetween>
                </Box>
              )}
            </ColumnLayout>
          </Box>
          <div className="line-container">
            <CloudscapeLineChart {...summaryChartProps} useLabelBasedPositioning={true} />
          </div>
          <Box padding={{ top: 'xxxl' }} /> {/* Add padding under the chart */}
          {/* Need space under the chart for legend */}
          <SpaceBetween size="xl"/>
          <SpaceBetween size="s"/>

          {/* Equity Over Time Chart - Compact Version */}
          <div className="line-container" style={{ height: '100px', marginBottom: '100px' }}>
            <CloudscapeLineChart {...equityChartProps} useLabelBasedPositioning={true} height={100} yTitle="Equity" />
          </div>

          {/* Add spacing between equity chart and metrics */}
          <Box padding={{ top: 'xxxl' }} />
          <SpaceBetween size="xl"/>

          {/* Need space under the chart for legend */}
          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <TextContent>
                <h4>Income</h4>
                <Box>${income.toFixed(1)} /mo</Box>
              </TextContent>
            </Box>
            <Box>
              <TextContent>
                <h4>Expenses</h4>
                <Box>${expenses.toFixed(1)} /mo</Box>
              </TextContent>
            </Box>
          </ColumnLayout>
          <ColumnLayout columns={3}>
            <Box>
              <TextContent>
                <h4>Mortgage Payment</h4>
                <Box variant="strong">{mortgagePayment}</Box>
              </TextContent>
            </Box>
            <Box>
              <TextContent>
                <h4>{`${fiveYearOrLessYear}-Year Annualized Return`}</h4>
                <Box variant="strong">{displayAsPercent(fiveYearReturn, 2, true)}</Box>
              </TextContent>
            </Box>
            { fullLoanTermRentalReportData.length >= 10 ?
              <Box>
                <TextContent>
                  <h4>{`${tenYearOrLessYear}-Year Annualized Return`}</h4>
                  <Box variant="strong">{displayAsPercent(tenYearReturn, 2, true)}</Box>
                </TextContent>
              </Box> :
              <></>
            }
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      {/* Deal Finance Section - Separate Container */}
      <Container header={<Header variant="h2" description='Key financial transactions related to your deal'>Deal Finance</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <Box>
            <TextContent>
              <h4>Total Cash Needed</h4>
              <Box variant="strong">{displayAsMoney(totalCashNeeded, 0, '$', true)}</Box>
            </TextContent>
          </Box>
          {rehabBudget !== undefined && (
            <Box>
              <TextContent>
                <h4>Rehab Budget</h4>
                <Box variant="strong">{displayAsMoney(rehabBudget, 0, '$', true)}</Box>
              </TextContent>
            </Box>
          )}
          {refinanceCashout !== undefined && (
            <Box>
              <TextContent>
                <h4>Refinance Cash Out</h4>
                <Box variant="strong">{displayAsMoney(refinanceCashout, 0, '$', true)}</Box>
              </TextContent>
            </Box>
          )}
          {totalCashInDealAfterRefinance !== undefined && (
            <Box>
              <TextContent>
                <h4>Cash In Deal After Refinance</h4>
                <Box variant="strong">{displayAsMoney(totalCashInDealAfterRefinance, 0, '$', true)}</Box>
              </TextContent>
            </Box>
          )}
          {saleProceeds !== undefined && (
            <Box>
              <TextContent>
                <h4>Sale Proceeds</h4>
                <Box variant="strong">{displayAsMoney(saleProceeds, 0, '$', true)}</Box>
              </TextContent>
            </Box>
          )}
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
};
