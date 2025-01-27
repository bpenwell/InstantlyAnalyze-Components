import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  SpaceBetween,
  Box,
  TextContent,
} from '@cloudscape-design/components';
import { Mode } from '@cloudscape-design/global-styles';
import { LOCAL_STORAGE_KEYS, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import './LoginModal.css';

export interface ILoginModalProps {
  login: () => Promise<void>;
}

export const LoginModal = (props: ILoginModalProps) => {
  const { login } = props;
  const { isAuthenticated, user } = useAuth0();
  const [appMode] = useLocalStorage<Mode>(LOCAL_STORAGE_KEYS.APP_MODE, Mode.Light);
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
                Get a massive edge up on the competition by hiring our <strong>eAgent</strong>.
              </h1>
              <p className={`info-${appMode}`}>
                See why our eAgent will revolutionize your job as an investor, help you pick the best strategy to pursue on a deal, all while providing world-class analysis tools to inform your decision.
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