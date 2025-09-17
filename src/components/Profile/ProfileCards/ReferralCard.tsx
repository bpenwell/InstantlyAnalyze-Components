import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Badge,
  Alert,
} from '@cloudscape-design/components';
import { useAuth0 } from '@auth0/auth0-react';
import { FeedbackModal } from '../../FeedbackModal/FeedbackModal';
import { FeedbackType } from '@bpenwell/instantlyanalyze-module';

export interface ReferralCardProps {
  // Props are now optional since we'll use static data
  totalReferrals?: number;
  successfulReferrals?: number;
  rewardsEarned?: number;
  referralLink?: string;
}

export const ReferralCard: React.FC<ReferralCardProps> = () => {
  const { user } = useAuth0();
  const userId = user?.sub;
  
  const [showReferralModal, setShowReferralModal] = useState(false);


  return (
    <>
      <Container
        header={
          <Header variant="h2">
            Referral Program
          </Header>
        }
      >
        <SpaceBetween size="l">
          {/* How It Works */}
          <Box>
            <Header variant="h3">How It Works</Header>
            <SpaceBetween direction="vertical" size="s">
              <div>• Refer your friends to InstantlyAnalyze</div>
              <div>• When your friend subscribes, you will be eligible to receive one free month of subscription!</div>
              <div>• Use the "Register a Referral" button below to claim your reward</div>
              <div>• Credits are manually applied by our team after verification</div>
            </SpaceBetween>
          </Box>

          {/* Register Referral Button */}
          <Box>
            <Button
              variant="primary"
              onClick={() => setShowReferralModal(true)}
              iconName="add-plus"
            >
              Register a Referral
            </Button>
          </Box>
        </SpaceBetween>
      </Container>

      {/* Referral Registration Modal */}
      <FeedbackModal
        visible={showReferralModal}
        onDismiss={() => setShowReferralModal(false)}
        feedbackType={FeedbackType.Referral}
      />
    </>
  );
};