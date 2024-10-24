import React from 'react';
import { Box, Button, SpaceBetween } from "@cloudscape-design/components";
import { formatDate } from 'date-fns/format';

export interface IManualRefresh {
    onRefresh: () => void,
    loading: boolean,
    lastRefresh: Date,
    disabled: boolean
};

export const ManualRefresh = (props: IManualRefresh) => {
    const { onRefresh, loading, lastRefresh, disabled } = props;
    return (
      <SpaceBetween data-testid="manual-refresh" direction="horizontal" size="xs" alignItems="center">
        {lastRefresh && (
          <Box variant="p" fontSize="body-s" padding="n" color="text-status-inactive" textAlign="right">
            <span aria-live="polite" aria-atomic="true">
              Last updated
              <br />
              {formatDate(lastRefresh, "MMMM d, yyyy, HH:mm ('UTC'xxx)")}
            </span>
          </Box>
        )}
        <Button
          iconName="refresh"
          ariaLabel="Refresh"
          loadingText="Refreshing table content"
          loading={loading}
          onClick={onRefresh}
          disabled={disabled}
        />
      </SpaceBetween>
    );
  };