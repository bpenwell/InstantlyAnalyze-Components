import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  FormField,
  Select,
  Input,
  Button,
  Box,
  Alert,
  Toggle,
  Multiselect,
} from '@cloudscape-design/components';

export interface AnalysisPreferencesProps {
  onSave?: (preferences: AnalysisPreferencesData) => void;
  initialPreferences?: AnalysisPreferencesData;
}

export interface AnalysisPreferencesData {
  defaultAnalysisType: string;
  preferredMarkets: string[];
  defaultLoanToValue: number;
  defaultInterestRate: number;
  defaultLoanTerm: number;
  includeClosingCosts: boolean;
  defaultVacancyRate: number;
  defaultManagementFee: number;
  autoSaveAnalyses: boolean;
  emailReportsByDefault: boolean;
}

// Mock data for demonstration
const mockPreferences: AnalysisPreferencesData = {
  defaultAnalysisType: 'rental',
  preferredMarkets: ['Denver, CO', 'Austin, TX', 'Phoenix, AZ'],
  defaultLoanToValue: 80,
  defaultInterestRate: 7.5,
  defaultLoanTerm: 30,
  includeClosingCosts: true,
  defaultVacancyRate: 5,
  defaultManagementFee: 10,
  autoSaveAnalyses: true,
  emailReportsByDefault: false,
};

const analysisTypeOptions = [
  { label: 'Rental Property Analysis', value: 'rental' },
  { label: 'Fix & Flip Analysis', value: 'flip' },
  { label: 'BRRRR Analysis', value: 'brrrr' },
  { label: 'Commercial Property', value: 'commercial' },
];

const marketOptions = [
  { label: 'Denver, CO', value: 'Denver, CO' },
  { label: 'Austin, TX', value: 'Austin, TX' },
  { label: 'Phoenix, AZ', value: 'Phoenix, AZ' },
  { label: 'Atlanta, GA', value: 'Atlanta, GA' },
  { label: 'Tampa, FL', value: 'Tampa, FL' },
  { label: 'Nashville, TN', value: 'Nashville, TN' },
  { label: 'Charlotte, NC', value: 'Charlotte, NC' },
  { label: 'Raleigh, NC', value: 'Raleigh, NC' },
  { label: 'Dallas, TX', value: 'Dallas, TX' },
  { label: 'Houston, TX', value: 'Houston, TX' },
];

export const AnalysisPreferences: React.FC<AnalysisPreferencesProps> = ({
  onSave,
  initialPreferences = mockPreferences,
}) => {
  const [preferences, setPreferences] = useState<AnalysisPreferencesData>(initialPreferences);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleFieldChange = (field: keyof AnalysisPreferencesData, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    try {
      // Mock save - replace with actual API call
      console.log('Saving analysis preferences:', preferences);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus({
        type: 'success',
        message: 'Analysis preferences saved successfully!',
      });
      setIsDirty(false);
      onSave?.(preferences);
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save preferences. Please try again.',
      });
    }
  };

  const handleReset = () => {
    setPreferences(initialPreferences);
    setIsDirty(false);
    setSaveStatus(null);
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                onClick={handleReset}
                disabled={!isDirty}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!isDirty}
              >
                Save Preferences
              </Button>
            </SpaceBetween>
          }
        >
          Analysis Preferences
        </Header>
      }
    >
      <SpaceBetween size="l">
        {saveStatus && (
          <Alert
            type={saveStatus.type}
            dismissible
            onDismiss={() => setSaveStatus(null)}
          >
            {saveStatus.message}
          </Alert>
        )}

        {/* Default Analysis Type */}
        <FormField
          label="Default Analysis Type"
          description="The type of analysis to pre-select when starting new property evaluations"
        >
          <Select
            selectedOption={analysisTypeOptions.find(opt => opt.value === preferences.defaultAnalysisType) || null}
            onChange={({ detail }) => handleFieldChange('defaultAnalysisType', detail.selectedOption.value)}
            options={analysisTypeOptions}
            placeholder="Choose analysis type"
          />
        </FormField>

        {/* Preferred Markets */}
        <FormField
          label="Preferred Markets"
          description="Markets you frequently analyze - these will appear first in search suggestions"
        >
          <Multiselect
            selectedOptions={marketOptions.filter(opt => 
              preferences.preferredMarkets.includes(opt.value)
            )}
            onChange={({ detail }) => 
              handleFieldChange('preferredMarkets', detail.selectedOptions.map(opt => opt.value))
            }
            options={marketOptions}
            placeholder="Select preferred markets"
            tokenLimit={3}
          />
        </FormField>

        {/* Loan Parameters */}
        <Box>
          <SpaceBetween size="s">
            <strong>Default Loan Parameters</strong>
            
            <FormField
              label="Loan-to-Value Ratio (%)"
              description="Default LTV percentage for financing calculations"
            >
              <Input
                type="number"
                value={preferences.defaultLoanToValue.toString()}
                onChange={({ detail }) => handleFieldChange('defaultLoanToValue', Number(detail.value))}
                placeholder="80"
              />
            </FormField>

            <FormField
              label="Interest Rate (%)"
              description="Default interest rate for loan calculations"
            >
              <Input
                type="number"
                value={preferences.defaultInterestRate.toString()}
                onChange={({ detail }) => handleFieldChange('defaultInterestRate', Number(detail.value))}
                placeholder="7.5"
              />
            </FormField>

            <FormField
              label="Loan Term (years)"
              description="Default loan term for amortization calculations"
            >
              <Input
                type="number"
                value={preferences.defaultLoanTerm.toString()}
                onChange={({ detail }) => handleFieldChange('defaultLoanTerm', Number(detail.value))}
                placeholder="30"
              />
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Property Management Defaults */}
        <Box>
          <SpaceBetween size="s">
            <strong>Property Management Defaults</strong>
            
            <FormField
              label="Vacancy Rate (%)"
              description="Default vacancy rate assumption for rental properties"
            >
              <Input
                type="number"
                value={preferences.defaultVacancyRate.toString()}
                onChange={({ detail }) => handleFieldChange('defaultVacancyRate', Number(detail.value))}
                placeholder="5.0"
              />
            </FormField>

            <FormField
              label="Management Fee (%)"
              description="Default property management fee percentage"
            >
              <Input
                type="number"
                value={preferences.defaultManagementFee.toString()}
                onChange={({ detail }) => handleFieldChange('defaultManagementFee', Number(detail.value))}
                placeholder="10.0"
              />
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Analysis Behavior */}
        <Box>
          <SpaceBetween size="s">
            <strong>Analysis Behavior</strong>
            
            <FormField
              label="Include Closing Costs"
              description="Automatically include closing costs in purchase calculations"
            >
              <Toggle
                checked={preferences.includeClosingCosts}
                onChange={({ detail }) => handleFieldChange('includeClosingCosts', detail.checked)}
              >
                Include closing costs by default
              </Toggle>
            </FormField>

            <FormField
              label="Auto-Save Analyses"
              description="Automatically save analysis results to your account"
            >
              <Toggle
                checked={preferences.autoSaveAnalyses}
                onChange={({ detail }) => handleFieldChange('autoSaveAnalyses', detail.checked)}
              >
                Auto-save completed analyses
              </Toggle>
            </FormField>

            <FormField
              label="Email Reports"
              description="Send analysis reports to your email by default"
            >
              <Toggle
                checked={preferences.emailReportsByDefault}
                onChange={({ detail }) => handleFieldChange('emailReportsByDefault', detail.checked)}
              >
                Email reports automatically
              </Toggle>
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Save Reminder */}
        {isDirty && (
          <Alert type="info">
            You have unsaved changes. Don't forget to save your preferences.
          </Alert>
        )}
      </SpaceBetween>
    </Container>
  );
};
