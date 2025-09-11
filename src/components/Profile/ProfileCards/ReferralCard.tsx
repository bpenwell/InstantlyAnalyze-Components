import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Badge,
  Input,
  Modal,
  StatusIndicator,
  Alert,
} from '@cloudscape-design/components';

export interface ReferralCardProps {
  totalReferrals?: number;
  successfulReferrals?: number;
  rewardsEarned?: number;
  referralLink?: string;
}

// Mock data for demonstration
const mockReferralData = {
  totalReferrals: 12,
  successfulReferrals: 8,
  rewardsEarned: 120,
  referralLink: 'https://instantlyanalyze.com/ref/user123',
  recentReferrals: [
    { name: 'John D.', status: 'completed', reward: 15, date: '2024-09-05' },
    { name: 'Sarah M.', status: 'pending', reward: 15, date: '2024-09-03' },
    { name: 'Mike R.', status: 'completed', reward: 15, date: '2024-08-28' },
  ],
};

export const ReferralCard: React.FC<ReferralCardProps> = ({
  totalReferrals = mockReferralData.totalReferrals,
  successfulReferrals = mockReferralData.successfulReferrals,
  rewardsEarned = mockReferralData.rewardsEarned,
  referralLink = mockReferralData.referralLink,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const conversionRate = totalReferrals > 0 ? Math.round((successfulReferrals / totalReferrals) * 100) : 0;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Check out InstantlyAnalyze - Real Estate Investment Platform');
    const body = encodeURIComponent(
      `Hi there!\n\nI've been using InstantlyAnalyze for my real estate investments and thought you might be interested. It's a great platform for analyzing rental properties and finding deals.\n\nCheck it out: ${referralLink}\n\nBest regards!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareSocial = (platform: string) => {
    const text = encodeURIComponent('Check out InstantlyAnalyze for real estate investment analysis!');
    const url = encodeURIComponent(referralLink);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <Button
                variant="primary"
                iconName="share"
                onClick={() => setShowShareModal(true)}
              >
                Share & Earn
              </Button>
            }
          >
            Referral Program
          </Header>
        }
      >
        <SpaceBetween size="l">
          {/* Referral Stats */}
          <Box>
            <SpaceBetween size="m">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px 16px',
                  background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.08) 0%, rgba(26, 115, 232, 0.02) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(26, 115, 232, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: 'var(--color-text-accent)',
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    {totalReferrals}
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--color-text-body-secondary)',
                    fontWeight: '500'
                  }}>
                    Total Referrals
                  </div>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '20px 16px',
                  background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(46, 125, 50, 0.02) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(46, 125, 50, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: 'var(--color-text-status-success)',
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    {successfulReferrals}
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--color-text-body-secondary)',
                    fontWeight: '500'
                  }}>
                    Successful
                  </div>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '20px 16px',
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.02) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 193, 7, 0.2)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: '#f57f17',
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    ${rewardsEarned}
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--color-text-body-secondary)',
                    fontWeight: '500'
                  }}>
                    Rewards Earned
                  </div>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '20px 16px',
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(156, 39, 176, 0.02) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(156, 39, 176, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800',
                    color: '#7b1fa2',
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    {conversionRate}%
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--color-text-body-secondary)',
                    fontWeight: '500'
                  }}>
                    Conversion Rate
                  </div>
                </div>
              </div>
            </SpaceBetween>
          </Box>

          {/* How it Works */}
          <Box>
            <SpaceBetween size="s">
              <strong>How It Works:</strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-body-secondary)' }}>
                <SpaceBetween size="xs">
                  <div>• Share your unique referral link</div>
                  <div>• Friends sign up and subscribe</div>
                  <div>• You earn $15 credit for each successful referral</div>
                  <div>• Credits can be applied to your subscription</div>
                </SpaceBetween>
              </div>
            </SpaceBetween>
          </Box>

          {/* Quick Share */}
          <Box>
            <SpaceBetween size="s">
              <strong>Your Referral Link:</strong>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, var(--color-background-layout-panel-content) 0%, rgba(26, 115, 232, 0.02) 100%)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-divider-default)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={handleCopyLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-border-button-primary-default)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--color-border-divider-default)';
                }}
              >
                {/* Subtle hover effect background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(26, 115, 232, 0.05) 50%, transparent 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} />
                
                <div style={{
                  flex: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-body-default)',
                  fontWeight: '500',
                  marginRight: '12px',
                  wordBreak: 'break-all'
                }}>
                  {referralLink}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'rgba(26, 115, 232, 0.1)',
                  transition: 'background 0.2s ease'
                }}>
                  <Button
                    variant="icon"
                    iconName="copy"
                    ariaLabel="Copy referral link"
                  />
                </div>
              </div>
              
              {copySuccess && (
                <Alert type="success" dismissible={false}>
                  Referral link copied to clipboard!
                </Alert>
              )}
            </SpaceBetween>
          </Box>

          {/* Recent Referrals */}
          <Box>
            <SpaceBetween size="s">
              <strong>Recent Referrals:</strong>
              <SpaceBetween size="xs">
                {mockReferralData.recentReferrals.map((referral, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--color-background-layout-panel-content)',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border-divider-default)',
                    }}
                  >
                    <SpaceBetween direction="horizontal" size="s" alignItems="center">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                          {referral.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-body-secondary)' }}>
                          {new Date(referral.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <StatusIndicator
                        type={referral.status === 'completed' ? 'success' : 'pending'}
                      >
                        {referral.status === 'completed' ? 'Completed' : 'Pending'}
                      </StatusIndicator>
                      
                      <Badge color={referral.status === 'completed' ? 'green' : 'grey'}>
                        ${referral.reward}
                      </Badge>
                    </SpaceBetween>
                  </div>
                ))}
              </SpaceBetween>
              
              {mockReferralData.recentReferrals.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  color: 'var(--color-text-body-secondary)',
                  fontSize: '0.875rem'
                }}>
                  No referrals yet. Start sharing to earn rewards!
                </div>
              )}
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Container>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        onDismiss={() => setShowShareModal(false)}
        header="Share Your Referral Link"
        footer={
          <Box float="right">
            <Button variant="link" onClick={() => setShowShareModal(false)}>
              Close
            </Button>
          </Box>
        }
      >
        <SpaceBetween size="l">
          <Box>
            <SpaceBetween size="s">
              <strong>Share via Email:</strong>
              <Button
                variant="normal"
                iconName="envelope"
                onClick={handleShareEmail}
                fullWidth
              >
                Send Email Invitation
              </Button>
            </SpaceBetween>
          </Box>

          <Box>
            <SpaceBetween size="s">
              <strong>Share on Social Media:</strong>
              <SpaceBetween direction="horizontal" size="s">
                <Button
                  variant="normal"
                  onClick={() => handleShareSocial('twitter')}
                  fullWidth
                >
                  Twitter
                </Button>
                <Button
                  variant="normal"
                  onClick={() => handleShareSocial('linkedin')}
                  fullWidth
                >
                  LinkedIn
                </Button>
                <Button
                  variant="normal"
                  onClick={() => handleShareSocial('facebook')}
                  fullWidth
                >
                  Facebook
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </Box>

          <Box>
            <SpaceBetween size="s">
              <strong>Copy Link:</strong>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, var(--color-background-layout-panel-content) 0%, rgba(26, 115, 232, 0.02) 100%)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-divider-default)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={handleCopyLink}
              >
                <div style={{
                  flex: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-body-default)',
                  fontWeight: '500',
                  marginRight: '12px',
                  wordBreak: 'break-all'
                }}>
                  {referralLink}
                </div>
                
                <Button
                  variant="primary"
                  iconName="copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink();
                  }}
                >
                  Copy
                </Button>
              </div>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
    </>
  );
};
