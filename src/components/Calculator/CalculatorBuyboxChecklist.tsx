import React, { useState, useEffect } from 'react';
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
  Link,
} from '@cloudscape-design/components';
import { useAppContext } from '../../utils/AppContextProvider';

// Configure your rules as an array of objects.
const RULES = [
  {
    key: 'cocROI',
    label: (
      <Link href="/blog/cash-on-cash-return" external>
        CoC ROI
      </Link>
    ),
    valueType: 'percent',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculateCoCROI(data),
    displayFn: (value: number) => {
      return displayAsPercent(value, 2, false);
    },
    threshold: 8, // example threshold: 8%
    compare: (value: number, threshold: number) => value >= threshold,
    editable: true,
    description: "Cash-on-cash return threshold varies by market (8-12% typical)"
  },
  {
    key: 'capRate',
    label: (
      <Link href="/blog/capitalization-rate" external>
        Going In Cap Rate
      </Link>
    ),
    valueType: 'percent',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculateGoingInCapRate(data),
    displayFn: (value: number) => {
      return displayAsPercent(value, 2, false);
    },
    threshold: 7, // example threshold: 7%
    compare: (value: number, threshold: number) => value >= threshold,
    editable: true,
    description: "Cap rate expectations differ by location (5-10% range)"
  },
  {
    key: 'rentToPriceRatio',
    label: (
      <Link href="/blog/1-percent-rule" external>
        1% Rule
      </Link>
    ),
    valueType: 'percent',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      (data.rentalIncome.grossMonthlyIncome / data.purchaseDetails.purchasePrice) * 100,
    displayFn: (value: number) => {
      return displayAsPercent(value, 2, false);
    },
    threshold: 1,
    compare: (value: number, threshold: number) => value >= threshold,
    editable: true,
    description: "Some markets use 0.8% (Chicago) or 1.2% (hot markets)"
  },
  {
    key: 'cashFlow',
    label: (
      <Link href="/blog/50-percent-rule" external>
        50% Rule
      </Link>
    ),
    valueType: 'currency',
    calculate: (calcUtils: CalculationUtils, data: IRentalCalculatorData) =>
      calcUtils.calculate50PercentRuleCashFlow(data),
    displayFn: (value: number) => displayAsMoney(value, 0, "$"),
    threshold: 0, // example threshold for cash flow
    compare: (value: number, threshold: number) => value >= threshold,
    editable: false,
    description: "Fixed rule: expenses should not exceed 50% of gross income"
  },
];

export const CalculatorBuyboxChecklist: React.FC<IRentalCalculatorPageProps> = (props) => {
  const calculationUtils = new CalculationUtils();
  const { initialRentalReportData } = props;
  const { getRentalReportBuyBoxSetsPreference, setRentalReportBuyBoxSetsPreference, getAppMode, isUserLoading, userExists } = useAppContext();
  const appMode = getAppMode();

  // State to control loading display
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

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

  // Update thresholds when user config loads
  useEffect(() => {
    const hasUser = userExists();      // Set minimum loading time of 2 seconds
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false);
      setHasLoaded(true);
    }, 2000);
    
    // If there's a user and we haven't loaded yet, show loading
    if (hasUser) {
      
      // Check if user config is already loaded
      const rentalReportBuyBoxSets = getRentalReportBuyBoxSetsPreference();
      
      if (rentalReportBuyBoxSets.length > 0) {
        const updatedConfigs: Record<string, number> = {};
        
        // Load user preferences first
        rentalReportBuyBoxSets.forEach(rule => {
          updatedConfigs[rule.key] = rule.threshold;
        });
        
        // Fill in any missing rules with defaults
        RULES.forEach(rule => {
          if (updatedConfigs[rule.key] === undefined) {
            updatedConfigs[rule.key] = rule.threshold;
          }
        });
        
        setHasLoaded(true);
        setIsLoading(false);
        setThresholdConfigs(updatedConfigs);
      }
      
      return () => clearTimeout(minLoadingTime);
    }
  }, [getRentalReportBuyBoxSetsPreference, userExists, hasLoaded]);

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

  // Handles saving changes and exiting edit mode
  const handleSave = () => {
    let newRentalReportBuyBoxSets: IRentalReportBuybox[] = [];
    Object.keys(thresholdConfigs).forEach(key => {
      newRentalReportBuyBoxSets.push({
        key,
        threshold: thresholdConfigs[key],
      });
    });
    setRentalReportBuyBoxSetsPreference(newRentalReportBuyBoxSets);
    setIsEditing(false);
  };

  // Handles canceling changes and exiting edit mode
  const handleCancel = () => {
    // Reset thresholds to original values
    const rentalReportBuyBoxSets = getRentalReportBuyBoxSetsPreference();
    const resetConfigs: Record<string, number> = {};
    
    // Load user preferences first
    rentalReportBuyBoxSets.forEach(rule => {
      resetConfigs[rule.key] = rule.threshold;
    });
    
    // Fill in any missing rules with defaults
    RULES.forEach(rule => {
      if (resetConfigs[rule.key] === undefined) {
        resetConfigs[rule.key] = rule.threshold;
      }
    });
    
    setThresholdConfigs(resetConfigs);
    setIsEditing(false);
  };

  // Handles resetting to default RULES values
  const handleReset = () => {
    const resetConfigs: Record<string, number> = {};
    
    // Use default RULES values
    RULES.forEach(rule => {
      resetConfigs[rule.key] = rule.threshold;
    });
    
    setThresholdConfigs(resetConfigs);
  };

  // Toggles edit mode
  const handleToggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  // Show loading display if we have a user and are loading
  if (isLoading) {
    return (
      <div className={appMode}>
        <Container className="calculator-container">
          <Header 
            variant="h2" 
            description="Loading your personalized buybox preferences..."
          >
            Deal Buyboxes
          </Header>
          
          <div className={`p-6 rounded-lg border ${
            appMode === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-center space-x-3">
              <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                appMode === 'dark' ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
              <span className={`text-sm ${
                appMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Loading your buybox preferences...
              </span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={appMode}>
      <Container className="calculator-container">
        <div className="flex items-center justify-between mb-2">
          <div>
            <Header 
              variant="h2" 
              description="Rules of thumb help identify good deals. Adjust based on your local market conditions."
            >
              Deal Buyboxes
            </Header>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="normal">
                Cancel
              </Button>
              <Button onClick={handleReset} variant="normal">
                Reset
              </Button>
              <Button onClick={handleSave} variant="primary" className="px-6">
                Save
              </Button>
            </div>
          ) : (
            <Button onClick={handleToggleEdit} variant="primary" className="px-6">
              Edit
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {RULES.map((rule) => {
            const currentThreshold = thresholdConfigs[rule.key];
            const value = rule.calculate(calculationUtils, initialRentalReportData);
            const passed = rule.compare(value, currentThreshold);
            
            return (
              <div 
                key={rule.key} 
                className={`rounded-lg border p-3 shadow-sm transition-colors duration-200 ${
                  appMode === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Header with rule name and status tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm font-medium ${
                    appMode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {rule.label}
                  </div>
                  {isLoading ? (
                    <div className={`animate-pulse px-2 py-1 rounded-full text-xs font-medium ${
                      appMode === 'dark' 
                        ? 'bg-gray-700 text-gray-500' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      Loading...
                    </div>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      passed 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {passed ? 'Met' : 'Not Met'}
                    </span>
                  )}
                </div>
                
                {/* Value display */}
                <div className={`text-xl font-bold mb-2 ${
                  appMode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {rule.displayFn(value)}
                </div>
                
                {/* Threshold section */}
                <div>
                  {isEditing && rule.editable ? (
                    <div>
                      <Input
                        type={rule.valueType}
                        value={rule.displayFn(currentThreshold)}
                        onChange={(newValue) =>
                          handleThresholdChange(rule.key, rule.valueType, newValue)
                        }
                        label="Change threshold"
                      />
                    </div>
                  ) : (
                    <div className={`text-xs ${
                      appMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="font-medium">
                        {rule.editable ? (
                          isLoading ? (
                            <span className="flex items-center">
                              Min: <span className={`inline-block animate-pulse ml-1 px-2 py-1 rounded ${
                                appMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                                Loading...
                              </span>
                            </span>
                          ) : (
                            `Min: ${rule.displayFn(currentThreshold)}`
                          )
                        ) : (
                          'Fixed Rule'
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Edit mode note */}
        {isEditing && (
          <div className={`p-3 rounded-lg border ${
            appMode === 'dark' 
              ? 'bg-blue-900/20 border-blue-700 text-blue-200' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="text-xs">
              Changes to these thresholds will be saved as updated profile settings and applied to all existing and future reports.
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
