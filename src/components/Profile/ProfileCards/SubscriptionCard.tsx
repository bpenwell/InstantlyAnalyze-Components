import React from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  StatusIndicator,
  Button,
  Badge,
  ColumnLayout,
} from '@cloudscape-design/components';
import { 
  BillingCycle,
  toUpperCamelCase,
  PAGE_PATH,
  RedirectAPI,
} from '@bpenwell/instantlyanalyze-module';
import { useAppContext } from '../../../utils/AppContextProvider';

export interface SubscriptionCardProps {
  subscriptionTier?: 'free' | 'standard' | 'premium';
  billingCycle?: BillingCycle;
  currentPeriodEnd?: string;
  willRenew?: boolean;
  onUpdateSubscription?: () => void;
  onCancelSubscription?: () => void;
}

// Mock data for demonstration - will be replaced with real API calls
const mockSubscriptionData = {
  subscriptionTier: 'standard' as const,
  billingCycle: BillingCycle.MONTHLY,
  currentPeriodEnd: '2024-10-15',
  willRenew: true,
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscriptionTier = mockSubscriptionData.subscriptionTier,
  billingCycle = mockSubscriptionData.billingCycle,
  currentPeriodEnd = mockSubscriptionData.currentPeriodEnd,
  willRenew = mockSubscriptionData.willRenew,
  onUpdateSubscription,
  onCancelSubscription,
}) => {
  const redirectAPI = new RedirectAPI();
  const { isPaidMember, getRemainingFreeRentalReports, getSubscriptionDetails, getRemainingFreeZillowScrapes, isUserLoading } = useAppContext();
  const isProUser = subscriptionTier !== 'free';
  
  // Defensive programming: handle potential undefined/null values and loading states
  const freeReportsAvailable = (() => {
    if (isUserLoading) return 0; // Return 0 while loading
    try {
      const value = getRemainingFreeRentalReports();
      return typeof value === 'number' ? value : 0;
    } catch (error) {
      console.warn('Error getting remaining free reports:', error);
      return 0;
    }
  })();
  
  const freeZillowScrapesAvailable = (() => {
    if (isUserLoading) return 0; // Return 0 while loading
    try {
      const value = getRemainingFreeZillowScrapes();
      console.log('SubscriptionCard - freeZillowScrapesAvailable:', value, 'type:', typeof value);
      return typeof value === 'number' ? value : 0;
    } catch (error) {
      console.warn('Error getting remaining free Zillow scrapes:', error);
      return 0;
    }
  })();

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'standard':
        return 'Time Saver';
      case 'premium':
        return 'Fully Automated';
      default:
        return 'Free';
    }
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
        return 'Time Saver';
      case 'standard':
        return 'Fully Automated';
      default:
        return null;
    }
  };

  const getPlanPrice = () => {
    switch (subscriptionTier) {
      case 'free':
        return '$0';
      case 'standard':
        return billingCycle === BillingCycle.MONTHLY ? '$20' : '$200';
      case 'premium':
        return billingCycle === BillingCycle.MONTHLY ? '$97' : '$970';
      default:
        return '$0';
    }
  };

  const getPlanFeatures = () => {
    // Ensure we have valid numbers
    const safeReportsAvailable = typeof freeReportsAvailable === 'number' ? freeReportsAvailable : 0;
    const safeZillowScrapesAvailable = typeof freeZillowScrapesAvailable === 'number' ? freeZillowScrapesAvailable : 0;
    
    const features = [
      {
        name: 'Property Analysis',
        included: true,
        limit: isProUser ? 'Unlimited' : `${safeReportsAvailable} remaining`
      },
      {
        name: 'Market scans with Zillow Scraper',
        included: true,
        limit: `${safeZillowScrapesAvailable} remaining`
      },
      {
        name: 'Priority Email Support',
        included: isProUser,
        limit: isProUser ? 'Included' : 'Time Saver Plan only'
      },
      {
        name: 'AI analysis and insights',
        included: subscriptionTier === 'premium',
        limit: 'Fully Automated Plan only'
      }
    ];
    return features;
  };

  const handleUpdateBillingCycle = async () => {
    try {
      await onUpdateSubscription?.();
    } catch (error) {
      console.error('Error updating billing cycle:', error);
    }
  };

  const handleCancelRenew = async () => {
    try {
      await onCancelSubscription?.();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleUpgrade = () => {
    redirectAPI.redirectToPage(PAGE_PATH.SUBSCRIBE);
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          /*actions={
            subscriptionTier !== 'premium' ? (
              <Button variant="primary" onClick={handleUpgrade}>
                Upgrade to {getNextTier()}
              </Button>
            ) : undefined
          }*/
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
                {subscriptionTier === 'standard' ? (
                  <div 
                    style={{
                      backgroundColor: '#FFD700',
                      color: '#000000',
                      border: '1px solid #FFA500',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-block',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}
                  >
                    {getTierDisplayName(subscriptionTier)} - {getPlanPrice()}/{billingCycle === BillingCycle.MONTHLY ? 'mo' : 'yr'}
                  </div>
                ) : (
                  <Badge color={getTierColor(subscriptionTier)}>
                    {getTierDisplayName(subscriptionTier)} - {getPlanPrice()}/{billingCycle === BillingCycle.MONTHLY ? 'mo' : 'yr'}
                  </Badge>
                )}
                {/*<StatusIndicator type={isProUser ? 'success' : 'info'}>
                  {isProUser ? 'Active' : 'Free Tier'}
                </StatusIndicator>*/}
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


        {/* Feature Comparison */}
        <Box>
          <SpaceBetween size="s">
            <strong>Plan Features:</strong>
            <ColumnLayout columns={1} variant="text-grid">
              {getPlanFeatures().map((feature, index) => (
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
          >
            Upgrade to Time Saver Plan - Start at $20/month
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
