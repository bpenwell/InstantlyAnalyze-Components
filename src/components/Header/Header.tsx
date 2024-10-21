import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PAGE_PATH } from "@bpenwell/rei-module";
import { TopNavigation, TopNavigationProps } from "@cloudscape-design/components";

export const Header: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  if (isLoading) {
    return (
    <TopNavigation
      identity={{
        href: '/',
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
    />);
  }

  // Remove useMemo to ensure the utilities array is recalculated on each render
  const authUtility: TopNavigationProps.Utility[] = [];
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
          logout();
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
          href: '/',
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
    </div>
  );
};
