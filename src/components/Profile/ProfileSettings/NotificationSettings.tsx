import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  FormField,
  Toggle,
  Button,
  Box,
  Alert,
  Select,
  Input,
  Multiselect,
} from '@cloudscape-design/components';

export interface NotificationSettingsProps {
  onSave?: (settings: NotificationSettingsData) => void;
  initialSettings?: NotificationSettingsData;
}

export interface NotificationSettingsData {
  emailNotifications: {
    marketAlerts: boolean;
    priceChanges: boolean;
    newOpportunities: boolean;
    weeklyDigest: boolean;
    accountUpdates: boolean;
    subscriptionReminders: boolean;
  };
  pushNotifications: {
    marketAlerts: boolean;
    priceChanges: boolean;
    newOpportunities: boolean;
  };
  marketAlerts: {
    enabled: boolean;
    markets: string[];
    priceThreshold: number;
    propertyTypes: string[];
    frequency: string;
  };
  digestFrequency: string;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

// Mock data for demonstration
const mockSettings: NotificationSettingsData = {
  emailNotifications: {
    marketAlerts: true,
    priceChanges: true,
    newOpportunities: false,
    weeklyDigest: true,
    accountUpdates: true,
    subscriptionReminders: true,
  },
  pushNotifications: {
    marketAlerts: false,
    priceChanges: false,
    newOpportunities: false,
  },
  marketAlerts: {
    enabled: true,
    markets: ['Denver, CO', 'Austin, TX'],
    priceThreshold: 10,
    propertyTypes: ['Single Family', 'Multi-family'],
    frequency: 'daily',
  },
  digestFrequency: 'weekly',
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '08:00',
  },
};

const marketOptions = [
  { label: 'Denver, CO', value: 'Denver, CO' },
  { label: 'Austin, TX', value: 'Austin, TX' },
  { label: 'Phoenix, AZ', value: 'Phoenix, AZ' },
  { label: 'Atlanta, GA', value: 'Atlanta, GA' },
  { label: 'Tampa, FL', value: 'Tampa, FL' },
  { label: 'Nashville, TN', value: 'Nashville, TN' },
];

const propertyTypeOptions = [
  { label: 'Single Family', value: 'Single Family' },
  { label: 'Multi-family', value: 'Multi-family' },
  { label: 'Condos', value: 'Condos' },
  { label: 'Townhomes', value: 'Townhomes' },
];

const frequencyOptions = [
  { label: 'Immediately', value: 'immediate' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

const digestFrequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Never', value: 'never' },
];

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSave,
  initialSettings = mockSettings,
}) => {
  const [settings, setSettings] = useState<NotificationSettingsData>(initialSettings);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleEmailToggle = (field: keyof NotificationSettingsData['emailNotifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [field]: value,
      },
    }));
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handlePushToggle = (field: keyof NotificationSettingsData['pushNotifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [field]: value,
      },
    }));
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handleMarketAlertChange = (field: keyof NotificationSettingsData['marketAlerts'], value: any) => {
    setSettings(prev => ({
      ...prev,
      marketAlerts: {
        ...prev.marketAlerts,
        [field]: value,
      },
    }));
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handleQuietHoursChange = (field: keyof NotificationSettingsData['quietHours'], value: any) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    try {
      // Mock save - replace with actual API call
      console.log('Saving notification settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus({
        type: 'success',
        message: 'Notification settings saved successfully!',
      });
      setIsDirty(false);
      onSave?.(settings);
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save settings. Please try again.',
      });
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
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
                Save Settings
              </Button>
            </SpaceBetween>
          }
        >
          Notification Settings
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

        {/* Email Notifications */}
        <Box>
          <SpaceBetween size="s">
            <strong>Email Notifications</strong>
            
            <FormField
              label="Market Alerts"
              description="Get notified when properties in your preferred markets meet your criteria"
            >
              <Toggle
                checked={settings.emailNotifications.marketAlerts}
                onChange={({ detail }) => handleEmailToggle('marketAlerts', detail.checked)}
              >
                Email me market alerts
              </Toggle>
            </FormField>

            <FormField
              label="Price Changes"
              description="Notifications when properties you're watching change price"
            >
              <Toggle
                checked={settings.emailNotifications.priceChanges}
                onChange={({ detail }) => handleEmailToggle('priceChanges', detail.checked)}
              >
                Email me price change alerts
              </Toggle>
            </FormField>

            <FormField
              label="New Opportunities"
              description="Get notified about new investment opportunities that match your criteria"
            >
              <Toggle
                checked={settings.emailNotifications.newOpportunities}
                onChange={({ detail }) => handleEmailToggle('newOpportunities', detail.checked)}
              >
                Email me new opportunities
              </Toggle>
            </FormField>

            <FormField
              label="Weekly Digest"
              description="Summary of market activity and your analysis history"
            >
              <Toggle
                checked={settings.emailNotifications.weeklyDigest}
                onChange={({ detail }) => handleEmailToggle('weeklyDigest', detail.checked)}
              >
                Send weekly digest
              </Toggle>
            </FormField>

            <FormField
              label="Account Updates"
              description="Important updates about your account and subscription"
            >
              <Toggle
                checked={settings.emailNotifications.accountUpdates}
                onChange={({ detail }) => handleEmailToggle('accountUpdates', detail.checked)}
              >
                Email account updates
              </Toggle>
            </FormField>

            <FormField
              label="Subscription Reminders"
              description="Reminders about subscription renewals and billing"
            >
              <Toggle
                checked={settings.emailNotifications.subscriptionReminders}
                onChange={({ detail }) => handleEmailToggle('subscriptionReminders', detail.checked)}
              >
                Email subscription reminders
              </Toggle>
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Push Notifications */}
        <Box>
          <SpaceBetween size="s">
            <strong>Push Notifications</strong>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-body-secondary)' }}>
              Browser notifications for immediate alerts
            </div>
            
            <FormField label="Market Alerts">
              <Toggle
                checked={settings.pushNotifications.marketAlerts}
                onChange={({ detail }) => handlePushToggle('marketAlerts', detail.checked)}
              >
                Push notifications for market alerts
              </Toggle>
            </FormField>

            <FormField label="Price Changes">
              <Toggle
                checked={settings.pushNotifications.priceChanges}
                onChange={({ detail }) => handlePushToggle('priceChanges', detail.checked)}
              >
                Push notifications for price changes
              </Toggle>
            </FormField>

            <FormField label="New Opportunities">
              <Toggle
                checked={settings.pushNotifications.newOpportunities}
                onChange={({ detail }) => handlePushToggle('newOpportunities', detail.checked)}
              >
                Push notifications for new opportunities
              </Toggle>
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Market Alerts Configuration */}
        <Box>
          <SpaceBetween size="s">
            <strong>Market Alert Configuration</strong>
            
            <FormField
              label="Enable Market Alerts"
              description="Turn on/off all market-based notifications"
            >
              <Toggle
                checked={settings.marketAlerts.enabled}
                onChange={({ detail }) => handleMarketAlertChange('enabled', detail.checked)}
              >
                Enable market alerts
              </Toggle>
            </FormField>

            {settings.marketAlerts.enabled && (
              <>
                <FormField
                  label="Preferred Markets"
                  description="Markets to monitor for opportunities"
                >
                  <Multiselect
                    selectedOptions={marketOptions.filter(opt => 
                      settings.marketAlerts.markets.includes(opt.value)
                    )}
                    onChange={({ detail }) => 
                      handleMarketAlertChange('markets', detail.selectedOptions.map(opt => opt.value))
                    }
                    options={marketOptions}
                    placeholder="Select markets to monitor"
                  />
                </FormField>

                <FormField
                  label="Property Types"
                  description="Types of properties to include in alerts"
                >
                  <Multiselect
                    selectedOptions={propertyTypeOptions.filter(opt => 
                      settings.marketAlerts.propertyTypes.includes(opt.value)
                    )}
                    onChange={({ detail }) => 
                      handleMarketAlertChange('propertyTypes', detail.selectedOptions.map(opt => opt.value))
                    }
                    options={propertyTypeOptions}
                    placeholder="Select property types"
                  />
                </FormField>

                <FormField
                  label="Price Change Threshold (%)"
                  description="Minimum price change percentage to trigger alerts"
                >
                  <Input
                    type="number"
                    value={settings.marketAlerts.priceThreshold.toString()}
                    onChange={({ detail }) => handleMarketAlertChange('priceThreshold', Number(detail.value))}
                    placeholder="10"
                  />
                </FormField>

                <FormField
                  label="Alert Frequency"
                  description="How often to receive market alerts"
                >
                  <Select
                    selectedOption={frequencyOptions.find(opt => opt.value === settings.marketAlerts.frequency) || null}
                    onChange={({ detail }) => handleMarketAlertChange('frequency', detail.selectedOption.value)}
                    options={frequencyOptions}
                  />
                </FormField>
              </>
            )}
          </SpaceBetween>
        </Box>

        {/* Digest Settings */}
        <Box>
          <SpaceBetween size="s">
            <strong>Digest Settings</strong>
            
            <FormField
              label="Digest Frequency"
              description="How often to receive summary emails"
            >
              <Select
                selectedOption={digestFrequencyOptions.find(opt => opt.value === settings.digestFrequency) || null}
                onChange={({ detail }) => setSettings(prev => ({ ...prev, digestFrequency: detail.selectedOption?.value || 'weekly' }))}
                options={digestFrequencyOptions}
              />
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Quiet Hours */}
        <Box>
          <SpaceBetween size="s">
            <strong>Quiet Hours</strong>
            
            <FormField
              label="Enable Quiet Hours"
              description="Don't send push notifications during specified hours"
            >
              <Toggle
                checked={settings.quietHours.enabled}
                onChange={({ detail }) => handleQuietHoursChange('enabled', detail.checked)}
              >
                Enable quiet hours
              </Toggle>
            </FormField>

            {settings.quietHours.enabled && (
              <SpaceBetween direction="horizontal" size="s">
                <FormField label="Start Time">
                  <Input
                    value={settings.quietHours.startTime}
                    onChange={({ detail }) => handleQuietHoursChange('startTime', detail.value)}
                    placeholder="22:00"
                  />
                </FormField>

                <FormField label="End Time">
                  <Input
                    value={settings.quietHours.endTime}
                    onChange={({ detail }) => handleQuietHoursChange('endTime', detail.value)}
                    placeholder="08:00"
                  />
                </FormField>
              </SpaceBetween>
            )}
          </SpaceBetween>
        </Box>

        {/* Save Reminder */}
        {isDirty && (
          <Alert type="info">
            You have unsaved changes. Don't forget to save your notification settings.
          </Alert>
        )}
      </SpaceBetween>
    </Container>
  );
};
