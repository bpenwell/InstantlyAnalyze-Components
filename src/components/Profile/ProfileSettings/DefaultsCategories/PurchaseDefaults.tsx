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
type PurchaseDetailsDefaultInput = IDefaultRentalInputs['purchaseDetails'];

export interface PurchaseDefaultsProps {
  values: PurchaseDetailsDefaultInput;
  onChange: (updates: Partial<PurchaseDetailsDefaultInput>) => void;
}

export const PurchaseDefaults: React.FC<PurchaseDefaultsProps> = ({ values, onChange }) => {
  const handleInputChange = (field: keyof PurchaseDetailsDefaultInput, value: string) => {
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
            label="Purchase Closing Cost Percentage"
            description="Default percentage of purchase price allocated for closing costs"
            constraintText="Typically ranges from 1% to 4%"
          >
            <Input
              type="number"
              value={values.purchaseClosingCostPercent.toString()}
              onChange={({ detail }) => handleInputChange('purchaseClosingCostPercent', detail.value)}
              placeholder="2"
              inputMode="decimal"
            />
          </FormField>

          <FormField
            label="Property Value Growth Rate"
            description="Expected annual property appreciation percentage"
            constraintText="Historical average is around 2-4% annually"
          >
            <Input
              type="number"
              value={values.propertyValueGrowthPercent.toString()}
              onChange={({ detail }) => handleInputChange('propertyValueGrowthPercent', detail.value)}
              placeholder="2"
              inputMode="decimal"
            />
          </FormField>
        </Grid>

        <Box fontSize="body-s" color="text-body-secondary">
          <strong>About these settings:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><strong>Closing Costs:</strong> Include title insurance, attorney fees, inspections, and other transaction costs</li>
            <li><strong>Property Growth:</strong> Conservative estimates help ensure realistic projections for long-term investments</li>
          </ul>
        </Box>
      </SpaceBetween>
    </Box>
  );
};
