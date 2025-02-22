import React from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import {
  CalculationUtils,
  displayAsMoney,
  displayAsPercent,
  IRentalCalculatorData,
} from '@bpenwell/instantlyanalyze-module';
import {
  Container,
  Header,
  Box,
  SpaceBetween,
  StatusIndicator,
} from '@cloudscape-design/components';

// Configure your rules as an array of objects.
// Each rule defines how to compute its value, how to display it,
// the threshold to check against, and a comparison function.
const RULES = [
  {
    key: 'cocROI',
    label: 'CoC ROI',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculateCoCROI(data),
    displayFn: displayAsPercent,
    threshold: 0.08, // example threshold: 8%
    compare: (value: number, threshold: number) => value >= threshold,
  },
  /* TODO add this rule
  {
    key: '1PercentRule',
    label: '1% Rule',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      //TODO,
    displayFn: displayAsPercent,
    threshold: 0.08, // example threshold: 8%
    compare: (value: number, threshold: number) => value >= threshold,
  },
  */
  {
    key: 'capRate',
    label: 'Going In Cap Rate',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculateGoingInCapRate(data),
    displayFn: displayAsPercent,
    threshold: 0.07, // example threshold: 7%
    compare: (value: number, threshold: number) => value >= threshold,
  },
  {
    key: 'cashFlow',
    label: '50% Rule Cash Flow',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculate50PercentRuleCashFlow(data),
    displayFn: (value: number) => displayAsMoney(value, 0, "$"),
    threshold: 0, // example threshold for cash flow
    compare: (value: number, threshold: number) => value >= threshold,
  },
];

export const CalculatorRulesOfThumb: React.FC<IRentalCalculatorPageProps> = (props) => {
  const calculationUtils = new CalculationUtils();
  const { initialRentalReportData } = props;

  return (
    <Container>
      <Header variant="h2">Rules of Thumb</Header>
      <SpaceBetween size="l">
        {RULES.map((rule) => {
          const value = rule.calculate(calculationUtils, initialRentalReportData);
          const passed = rule.compare(value, rule.threshold);
          return (
            <Box
              key={rule.key}
              padding="s"
            >
              <Box textAlign='center'>
                <Box>{rule.label}</Box>
                <Box>{rule.displayFn(value)}</Box>
                <Box>
                  <StatusIndicator type={passed ? 'success' : 'error'}>
                    {passed ? 'Passed' : 'Failed'}
                  </StatusIndicator>
                </Box>
              </Box>
            </Box>
          );
        })}
      </SpaceBetween>
    </Container>
  );
};
