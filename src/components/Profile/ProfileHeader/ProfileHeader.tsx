import React, { useState, useEffect } from 'react';
import {
  Box,
  SpaceBetween,
  StatusIndicator,
  Badge,
  ProgressBar,
  Button,
  Container,
  Header,
} from '@cloudscape-design/components';
import { useAuth0 } from '@auth0/auth0-react';
import './ProfileHeader.css';

export interface ProfileHeaderProps {
  subscriptionTier?: 'free' | 'standard' | 'premium';
  profileCompletionPercentage?: number;
  isVerified?: boolean;
}

// Mock data for demonstration - will be replaced with real API calls
const mockProfileData = {
  subscriptionTier: 'standard' as const,
  profileCompletionPercentage: 75,
  isVerified: true,
  memberSince: '2024-01-15',
  lastLogin: '2024-09-10',
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  subscriptionTier = mockProfileData.subscriptionTier,
  profileCompletionPercentage = mockProfileData.profileCompletionPercentage,
  isVerified = mockProfileData.isVerified,
}) => {
  const { user } = useAuth0();
  const [cachedProfilePicture, setCachedProfilePicture] = useState<string | null>(null);
  const [profilePictureError, setProfilePictureError] = useState(false);

  // Profile picture caching to prevent 429 errors
  useEffect(() => {
    if (user?.picture && user.sub) {
      const cacheKey = `profile_picture_${user.sub}`;
      const cacheTimeKey = `profile_picture_time_${user.sub}`;
      const cachedPicture = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      
      // Cache for 24 hours (86400000 ms)
      const cacheExpiry = 24 * 60 * 60 * 1000;
      const now = Date.now();
      
      if (cachedPicture && cacheTime && (now - parseInt(cacheTime)) < cacheExpiry) {
        setCachedProfilePicture(cachedPicture);
      } else {
        // Test if the image URL is accessible before caching
        const img = new Image();
        img.onload = () => {
          setCachedProfilePicture(user.picture!);
          localStorage.setItem(cacheKey, user.picture!);
          localStorage.setItem(cacheTimeKey, now.toString());
          setProfilePictureError(false);
        };
        img.onerror = () => {
          setProfilePictureError(true);
          // Clear invalid cache
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(cacheTimeKey);
        };
        img.src = user.picture;
      }
    }
  }, [user?.picture, user?.sub]);

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'green';
      case 'standard':
        return 'blue';
      default:
        return 'grey';
    }
  };

  const getTierDisplayName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  };

  const handleUploadPhoto = () => {
    // TODO: Implement photo upload functionality
    console.log('Upload photo clicked');
  };

  return (
    <div className="profile-header-content">
      {/* Cover Photo Area */}
      <div className="profile-cover-section">
        <div className="profile-cover-photo">
          {/* Placeholder for cover photo */}
        </div>
      </div>

      {/* Main Profile Info */}
      <Box padding={{ horizontal: 'l', vertical: 'm' }}>
          <SpaceBetween size="l">
            <div className="profile-main-info">
              <SpaceBetween direction="horizontal" size="m" alignItems="center">
                {/* Profile Picture */}
                <div className="profile-picture-container">
                  <img
                    src={cachedProfilePicture || '/public/PortraitPlaceholder.png'}
                    alt="Profile"
                    className="profile-picture-large"
                    onError={() => setProfilePictureError(true)}
                  />
                  <Button
                    variant="icon"
                    iconName="edit"
                    className="profile-picture-edit"
                    onClick={handleUploadPhoto}
                    ariaLabel="Upload profile picture"
                  />
                </div>

                {/* User Info */}
                <div className="profile-user-info">
                  <SpaceBetween size="xs">
                    <div className="profile-name-section">
                      <SpaceBetween direction="horizontal" size="s" alignItems="center">
                        <h2 className="profile-name">{user?.name || 'User Name'}</h2>
                        {isVerified && (
                          <StatusIndicator type="success">
                            Verified
                          </StatusIndicator>
                        )}
                      </SpaceBetween>
                    </div>

                    <p className="profile-email">{user?.email || 'user@example.com'}</p>

                    <div className="profile-badges">
                      <SpaceBetween direction="horizontal" size="xs">
                        <Badge color={getTierBadgeColor(subscriptionTier)}>
                          {getTierDisplayName(subscriptionTier)} Plan
                        </Badge>
                        <Badge color="grey">
                          Member since {new Date(mockProfileData.memberSince).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </Badge>
                      </SpaceBetween>
                    </div>
                  </SpaceBetween>
                </div>
              </SpaceBetween>
            </div>

            {/* Profile Completion */}
            <div className="profile-completion-section">
              <SpaceBetween size="s">
                <div className="profile-completion-header">
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <span className="profile-completion-label">
                      Profile Completion
                    </span>
                    <Badge color={profileCompletionPercentage >= 80 ? 'green' : 'red'}>
                      {profileCompletionPercentage}%
                    </Badge>
                  </SpaceBetween>
                </div>
                <ProgressBar
                  value={profileCompletionPercentage}
                  description={
                    profileCompletionPercentage < 100
                      ? 'Complete your profile to unlock all features'
                      : 'Profile complete!'
                  }
                />
              </SpaceBetween>
            </div>

            {/* Quick Stats */}
            <div className="profile-quick-stats">
              <SpaceBetween direction="horizontal" size="m">
                <div className="profile-stat-item">
                  <div className="profile-stat-value">12</div>
                  <div className="profile-stat-label">Reports Generated</div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-value">3</div>
                  <div className="profile-stat-label">Days Since Last Login</div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-value">85%</div>
                  <div className="profile-stat-label">Feature Utilization</div>
                </div>
              </SpaceBetween>
            </div>
          </SpaceBetween>
        </Box>
      </div>
  );
};
