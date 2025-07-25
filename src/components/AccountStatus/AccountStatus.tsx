import React from 'react';
import { Box, StatusIndicator } from '@cloudscape-design/components';
import { UserStatus } from '@ben1000240/instantlyanalyze-module';

interface AccountStatusProps {
  status: UserStatus;
}

export const AccountStatus: React.FC<AccountStatusProps> = ({ status }) => {
  const getStatusType = () => {
    switch (status) {
      case UserStatus.PRO:
        return 'success';
      case UserStatus.FREE:
        return 'info';
      default:
        return 'pending';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case UserStatus.PRO:
        return 'Pro';
      case UserStatus.FREE:
        return 'Free';
      default:
        return 'Loading...';
    }
  };

  return (
    <Box margin={{ right: 's' }}>
      <StatusIndicator type={getStatusType()}>
        Account: {getStatusText()}
      </StatusIndicator>
    </Box>
  );
};