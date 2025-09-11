import React from 'react';
import {
  FormField,
  Input,
  SpaceBetween,
  Grid,
  Box,
} from '@cloudscape-design/components';
import { IDefaultRentalInputs } from '@bpenwell/instantlyanalyze-module';

// Extract the type from the main interface
type RentalIncomeDefaultInput = IDefaultRentalInputs['rentalIncome'];

export interface IncomeDefaultsProps {
  values: RentalIncomeDefaultInput;
  onChange: (updates: Partial<RentalIncomeDefaultInput>) => void;
}

export const IncomeDefaults: React.FC<IncomeDefaultsProps> = ({ values, onChange }) => {
  const handleInputChange = (field: keyof RentalIncomeDefaultInput, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ [field]: numericValue });
  };

  return (
    <Box padding={{ horizontal: 's', vertical: 's' }}>
      <SpaceBetween size="m">
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } }
          ]}
        >
          <FormField
            label="Income Growth Rate"
            description="Expected annual rental income growth percentage"
            constraintText="Typically 2-4% annually to match inflation"
          >
            <Input
              type="number"
              value={values.incomeGrowthPercent.toString()}
              onChange={({ detail }) => handleInputChange('incomeGrowthPercent', detail.value)}
              placeholder="2"
              inputMode="decimal"
            />
          </FormField>

          <FormField
            label="Other Monthly Income"
            description="Default additional monthly income (laundry, parking, etc.)"
            constraintText="Enter 0 if no additional income expected"
          >
            <Input
              type="number"
              value={values.otherMonthlyIncome.toString()}
              onChange={({ detail }) => handleInputChange('otherMonthlyIncome', detail.value)}
              placeholder="0"
              inputMode="decimal"
            />
          </FormField>
        </Grid>

        <Box fontSize="body-s" color="text-body-secondary">
          <strong>About income projections:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><strong>Growth Rate:</strong> Conservative estimates help ensure realistic long-term projections</li>
            <li><strong>Other Income:</strong> Include laundry facilities, parking fees, storage units, or pet fees</li>
            <li><strong>Market Research:</strong> Base growth rates on local market trends and inflation expectations</li>
          </ul>
        </Box>
      </SpaceBetween>
    </Box>
  );
};
