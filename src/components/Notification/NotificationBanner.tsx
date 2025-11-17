import React from 'react';
import { Alert, Box, SpaceBetween } from '@cloudscape-design/components';
import { useNotifications } from './NotificationProvider';
import { Mode } from '@cloudscape-design/global-styles';
import { useAppContext } from '../../utils/AppContextProvider';

export const NotificationBanner: React.FC = () => {
  const { notifications, hideNotification } = useNotifications();
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();

  if (notifications.length === 0) {
    return null;
  }

  const getAlertType = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info':
      default: return 'info';
    }
  };

  return (
    <div
      className={appMode}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        maxWidth: '600px',
        width: '90%',
      }}
    >
      <SpaceBetween size="s">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            type={getAlertType(notification.type)}
            dismissible
            onDismiss={() => hideNotification(notification.id)}
            header={notification.message}
          >
            {/* Empty content - header contains the message */}
          </Alert>
        ))}
      </SpaceBetween>
    </div>
  );
};
