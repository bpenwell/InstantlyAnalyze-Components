import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Alert,
  Select,
  FormField,
  DateRangePicker,
  Toggle,
  StatusIndicator,
  Badge,
} from '@cloudscape-design/components';

export interface DataExportOptionsProps {
  onExport?: (exportConfig: ExportConfig) => void;
}

export interface ExportConfig {
  dataType: string;
  format: string;
  dateRange: {
    type: 'absolute';
    startDate: string;
    endDate: string;
  } | null;
  includePersonalInfo: boolean;
  includeAnalysisData: boolean;
  includeUsageStats: boolean;
}

// Mock data for demonstration
const mockExportHistory = [
  {
    id: '1',
    type: 'Full Data Export',
    format: 'JSON',
    requestDate: '2024-09-08',
    status: 'completed',
    downloadUrl: '#',
    size: '2.3 MB',
  },
  {
    id: '2',
    type: 'Analysis Reports',
    format: 'PDF',
    requestDate: '2024-09-05',
    status: 'completed',
    downloadUrl: '#',
    size: '15.7 MB',
  },
  {
    id: '3',
    type: 'Usage Statistics',
    format: 'CSV',
    requestDate: '2024-09-01',
    status: 'processing',
    downloadUrl: null,
    size: null,
  },
];

const dataTypeOptions = [
  { label: 'Full Data Export', value: 'full', description: 'All your data including profile, analyses, and usage' },
  { label: 'Analysis Reports Only', value: 'analyses', description: 'Your property analysis reports and saved searches' },
  { label: 'Usage Statistics', value: 'usage', description: 'Account usage data and activity logs' },
  { label: 'Profile Information', value: 'profile', description: 'Personal profile and account settings' },
];

const formatOptions = [
  { label: 'JSON (Structured Data)', value: 'json' },
  { label: 'CSV (Spreadsheet)', value: 'csv' },
  { label: 'PDF (Reports)', value: 'pdf' },
  { label: 'ZIP (All Formats)', value: 'zip' },
];

export const DataExportOptions: React.FC<DataExportOptionsProps> = ({
  onExport,
}) => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    dataType: 'full',
    format: 'json',
    dateRange: null,
    includePersonalInfo: true,
    includeAnalysisData: true,
    includeUsageStats: false,
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus(null);
      
      // Mock export process - replace with actual API call
      console.log('Starting export with config:', exportConfig);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setExportStatus({
        type: 'success',
        message: 'Export request submitted successfully! You\'ll receive an email when your data is ready for download.',
      });
      
      onExport?.(exportConfig);
    } catch (error) {
      setExportStatus({
        type: 'error',
        message: 'Export failed. Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFieldChange = (field: keyof ExportConfig, value: any) => {
    setExportConfig(prev => ({
      ...prev,
      [field]: value,
    }));
    setExportStatus(null);
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'completed':
        return <StatusIndicator type="success">Completed</StatusIndicator>;
      case 'processing':
        return <StatusIndicator type="in-progress">Processing</StatusIndicator>;
      case 'failed':
        return <StatusIndicator type="error">Failed</StatusIndicator>;
      default:
        return <StatusIndicator type="pending">Pending</StatusIndicator>;
    }
  };

  return (
    <Container
      header={
        <Header variant="h2">
          Data Export & Privacy
        </Header>
      }
    >
      <SpaceBetween size="l">
        {exportStatus && (
          <Alert
            type={exportStatus.type}
            dismissible
            onDismiss={() => setExportStatus(null)}
          >
            {exportStatus.message}
          </Alert>
        )}

        {/* Export Configuration */}
        <Box>
          <SpaceBetween size="l">
            <div>
              <strong>Export Your Data</strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-body-secondary)', marginTop: '4px' }}>
                Download your data in various formats for backup or transfer purposes
              </div>
            </div>

            <FormField
              label="Data Type"
              description="Choose what type of data to export"
            >
              <Select
                selectedOption={dataTypeOptions.find(opt => opt.value === exportConfig.dataType) || null}
                onChange={({ detail }) => handleFieldChange('dataType', detail.selectedOption.value)}
                options={dataTypeOptions}
              />
            </FormField>

            <FormField
              label="Export Format"
              description="Choose the format for your exported data"
            >
              <Select
                selectedOption={formatOptions.find(opt => opt.value === exportConfig.format) || null}
                onChange={({ detail }) => handleFieldChange('format', detail.selectedOption.value)}
                options={formatOptions}
              />
            </FormField>

            <FormField
              label="Date Range (Optional)"
              description="Limit export to specific date range"
            >
              <DateRangePicker
                value={exportConfig.dateRange}
                onChange={({ detail }) => handleFieldChange('dateRange', detail.value)}
                relativeOptions={[
                  { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
                  { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
                  { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
                  { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
                  { key: 'previous-1-day', amount: 1, unit: 'day', type: 'relative' },
                  { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
                  { key: 'previous-30-days', amount: 30, unit: 'day', type: 'relative' },
                  { key: 'previous-90-days', amount: 90, unit: 'day', type: 'relative' },
                ]}
                isValidRange={range => {
                  if (range?.type === 'absolute') {
                    const [startDateWithoutTime] = range.startDate.split('T');
                    const [endDateWithoutTime] = range.endDate.split('T');
                    if (!startDateWithoutTime || !endDateWithoutTime) {
                      return {
                        valid: false,
                        errorMessage: 'The selected date range is incomplete. Select a start and end date for the date range.',
                      };
                    }
                    if (new Date(range.startDate).getTime() - new Date(range.endDate).getTime() > 0) {
                      return {
                        valid: false,
                        errorMessage: 'The selected date range is invalid. The start date must be before the end date.',
                      };
                    }
                  }
                  return { valid: true };
                }}
                placeholder="Select date range"
              />
            </FormField>

            {/* Data Inclusion Options */}
            <Box>
              <SpaceBetween size="s">
                <strong>Include in Export</strong>
                
                <FormField
                  label="Personal Information"
                  description="Profile details, contact information, and account settings"
                >
                  <Toggle
                    checked={exportConfig.includePersonalInfo}
                    onChange={({ detail }) => handleFieldChange('includePersonalInfo', detail.checked)}
                  >
                    Include personal information
                  </Toggle>
                </FormField>

                <FormField
                  label="Analysis Data"
                  description="Property analysis reports, saved searches, and calculations"
                >
                  <Toggle
                    checked={exportConfig.includeAnalysisData}
                    onChange={({ detail }) => handleFieldChange('includeAnalysisData', detail.checked)}
                  >
                    Include analysis data
                  </Toggle>
                </FormField>

                <FormField
                  label="Usage Statistics"
                  description="Account activity, login history, and feature usage data"
                >
                  <Toggle
                    checked={exportConfig.includeUsageStats}
                    onChange={({ detail }) => handleFieldChange('includeUsageStats', detail.checked)}
                  >
                    Include usage statistics
                  </Toggle>
                </FormField>
              </SpaceBetween>
            </Box>

            <Button
              variant="primary"
              onClick={handleExport}
              loading={isExporting}
              loadingText="Processing export..."
              disabled={isExporting}
            >
              {isExporting ? 'Processing Export...' : 'Start Export'}
            </Button>
          </SpaceBetween>
        </Box>

        {/* Export History */}
        <Box>
          <SpaceBetween size="s">
            <strong>Export History</strong>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-body-secondary)' }}>
              Your recent data export requests and downloads
            </div>
            
            <SpaceBetween size="s">
              {mockExportHistory.map((exportItem) => (
                <div
                  key={exportItem.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--color-background-layout-panel-content)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-divider-default)',
                  }}
                >
                  <SpaceBetween direction="horizontal" size="m" alignItems="center">
                    <div style={{ flex: 1 }}>
                      <SpaceBetween size="xs">
                        <div style={{ fontWeight: '500' }}>
                          {exportItem.type} ({exportItem.format.toUpperCase()})
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--color-text-body-secondary)' 
                        }}>
                          Requested: {new Date(exportItem.requestDate).toLocaleDateString()}
                          {exportItem.size && ` • Size: ${exportItem.size}`}
                        </div>
                      </SpaceBetween>
                    </div>
                    
                    <SpaceBetween direction="horizontal" size="s" alignItems="center">
                      {getStatusIndicator(exportItem.status)}
                      
                      {exportItem.status === 'completed' && exportItem.downloadUrl && (
                        <Button
                          variant="normal"
                          iconName="download"
                          onClick={() => console.log(`Download ${exportItem.id}`)}
                        >
                          Download
                        </Button>
                      )}
                    </SpaceBetween>
                  </SpaceBetween>
                </div>
              ))}
            </SpaceBetween>
          </SpaceBetween>
        </Box>

        {/* Privacy Information */}
        <Box>
          <SpaceBetween size="s">
            <strong>Privacy & Data Rights</strong>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-body-secondary)' }}>
              <SpaceBetween size="xs">
                <div>• Data exports are processed securely and encrypted during transfer</div>
                <div>• Export files are available for download for 30 days</div>
                <div>• You can request deletion of your data by contacting support</div>
                <div>• All exports comply with GDPR and CCPA privacy regulations</div>
              </SpaceBetween>
            </div>
            
            <SpaceBetween direction="horizontal" size="s">
              <Button
                variant="normal"
                iconName="external"
                onClick={() => console.log('Open privacy policy')}
              >
                Privacy Policy
              </Button>
              <Button
                variant="normal"
                iconName="external"
                onClick={() => console.log('Contact support')}
              >
                Contact Support
              </Button>
            </SpaceBetween>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Container>
  );
};
