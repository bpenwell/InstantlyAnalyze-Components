import React, { useState } from 'react';
import {
  Container,
  Header,
  Tabs,
  SpaceBetween,
} from '@cloudscape-design/components';
import { AnalysisPreferences } from './AnalysisPreferences';
import { NotificationSettings } from './NotificationSettings';
import { DataExportOptions } from './DataExportOptions';

export interface ProfileSettingsProps {
  defaultActiveTab?: string;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  defaultActiveTab = 'analysis',
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultActiveTab);

  const tabs = [
    {
      id: 'analysis',
      label: 'Analysis Preferences',
      content: (
        <AnalysisPreferences
          onSave={(preferences) => {
            console.log('Analysis preferences saved:', preferences);
            // TODO: Implement actual save logic
          }}
        />
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <NotificationSettings
          onSave={(settings) => {
            console.log('Notification settings saved:', settings);
            // TODO: Implement actual save logic
          }}
        />
      ),
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      content: (
        <DataExportOptions
          onExport={(config) => {
            console.log('Data export requested:', config);
            // TODO: Implement actual export logic
          }}
        />
      ),
    },
  ];

  return (
    <Container
      header={
        <Header variant="h1">
          Profile Settings
        </Header>
      }
    >
      <Tabs
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={tabs}
      />
    </Container>
  );
};
