import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';
import { useProfilePictureCache } from '../../utils/useProfilePictureCache';

interface CachedAvatarProps extends Omit<AvatarProps, 'src'> {
  src?: string;
  fallbackSrc?: string;
}

/**
 * Avatar component that uses cached profile pictures to prevent throttling
 */
export const CachedAvatar: React.FC<CachedAvatarProps> = ({ 
  src, 
  fallbackSrc = '/public/PortraitPlaceholder.png',
  ...props 
}) => {
  const { cachedProfilePicture, isLoading } = useProfilePictureCache();

  // Use cached picture if available, otherwise fall back to original src or placeholder
  const imageSrc = cachedProfilePicture || src || fallbackSrc;

  return (
    <Avatar
      {...props}
      src={imageSrc}
      sx={{
        ...props.sx,
        // Add subtle loading indicator
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}
    />
  );
};

