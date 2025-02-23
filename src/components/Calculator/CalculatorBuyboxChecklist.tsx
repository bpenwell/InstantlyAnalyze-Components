import React, { useState } from 'react';
import { IRentalCalculatorPageProps } from '../../interfaces';
import {
  CalculationUtils,
  displayAsMoney,
  displayAsPercent,
  IRentalCalculatorData,
  IRentalReportBuybox,
  parseCurrencyStringToNumber,
  parsePercentageStringToNumber,
} from '@bpenwell/instantlyanalyze-module';
import {
  Input,
} from '../Input/Input';
import {
  Container,
  Header,
  Box,
  SpaceBetween,
  StatusIndicator,
  Button,
} from '@cloudscape-design/components';
import { useAppContext } from '../../utils/AppContextProvider';

// Configure your rules as an array of objects.
const RULES = [
  {
    key: 'cocROI',
    label: 'CoC ROI',
    valueType: 'percent',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculateCoCROI(data),
    displayFn: (value: number) => {
      return displayAsPercent(value, 2, false);
    },
    threshold: 8, // example threshold: 8%
    compare: (value: number, threshold: number) => value >= threshold,
  },
  {
    key: 'capRate',
    label: 'Going In Cap Rate',
    valueType: 'percent',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculateGoingInCapRate(data),
    displayFn: (value: number) => {
      return displayAsPercent(value, 2, false);
    },
    threshold: 7, // example threshold: 7%
    compare: (value: number, threshold: number) => value >= threshold,
  },
  {
    key: 'rentToPriceRatio',
    label: 'Rent:Price Ratio',
    valueType: 'percent',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      (data.rentalIncome.grossMonthlyIncome / data.purchaseDetails.purchasePrice) * 100,
    displayFn: (value: number) => {
      return displayAsPercent(value, 2, true, true);
    },
    threshold: 7, // example threshold: 7%
    compare: (value: number, threshold: number) => value >= threshold,
  },
  {
    key: 'cashFlow',
    label: '50% Rule Cash Flow',
    valueType: 'currency',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculate50PercentRuleCashFlow(data),
    displayFn: (value: number) => displayAsMoney(value, 0, "$"),
    threshold: 0, // example threshold for cash flow
    compare: (value: number, threshold: number) => value >= threshold,
  },
];

export const CalculatorBuyboxChecklist: React.FC<IRentalCalculatorPageProps> = (props) => {
  const calculationUtils = new CalculationUtils();
  const { initialRentalReportData } = props;
  const { getRentalReportBuyBoxSetsPreference, setRentalReportBuyBoxSetsPreference } = useAppContext();

  // Use local state to store thresholds (initializing from RULES)
  const [thresholdConfigs, setThresholdConfigs] = useState(() => {
    const initialConfigs: Record<string, number> = {};

    const rentalReportBuyBoxSets = getRentalReportBuyBoxSetsPreference();
    rentalReportBuyBoxSets.forEach(rule => {
      initialConfigs[rule.key] = rule.threshold;
    });

    RULES.forEach(rule => {
      if (initialConfigs[rule.key] === undefined) {
        initialConfigs[rule.key] = rule.threshold;
      }
    });
    return initialConfigs;
  });

  // State to control whether the thresholds are editable.
  const [isEditing, setIsEditing] = useState(false);

  // Handler for input changes in edit mode.
  const handleThresholdChange = (key: string, valueType: string, newValue: string) => {
    let parsedValue: number;
    if (valueType === 'percent') {
      parsedValue = parsePercentageStringToNumber(newValue);
    } else if (valueType === 'currency') {
      parsedValue = parseCurrencyStringToNumber(newValue);
    } else {
      parsedValue = parseFloat(newValue);
    }
    if (isNaN(parsedValue)) return;
    setThresholdConfigs((prev) => ({ ...prev, [key]: parsedValue }));
  };

  // Toggles edit mode. When saving, iterate over thresholdConfigs to update configs.
  const handleToggleEdit = () => {
    if (isEditing) {
      
      let newRentalReportBuyBoxSets: IRentalReportBuybox[] = [];
      Object.keys(thresholdConfigs).forEach(key => {
        newRentalReportBuyBoxSets.push({
          key,
          threshold: thresholdConfigs[key],
        });
      });
      setRentalReportBuyBoxSetsPreference(newRentalReportBuyBoxSets)
    }
    setIsEditing(prev => !prev);
  };

  return (
    <Container className="calculator-container">
      <Header variant="h2">Key Deal Metrics</Header>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SpaceBetween direction="horizontal" size="l">
          {RULES.map((rule) => {
            // Use the current threshold from state if available.
            const currentThreshold = thresholdConfigs[rule.key];
            const value = rule.calculate(calculationUtils, initialRentalReportData);
            const passed = rule.compare(value, currentThreshold);
            return (
              <Box key={rule.key} padding="s">
                <Box textAlign="center">
                  <Box variant='h3'>{rule.label}</Box>
                  <Box variant='h4'>{rule.displayFn(value)}</Box>
                  <Box margin={{ vertical: 's' }}>
                    <StatusIndicator type={passed ? 'success' : 'error'}>
                      {passed ? 'Good Deal' : 'Bad Deal'}
                    </StatusIndicator>
                  </Box>
                  {isEditing ? (
                    <Input
                      type={rule.valueType}
                      label={`${rule.label} threshold`}
                      value={rule.displayFn(currentThreshold)}
                      onChange={(newValue) =>
                        handleThresholdChange(rule.key, rule.valueType, newValue)
                      }
                    />
                  ) : (
                    // When not editing, simply show the threshold value.
                    <Box>{`Good Deal >= ${rule.displayFn(currentThreshold)}`}</Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </SpaceBetween>
      </div>
      <Box margin={{ bottom: 'xs' }} float='right'>
        <Button onClick={handleToggleEdit}>
          {isEditing ? 'Save Thresholds' : 'Edit Thresholds'}
        </Button>
      </Box>
    </Container>
  );
};
