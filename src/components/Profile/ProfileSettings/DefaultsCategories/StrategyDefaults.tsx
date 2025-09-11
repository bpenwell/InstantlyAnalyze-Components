import React from 'react';
import {
  FormField,
  Input,
  Toggle,
  SpaceBetween,
  Grid,
  Box,
} from '@cloudscape-design/components';
import { IDefaultRentalInputs } from '@bpenwell/instantlyanalyze-module';

// Extract the type from the main interface
type StrategyDetails = IDefaultRentalInputs['strategyDetails'];

export interface StrategyDefaultsProps {
  values: StrategyDetails;
  onChange: (updates: Partial<StrategyDetails>) => void;
}

export const StrategyDefaults: React.FC<StrategyDefaultsProps> = ({ values, onChange }) => {
  const handleInputChange = (field: keyof StrategyDetails, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ [field]: numericValue });
  };

  const handleToggleChange = (field: keyof StrategyDetails, checked: boolean) => {
    onChange({ [field]: checked });
  };

  return (
    <Box padding={{ horizontal: 's', vertical: 's' }}>
      <SpaceBetween size="l">
        {/* Rehab Strategy */}
        <Box>
          <SpaceBetween size="m">
            <FormField
              label="Rehab Property Strategy"
              description="Default assumption for property rehabilitation"
            >
              <Toggle
                checked={values.isRehabbingProperty}
                onChange={({ detail }) => handleToggleChange('isRehabbingProperty', detail.checked)}
              >
                {values.isRehabbingProperty ? 'Include Rehab Strategy' : 'No Rehab Strategy'}
              </Toggle>
            </FormField>

            {values.isRehabbingProperty && (
              <Box padding={{ left: 'm' }}>
                <SpaceBetween size="m">
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, s: 6 } },
                      { colspan: { default: 12, s: 6 } }
                    ]}
                  >
                    <FormField
                      label="After Repair Value (ARV)"
                      description="Expected property value after rehabilitation"
                      constraintText="Leave 0 to calculate dynamically"
                    >
                      <Input
                        type="number"
                        value={values.rehabAfterRepairValue?.toString() || '0'}
                        onChange={({ detail }) => handleInputChange('rehabAfterRepairValue', detail.value)}
                        placeholder="0"
                        inputMode="decimal"
                      />
                    </FormField>

                    <FormField
                      label="Repair Costs"
                      description="Expected total rehabilitation costs"
                      constraintText="Include materials, labor, and permits"
                    >
                      <Input
                        type="number"
                        value={values.rehabRepairCosts?.toString() || '0'}
                        onChange={({ detail }) => handleInputChange('rehabRepairCosts', detail.value)}
                        placeholder="0"
                        inputMode="decimal"
                      />
                    </FormField>
                  </Grid>
                </SpaceBetween>
              </Box>
            )}
          </SpaceBetween>
        </Box>

        {/* Refinance Strategy */}
        <Box>
          <SpaceBetween size="m">
            <FormField
              label="Refinancing Strategy"
              description="Default assumption for property refinancing"
            >
              <Toggle
                checked={values.isRefinancingProperty}
                onChange={({ detail }) => handleToggleChange('isRefinancingProperty', detail.checked)}
              >
                {values.isRefinancingProperty ? 'Include Refinance Strategy' : 'No Refinance Strategy'}
              </Toggle>
            </FormField>

            {values.isRefinancingProperty && (
              <Box padding={{ left: 'm' }}>
                <Grid
                  gridDefinition={[
                    { colspan: { default: 12, s: 6 } },
                    { colspan: { default: 12, s: 6 } }
                  ]}
                >
                  <FormField
                    label="Refinance Interest Rate"
                    description="Expected interest rate for refinancing"
                    constraintText="Often lower than initial purchase rate"
                  >
                    <Input
                      type="number"
                      value={values.refinanceInterestRate?.toString() || '7'}
                      onChange={({ detail }) => handleInputChange('refinanceInterestRate', detail.value)}
                      placeholder="7"
                      inputMode="decimal"
                    />
                  </FormField>

                  <FormField
                    label="Refinance Closing Cost %"
                    description="Closing costs as percentage of refinance amount"
                    constraintText="Typically 2-4% of loan amount"
                  >
                    <Input
                      type="number"
                      value={values.refinanceClosingCostPercent?.toString() || '3'}
                      onChange={({ detail }) => handleInputChange('refinanceClosingCostPercent', detail.value)}
                      placeholder="3"
                      inputMode="decimal"
                    />
                  </FormField>
                </Grid>
              </Box>
            )}
          </SpaceBetween>
        </Box>

        <Box fontSize="body-s" color="text-body-secondary">
          <strong>About investment strategies:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><strong>BRRRR Strategy:</strong> Buy, Rehab, Rent, Refinance, Repeat - enables capital recycling</li>
            <li><strong>Rehab Considerations:</strong> Factor in holding costs during renovation period</li>
            <li><strong>Refinancing:</strong> Can help pull capital out for next investment, but adds complexity</li>
            <li><strong>Conservative Estimates:</strong> Use realistic ARV and repair cost estimates to avoid overextension</li>
          </ul>
        </Box>
      </SpaceBetween>
    </Box>
  );
};
