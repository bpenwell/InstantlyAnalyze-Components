import React from 'react';
import {
  FormField,
  Input,
  Select,
  SpaceBetween,
  Grid,
  Box,
  ExpandableSection,
} from '@cloudscape-design/components';
import { IDefaultRentalInputs, Frequency } from '@bpenwell/instantlyanalyze-module';

// Extract the type from the main interface
type ExpenseDetailsDefaultInputs = IDefaultRentalInputs['expenseDetails'];

export interface ExpenseDefaultsProps {
  values: ExpenseDetailsDefaultInputs;
  onChange: (updates: Partial<ExpenseDetailsDefaultInputs>) => void;
}

const frequencyOptions = [
  { label: 'Monthly', value: Frequency.Monthly },
  { label: 'Annual', value: Frequency.Annual },
];

export const ExpenseDefaults: React.FC<ExpenseDefaultsProps> = ({ values, onChange }) => {
  const handleInputChange = (field: keyof ExpenseDetailsDefaultInputs, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ [field]: numericValue });
  };

  const handleSelectChange = (field: keyof ExpenseDetailsDefaultInputs, selectedOption: any) => {
    onChange({ [field]: selectedOption.value });
  };

  return (
    <Box padding={{ horizontal: 's', vertical: 's' }}>
      <SpaceBetween size="l">
        {/* Major Expenses */}
        <ExpandableSection
          headerText="Major Expenses"
          headerDescription="Property taxes, insurance, and key operating costs"
          defaultExpanded={true}
        >
          <SpaceBetween size="m">
            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 6, m: 4 } },
                { colspan: { default: 12, s: 6, m: 4 } },
                { colspan: { default: 12, s: 6, m: 4 } }
              ]}
            >
              <FormField
                label="Property Taxes"
                description="Default property tax amount"
                constraintText="Based on frequency setting below"
              >
                <Input
                  type="number"
                  value={values.propertyTaxes.toString()}
                  onChange={({ detail }) => handleInputChange('propertyTaxes', detail.value)}
                  placeholder="100"
                  inputMode="decimal"
                />
              </FormField>

              <FormField
                label="Property Tax Frequency"
                description="How often property taxes are paid"
              >
                <Select
                  selectedOption={frequencyOptions.find(opt => opt.value === values.propertyTaxFrequency) || frequencyOptions[0]}
                  onChange={({ detail }) => handleSelectChange('propertyTaxFrequency', detail.selectedOption)}
                  options={frequencyOptions}
                />
              </FormField>

              <FormField
                label="Insurance"
                description="Default insurance cost"
                constraintText="Based on frequency setting below"
              >
                <Input
                  type="number"
                  value={values.insurance.toString()}
                  onChange={({ detail }) => handleInputChange('insurance', detail.value)}
                  placeholder="200"
                  inputMode="decimal"
                />
              </FormField>
            </Grid>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 6 } },
                { colspan: { default: 12, s: 6 } }
              ]}
            >
              <FormField
                label="Insurance Frequency"
                description="How often insurance is paid"
              >
                <Select
                  selectedOption={frequencyOptions.find(opt => opt.value === values.insuranceFrequency) || frequencyOptions[0]}
                  onChange={({ detail }) => handleSelectChange('insuranceFrequency', detail.selectedOption)}
                  options={frequencyOptions}
                />
              </FormField>
            </Grid>
          </SpaceBetween>
        </ExpandableSection>

        {/* Percentage-Based Expenses */}
        <ExpandableSection
          headerText="Percentage-Based Expenses"
          headerDescription="Expenses calculated as percentages of rental income"
          defaultExpanded={true}
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6, m: 3 } },
              { colspan: { default: 12, s: 6, m: 3 } },
              { colspan: { default: 12, s: 6, m: 3 } },
              { colspan: { default: 12, s: 6, m: 3 } }
            ]}
          >
            <FormField
              label="Maintenance %"
              description="Percentage of income for maintenance"
              constraintText="Typically 5-15%"
            >
              <Input
                type="number"
                value={values.maintenancePercent.toString()}
                onChange={({ detail }) => handleInputChange('maintenancePercent', detail.value)}
                placeholder="10"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Vacancy %"
              description="Percentage of income for vacancy"
              constraintText="Typically 3-8%"
            >
              <Input
                type="number"
                value={values.vacancyPercent.toString()}
                onChange={({ detail }) => handleInputChange('vacancyPercent', detail.value)}
                placeholder="5"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Capital Expenditure %"
              description="Percentage for major repairs/replacements"
              constraintText="Typically 5-10%"
            >
              <Input
                type="number"
                value={values.capitalExpenditurePercent.toString()}
                onChange={({ detail }) => handleInputChange('capitalExpenditurePercent', detail.value)}
                placeholder="5"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Management Fee %"
              description="Property management fee percentage"
              constraintText="Typically 8-12% if using PM"
            >
              <Input
                type="number"
                value={values.managementFeePercent.toString()}
                onChange={({ detail }) => handleInputChange('managementFeePercent', detail.value)}
                placeholder="10"
                inputMode="decimal"
              />
            </FormField>
          </Grid>
        </ExpandableSection>

        {/* Utility Expenses */}
        <ExpandableSection
          headerText="Utility Expenses"
          headerDescription="Monthly utility costs (if paid by landlord)"
          defaultExpanded={false}
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6, m: 4 } },
              { colspan: { default: 12, s: 6, m: 4 } },
              { colspan: { default: 12, s: 6, m: 4 } }
            ]}
          >
            <FormField
              label="Electricity"
              description="Monthly electricity cost"
              constraintText="Enter 0 if tenant pays"
            >
              <Input
                type="number"
                value={values.electricity.toString()}
                onChange={({ detail }) => handleInputChange('electricity', detail.value)}
                placeholder="0"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Gas"
              description="Monthly gas cost"
              constraintText="Enter 0 if tenant pays"
            >
              <Input
                type="number"
                value={values.gas.toString()}
                onChange={({ detail }) => handleInputChange('gas', detail.value)}
                placeholder="0"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Water & Sewer"
              description="Monthly water and sewer cost"
              constraintText="Often paid by landlord"
            >
              <Input
                type="number"
                value={values.waterAndSewer.toString()}
                onChange={({ detail }) => handleInputChange('waterAndSewer', detail.value)}
                placeholder="0"
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
              label="HOA Fees"
              description="Monthly HOA fees"
              constraintText="Enter 0 if no HOA"
            >
              <Input
                type="number"
                value={values.hoaFees.toString()}
                onChange={({ detail }) => handleInputChange('hoaFees', detail.value)}
                placeholder="0"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Garbage"
              description="Monthly garbage collection cost"
              constraintText="Enter 0 if included in other fees"
            >
              <Input
                type="number"
                value={values.garbage.toString()}
                onChange={({ detail }) => handleInputChange('garbage', detail.value)}
                placeholder="0"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Other Expenses"
              description="Other monthly expenses"
              constraintText="Lawn care, pest control, etc."
            >
              <Input
                type="number"
                value={values.other.toString()}
                onChange={({ detail }) => handleInputChange('other', detail.value)}
                placeholder="0"
                inputMode="decimal"
              />
            </FormField>
          </Grid>
        </ExpandableSection>

        {/* Growth & Exit Costs */}
        <ExpandableSection
          headerText="Growth & Exit Assumptions"
          headerDescription="Expense growth and sale cost assumptions"
          defaultExpanded={false}
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } }
            ]}
          >
            <FormField
              label="Expense Growth Rate"
              description="Annual expense growth percentage"
              constraintText="Typically matches inflation (2-4%)"
            >
              <Input
                type="number"
                value={values.expenseGrowthPercent.toString()}
                onChange={({ detail }) => handleInputChange('expenseGrowthPercent', detail.value)}
                placeholder="2"
                inputMode="decimal"
              />
            </FormField>

            <FormField
              label="Sales Expense %"
              description="Selling costs as percentage of sale price"
              constraintText="Realtor fees, closing costs (typically 6-8%)"
            >
              <Input
                type="number"
                value={values.salesExpensesPercent.toString()}
                onChange={({ detail }) => handleInputChange('salesExpensesPercent', detail.value)}
                placeholder="6"
                inputMode="decimal"
              />
            </FormField>
          </Grid>
        </ExpandableSection>

        <Box fontSize="body-s" color="text-body-secondary">
          <strong>Expense Guidelines:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><strong>Percentage Rules:</strong> Conservative estimates help ensure positive cash flow</li>
            <li><strong>Market Variations:</strong> Adjust percentages based on property age, location, and type</li>
            <li><strong>Utility Responsibility:</strong> Clearly define which utilities landlord vs tenant pays</li>
            <li><strong>Capital Expenditures:</strong> Set aside funds for major items (roof, HVAC, appliances)</li>
          </ul>
        </Box>
      </SpaceBetween>
    </Box>
  );
};
