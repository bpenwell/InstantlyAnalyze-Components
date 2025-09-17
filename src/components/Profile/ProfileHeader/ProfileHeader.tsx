import React, { useState, useEffect } from 'react';
import {
  Box,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useAuth0 } from '@auth0/auth0-react';
import { useProfilePictureCache } from '../../../utils/useProfilePictureCache';
import './ProfileHeader.css';

export interface ProfileHeaderProps {
  subscriptionTier: 'free' | 'standard' | 'premium';
  isVerified?: boolean;
}


export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  subscriptionTier,
}) => {
  const { user } = useAuth0();
  const { cachedProfilePicture, isLoading, error } = useProfilePictureCache();


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
                  {isLoading ? (
                    <div className="profile-picture-large profile-picture-loading">
                      <div className="profile-picture-spinner"></div>
                    </div>
                  ) : (
                    <img
                      src={cachedProfilePicture || '/public/PortraitPlaceholder.png'}
                      alt="Profile"
                      className="profile-picture-large"
                      onError={(e) => {
                        console.warn('Profile picture failed to load, using placeholder');
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/public/PortraitPlaceholder.png') {
                          target.src = '/public/PortraitPlaceholder.png';
                        }
                      }}
                    />
                  )}
                </div>

                {/* User Info */}
                <div className="profile-user-info">
                  <SpaceBetween size="xs">
                    <div className="profile-name-section">
                      <SpaceBetween direction="horizontal" size="s" alignItems="center">
                        <h2 className="profile-name">{user?.name || 'User Name'}</h2>
                      </SpaceBetween>
                    </div>

                    <p className="profile-email">{user?.email || 'user@example.com'}</p>
                  </SpaceBetween>
                </div>
              </SpaceBetween>
            </div>
          </SpaceBetween>
        </Box>
      </div>
  );
};
