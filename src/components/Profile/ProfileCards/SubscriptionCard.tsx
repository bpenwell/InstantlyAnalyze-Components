import React from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  StatusIndicator,
  Button,
  Badge,
  ProgressBar,
  ColumnLayout,
} from '@cloudscape-design/components';
import { 
  BillingCycle,
  toUpperCamelCase,
  PAGE_PATH,
  RedirectAPI,
} from '@bpenwell/instantlyanalyze-module';

export interface SubscriptionCardProps {
  subscriptionTier?: 'free' | 'standard' | 'premium';
  billingCycle?: BillingCycle;
  currentPeriodEnd?: string;
  willRenew?: boolean;
  reportsUsed?: number;
  reportsLimit?: number;
  onUpdateSubscription?: () => void;
  onCancelSubscription?: () => void;
}

// Mock data for demonstration - will be replaced with real API calls
const mockSubscriptionData = {
  subscriptionTier: 'standard' as const,
  billingCycle: BillingCycle.MONTHLY,
  currentPeriodEnd: '2024-10-15',
  willRenew: true,
  reportsUsed: 12,
  reportsLimit: -1, // Unlimited for paid plans
  subscriptionValue: 1850, // More realistic ROI calculation
  features: [
    { name: 'Unlimited Property Analysis', included: true, limit: 'Unlimited' },
    { name: 'Advanced Market Analytics', included: true, limit: 'Unlimited' },
    { name: 'Export to PDF/Excel', included: true, limit: 'Unlimited' },
    { name: 'Deal Pipeline Management', included: true, limit: 'Unlimited' },
    { name: 'Custom Market Reports', included: true, limit: 'Unlimited' },
    { name: 'Priority Email Support', included: true, limit: 'Included' },
    { name: 'API Access', included: false, limit: 'Pro Plan only' },
    { name: 'White-label Reports', included: false, limit: 'Pro Plan only' },
  ],
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscriptionTier = mockSubscriptionData.subscriptionTier,
  billingCycle = mockSubscriptionData.billingCycle,
  currentPeriodEnd = mockSubscriptionData.currentPeriodEnd,
  willRenew = mockSubscriptionData.willRenew,
  reportsUsed = mockSubscriptionData.reportsUsed,
  reportsLimit = mockSubscriptionData.reportsLimit,
  onUpdateSubscription,
  onCancelSubscription,
}) => {
  const redirectAPI = new RedirectAPI();
  const isProUser = subscriptionTier !== 'free';
  const usagePercentage = reportsLimit ? Math.round((reportsUsed / reportsLimit) * 100) : 0;

  const getTierDisplayName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'green';
      case 'standard':
        return 'blue';
      default:
        return 'grey';
    }
  };

  const getNextTier = () => {
    switch (subscriptionTier) {
      case 'free':
        return 'Pro';
      case 'standard':
        return 'Pro';
      default:
        return null;
    }
  };

  const getPlanPrice = () => {
    switch (subscriptionTier) {
      case 'free':
        return '$0';
      case 'standard':
        return billingCycle === BillingCycle.MONTHLY ? '$47' : '$470';
      case 'premium':
        return billingCycle === BillingCycle.MONTHLY ? '$97' : '$970';
      default:
        return '$0';
    }
  };

  const handleUpdateBillingCycle = () => {
    // Mock implementation - will be replaced with real API call
    console.log('Updating billing cycle...');
    onUpdateSubscription?.();
  };

  const handleCancelRenew = () => {
    // Mock implementation - will be replaced with real API call
    console.log('Toggling subscription renewal...');
    onCancelSubscription?.();
  };

  const handleUpgrade = () => {
    window.location.href = redirectAPI.createRedirectUrl(PAGE_PATH.SUBSCRIBE);
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            subscriptionTier !== 'premium' ? (
              <Button variant="primary" onClick={handleUpgrade}>
                Upgrade to {getNextTier()}
              </Button>
            ) : undefined
          }
        >
          Subscription Details
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* Current Plan Status */}
        <Box>
          <SpaceBetween size="s">
            <div>
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <strong>Current Plan:</strong>
                <Badge color={getTierColor(subscriptionTier)}>
                  {getTierDisplayName(subscriptionTier)} - {getPlanPrice()}/{billingCycle === BillingCycle.MONTHLY ? 'mo' : 'yr'}
                </Badge>
                <StatusIndicator type={isProUser ? 'success' : 'info'}>
                  {isProUser ? 'Active' : 'Free Tier'}
                </StatusIndicator>
              </SpaceBetween>
            </div>

            {isProUser && (
              <div>
                <strong>Billing Cycle:</strong> {toUpperCamelCase(billingCycle)}
              </div>
            )}

            {!willRenew && isProUser && (
              <Box color="text-status-warning">
                <strong>Notice:</strong> Your subscription will remain active until {new Date(currentPeriodEnd).toLocaleDateString()}
              </Box>
            )}
          </SpaceBetween>
        </Box>

        {/* Usage Metrics */}
        <Box>
          <SpaceBetween size="s">
            <div>
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <strong>Usage This Period:</strong>
                <Badge color={usagePercentage > 80 ? 'red' : 'green'}>
                  {reportsUsed}/{reportsLimit === -1 ? '∞' : reportsLimit} reports
                </Badge>
              </SpaceBetween>
            </div>
            
            {reportsLimit !== -1 && (
              <ProgressBar
                value={usagePercentage}
                description={`${reportsLimit - reportsUsed} reports remaining this period`}
              />
            )}
          </SpaceBetween>
        </Box>

        {/* ROI Display */}
        {isProUser && (
          <Box>
            <SpaceBetween size="s">
              <strong>Value This Month:</strong>
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(46, 125, 50, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative background pattern */}
                <div style={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 60,
                  height: 60,
                  background: 'radial-gradient(circle, rgba(46, 125, 50, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }} />
                
                <SpaceBetween direction="horizontal" size="m" alignItems="center">
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '800', 
                      color: 'var(--color-text-status-success)',
                      lineHeight: 1.2,
                      marginBottom: '4px'
                    }}>
                      ${mockSubscriptionData.subscriptionValue}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-body-secondary)',
                      fontWeight: '500'
                    }}>
                      Estimated value from analyses
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    background: 'rgba(46, 125, 50, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(46, 125, 50, 0.3)'
                  }}>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                      color: 'var(--color-text-status-success)' 
                    }}>
                      ROI: {Math.round((mockSubscriptionData.subscriptionValue / (billingCycle === BillingCycle.MONTHLY ? 47 : 470)) * 100)}%
                    </div>
                  </div>
                </SpaceBetween>
              </div>
            </SpaceBetween>
          </Box>
        )}

        {/* Feature Comparison */}
        <Box>
          <SpaceBetween size="s">
            <strong>Plan Features:</strong>
            <ColumnLayout columns={1} variant="text-grid">
              {mockSubscriptionData.features.map((feature, index) => (
                <div key={index}>
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <StatusIndicator type={feature.included ? 'success' : 'stopped'}>
                      {feature.name}
                    </StatusIndicator>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-body-secondary)' 
                    }}>
                      {feature.limit}
                    </span>
                  </SpaceBetween>
                </div>
              ))}
            </ColumnLayout>
          </SpaceBetween>
        </Box>

        {/* Action Buttons */}
        {isProUser ? (
          <SpaceBetween size="xs">
            <Button 
              variant="normal" 
              onClick={handleUpdateBillingCycle}
            >
              {`Switch to ${billingCycle === BillingCycle.MONTHLY ? 'Yearly' : 'Monthly'} Billing`}
            </Button>
            <Button 
              variant="normal" 
              onClick={handleCancelRenew}
            >
              {willRenew ? 'Cancel Subscription' : 'Resume Subscription Renewal'}
            </Button>
          </SpaceBetween>
        ) : (
          <Button 
            variant="primary" 
            onClick={handleUpgrade}
            fullWidth
          >
            Upgrade to Pro Plan - Start at $47/month
          </Button>
        )}

        {/* Next Billing Info */}
        {isProUser && willRenew && (
          <Box color="text-body-secondary">
            <small>
              Next billing date: {new Date(currentPeriodEnd).toLocaleDateString()}
              {billingCycle === BillingCycle.YEARLY && ' (Annual billing saves 20%)'}
            </small>
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
};
