import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  SpaceBetween,
  Box,
  TextContent,
} from '@cloudscape-design/components';
import { Mode } from '@cloudscape-design/global-styles';
import { LOCAL_STORAGE_KEYS, useLocalStorage } from '../../utils/useLocalStorage';
import { useAppContext } from '../../utils/AppContextProvider';
import './LoginModal.css';
import { useAppContext } from '../../utils/AppContextProvider';

export interface ILoginModalProps {
  login: () => Promise<void>;
}

export const LoginModal = (props: ILoginModalProps) => {
  const { login } = props;
  const { isAuthenticated, user } = useAuth0();
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();
  const [showModal, setShowModal] = useState(true); // Control modal visibility

  const handleLogin = async () => {
    console.log('handleLogin');
    try {
      await login();
      if (isAuthenticated) {
        console.log('User is authenticated:', user);
        // Hide the modal after successful login
        setShowModal(false);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (!showModal) {
    return null; // Don't render the modal if it's hidden
  }

  return (
    <div className={`login-overlay`}>
      <Box textAlign="center" padding={{ top: "l" }} className={`login-background-container`}>
        <div className={`login-background ${appMode === Mode.Light ? 'login-background-light' : 'login-background-dark'}`}>
          <TextContent className={`info-${appMode}`}>
            <SpaceBetween direction="vertical" size="xxl">
              <h1 className={`info-${appMode}`}>
                Automate Your On-Market Deal Finding.
              </h1>
              <p className={`info-${appMode}`}>
                Our platform empowers you to scan entire markets, dive deep into specific deals with advanced analysis features, and stay ahead with AI enhancements coming soon.
              </p>
              <Button iconName="external" variant="primary" onClick={handleLogin}>
                Login/Sign Up
              </Button>
            </SpaceBetween>
          </TextContent>
        </div>
      </Box>
    </div>
  );
};