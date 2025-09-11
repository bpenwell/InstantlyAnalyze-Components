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
type LoanDetailsDefaultInput = IDefaultRentalInputs['loanDetails'];

export interface LoanDefaultsProps {
  values: LoanDetailsDefaultInput;
  onChange: (updates: Partial<LoanDetailsDefaultInput>) => void;
}

export const LoanDefaults: React.FC<LoanDefaultsProps> = ({ values, onChange }) => {
  const handleInputChange = (field: keyof LoanDetailsDefaultInput, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ [field]: numericValue });
  };

  const handleToggleChange = (field: keyof LoanDetailsDefaultInput, checked: boolean) => {
    onChange({ [field]: checked });
  };

  return (
    <Box padding={{ horizontal: 's', vertical: 's' }}>
      <SpaceBetween size="m">
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6, m: 4 } },
            { colspan: { default: 12, s: 6, m: 4 } },
            { colspan: { default: 12, s: 6, m: 4 } }
          ]}
        >
          <FormField
            label="Cash Purchase"
            description="Default to cash purchase instead of financing"
          >
            <Toggle
              checked={values.cashPurchase}
              onChange={({ detail }) => handleToggleChange('cashPurchase', detail.checked)}
            >
              {values.cashPurchase ? 'Cash Purchase' : 'Financed Purchase'}
            </Toggle>
          </FormField>

          <FormField
            label="Down Payment Percentage"
            description="Default down payment as percentage of purchase price"
            constraintText="Typically 20-25% for investment properties"
          >
            <Input
              type="number"
              value={values.downPaymentPercent.toString()}
              onChange={({ detail }) => handleInputChange('downPaymentPercent', detail.value)}
              placeholder="25"
              disabled={values.cashPurchase}
              inputMode="decimal"
            />
          </FormField>

          <FormField
            label="Interest Rate"
            description="Default annual interest rate for loans"
            constraintText="Current rates typically 6-8%"
          >
            <Input
              type="number"
              value={values.interestRate.toString()}
              onChange={({ detail }) => handleInputChange('interestRate', detail.value)}
              placeholder="7"
              disabled={values.cashPurchase}
              inputMode="decimal"
            />
          </FormField>
        </Grid>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6, m: 4 } },
            { colspan: { default: 12, s: 6, m: 4 } },
            { colspan: { default: 12, s: 6, m: 4 } }
          ]}
        >
          <FormField
            label="Points Charged"
            description="Default points charged by lender"
            constraintText="Each point = 1% of loan amount"
          >
            <Input
              type="number"
              value={values.pointsCharged.toString()}
              onChange={({ detail }) => handleInputChange('pointsCharged', detail.value)}
              placeholder="0"
              disabled={values.cashPurchase}
              inputMode="decimal"
            />
          </FormField>

          <FormField
            label="Loan Term (Years)"
            description="Default loan term in years"
            constraintText="Typically 15 or 30 years"
          >
            <Input
              type="number"
              value={values.loanTerm.toString()}
              onChange={({ detail }) => handleInputChange('loanTerm', detail.value)}
              placeholder="30"
              disabled={values.cashPurchase}
              inputMode="numeric"
            />
          </FormField>

          <FormField
            label="Loan-to-Value Ratio"
            description="Maximum loan amount as percentage of property value"
            constraintText="Calculated automatically based on down payment"
          >
            <Input
              type="number"
              value={values.loanToValuePercent.toString()}
              onChange={({ detail }) => handleInputChange('loanToValuePercent', detail.value)}
              placeholder="75"
              disabled={values.cashPurchase}
              inputMode="decimal"
            />
          </FormField>
        </Grid>

        <Box fontSize="body-s" color="text-body-secondary">
          <strong>About financing settings:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><strong>Down Payment:</strong> Investment properties typically require higher down payments than primary residences</li>
            <li><strong>Interest Rates:</strong> Investment property rates are usually 0.5-1% higher than primary residence rates</li>
            <li><strong>LTV Ratio:</strong> Most lenders cap investment property loans at 75-80% LTV</li>
            <li><strong>Points:</strong> Optional upfront fee to reduce interest rate - each point typically reduces rate by 0.25%</li>
          </ul>
        </Box>
      </SpaceBetween>
    </Box>
  );
};
