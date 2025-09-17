import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ProfilePictureCache {
  base64Data: string;
  timestamp: number;
  originalUrl: string;
}

interface UseProfilePictureCacheReturn {
  cachedProfilePicture: string | null;
  isLoading: boolean;
  error: boolean;
  refreshProfilePicture: () => void;
}

/**
 * Custom hook for caching Auth0 profile pictures as base64 data
 * to prevent throttling issues and improve performance
 */
export const useProfilePictureCache = (): UseProfilePictureCacheReturn => {
  const { user } = useAuth0();
  const [cachedProfilePicture, setCachedProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Cache duration: 7 days (in milliseconds)
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

  /**
   * Converts an image URL to base64 data URL
   */
  const convertImageToBase64 = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS for external images
      
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('Image loading timeout'));
      }, 10000); // 10 second timeout
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert to base64 data URL
          const dataURL = canvas.toDataURL('image/jpeg', 0.8); // 0.8 quality for smaller size
          resolve(dataURL);
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }, []);

  /**
   * Gets cached profile picture from localStorage
   */
  const getCachedProfilePicture = useCallback((userId: string): ProfilePictureCache | null => {
    try {
      const cacheKey = `profile_picture_cache_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cacheData: ProfilePictureCache = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - cacheData.timestamp < CACHE_DURATION) {
          return cacheData;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (err) {
      console.warn('Error reading cached profile picture:', err);
    }
    
    return null;
  }, []);

  /**
   * Saves profile picture to localStorage as base64
   */
  const saveCachedProfilePicture = useCallback((userId: string, base64Data: string, originalUrl: string): void => {
    const cacheKey = `profile_picture_cache_${userId}`;
    const cacheData: ProfilePictureCache = {
      base64Data,
      timestamp: Date.now(),
      originalUrl
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Error saving cached profile picture:', err);
      // If localStorage is full, try to clear old cache entries
      try {
        const keys = Object.keys(localStorage);
        const profilePictureKeys = keys.filter(key => key.startsWith('profile_picture_cache_'));
        
        // Remove oldest entries if we have more than 10 cached pictures
        if (profilePictureKeys.length > 10) {
          const entries = profilePictureKeys.map(key => {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              return { key, timestamp: parsed.timestamp };
            }
            return null;
          }).filter(Boolean).sort((a, b) => a!.timestamp - b!.timestamp);
          
          // Remove oldest 5 entries
          entries.slice(0, 5).forEach(entry => {
            localStorage.removeItem(entry!.key);
          });
          
          // Try saving again
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        }
      } catch (cleanupErr) {
        console.warn('Error during cache cleanup:', cleanupErr);
      }
    }
  }, []);

  /**
   * Loads and caches profile picture
   */
  const loadProfilePicture = useCallback(async (userId: string, pictureUrl: string): Promise<void> => {
    setIsLoading(true);
    setError(false);

    try {
      // Check if we have a valid cached version
      const cached = getCachedProfilePicture(userId);
      if (cached && cached.originalUrl === pictureUrl) {
        setCachedProfilePicture(cached.base64Data);
        setIsLoading(false);
        return;
      }

      // Convert image to base64
      const base64Data = await convertImageToBase64(pictureUrl);
      
      // Cache the base64 data
      saveCachedProfilePicture(userId, base64Data, pictureUrl);
      
      // Set the cached picture
      setCachedProfilePicture(base64Data);
    } catch (err) {
      console.warn('Error loading profile picture:', err);
      setError(true);
      
      // Fallback to original URL if base64 conversion fails
      setCachedProfilePicture(pictureUrl);
    } finally {
      setIsLoading(false);
    }
  }, [convertImageToBase64, getCachedProfilePicture, saveCachedProfilePicture]);

  /**
   * Refreshes the profile picture cache
   */
  const refreshProfilePicture = useCallback(() => {
    if (user?.picture && user.sub) {
      // Clear existing cache
      const cacheKey = `profile_picture_cache_${user.sub}`;
      localStorage.removeItem(cacheKey);
      
      // Reload the picture
      loadProfilePicture(user.sub, user.picture);
    }
  }, [user?.picture, user?.sub, loadProfilePicture]);

  // Load profile picture when user changes
  useEffect(() => {
    if (user?.picture && user.sub) {
      loadProfilePicture(user.sub, user.picture);
    } else {
      setCachedProfilePicture(null);
      setError(false);
      setIsLoading(false);
    }
  }, [user?.picture, user?.sub, loadProfilePicture]);

  return {
    cachedProfilePicture,
    isLoading,
    error,
    refreshProfilePicture
  };
};
