import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LOCAL_STORAGE_KEYS, PAGE_PATH, useLocalStorage } from "@bpenwell/rei-module";
import {
  TopNavigation,
  TopNavigationProps,
  Modal,
  RadioGroup,
  Button,
} from "@cloudscape-design/components";
import { applyMode, applyDensity, Density, Mode } from '@cloudscape-design/global-styles';
import { Separator } from "../Separator/Separator";

export const Header: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const [appMode, setAppMode] = useLocalStorage<Mode>(LOCAL_STORAGE_KEYS.APP_MODE, Mode.Light);
  const [appDensity, setAppDensity] = useLocalStorage<Density>(LOCAL_STORAGE_KEYS.APP_DENSITY, Density.Comfortable);
  
  // State to manage modal visibility and theme selection
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModeChange = (event: any) => {
    // apply global css settings
    applyMode(event.detail.value);
    setAppMode(event.detail.value)
  };
  const handleDensityChange = (event: any) => {
    // apply global css settings
    applyDensity(event.detail.value);
    setAppDensity(event.detail.value)
  };

  if (isLoading) {
    return (
    <TopNavigation
      identity={{
        href: PAGE_PATH.HOME,
        title: 'Instantly AAnalyze',
        logo: {
          src: '/public/logo69.png',
          alt: 'Instantly Analyze',
        },
      }}
      i18nStrings={{
        searchIconAriaLabel: 'Search',
        searchDismissIconAriaLabel: 'Close search',
      }}
    />);
  }

  // Define utilities for the TopNavigation component
  const authUtility: TopNavigationProps.Utility[] = [];
  authUtility.push({
    type: 'button',
    iconName: 'settings',
    onClick: (event: any) => {
      event.preventDefault();
      setIsModalVisible(true); // Show the modal when settings is clicked
    },
  });

  if (isAuthenticated && user) {
    authUtility.push({
      type: 'menu-dropdown',
      iconName: 'user-profile-active',
      text: user.name!,
      items: [
        { id: 'profile', text: 'Profile', href: PAGE_PATH.PROFILE },
        { id: 'logout', text: 'Log out' },
      ],
      onItemClick: (event: any) => {
        if (event.detail.id === 'logout') {
          event.preventDefault();
          logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
        }
      },
    });
  } else {
    authUtility.push({
      type: 'menu-dropdown',
      iconName: 'user-profile',
      items: [{ id: 'login', text: 'Login' }],
      onItemClick: (event: any) => {
        if (event.detail.id === 'login') {
          event.preventDefault();
          loginWithRedirect();
        }
      },
    });
  }

  return (
    <div>
      <TopNavigation
        identity={{
          href: PAGE_PATH.HOME,
          title: 'Instantly Analyze',
          logo: {
            src: '/public/logo69.png',
            alt: 'Instantly Analyze',
          },
        }}
        i18nStrings={{
          searchIconAriaLabel: 'Search',
          searchDismissIconAriaLabel: 'Close search',
        }}
        // Ensure a new array is passed by directly assigning authUtility
        utilities={authUtility}
      />
      {/* Modal for theme selection */}
      <Modal
        onDismiss={() => setIsModalVisible(false)}
        visible={isModalVisible}
        closeAriaLabel="Close modal"
        header="Select Theme"
        footer={
          <Button onClick={() => setIsModalVisible(false)} variant="primary">
            Close
          </Button>
        }
      >
        <RadioGroup
          onChange={handleModeChange}
          value={appMode}
          items={[
            { value: Mode.Light, label: 'Light' },
            { value: Mode.Dark, label: 'Dark' },
          ]}
        />
        <Separator width={100}/>
        <RadioGroup
          onChange={handleDensityChange}
          value={appDensity}
          items={[
            { value: Density.Compact, label: 'Compact' },
            { value: Density.Comfortable, label: 'Comfortable' },
          ]}
        />
      </Modal>
    </div>
  );
};