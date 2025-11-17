// AuthenticatedPage.tsx
import React, { Fragment, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Children } from 'react';
import { LoginModal } from './LoginModal';
import { Oval } from 'react-loader-spinner';
import { RedirectAPI, PAGE_PATH, LOCAL_STORAGE_KEYS, save } from '@bpenwell/instantlyanalyze-module';

export const AuthenticatedPage = (props: any) => {
  const { children } = props;
  const {
    isAuthenticated,
    isLoading,
    error,
    loginWithPopup,
  } = useAuth0();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const redirectApi = new RedirectAPI();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingIn) {
      // Save current URL as redirect destination
      const currentPath = window.location.pathname + window.location.search;
      save(LOCAL_STORAGE_KEYS.REDIRECT_AFTER_LOGIN, currentPath);

      // Redirect to login page
      redirectApi.redirectToPage(PAGE_PATH.LOGIN);
    }
  }, [isAuthenticated, isLoading, isLoggingIn]);

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      openRedirect();
    }, 100);
  };

  const openRedirect = async () => {
    await loginWithPopup();
    setTimeout(() => {
      setIsLoggingIn(false);
    }, 500);
  };

  if (isLoading && !isLoggingIn) {
    return (
      <div className="loading-spinner">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (!isAuthenticated || isLoggingIn || error) {
    return (
      <Fragment>
        {Children.map(children, (child) => (
          <Fragment key={child.id}>{child}</Fragment>
        ))}
        <LoginModal login={handleLoginClick} />
      </Fragment>
    );
  }

  // Authenticated view
  return (
    <Fragment>
      {Children.map(children, (child) => (
        <Fragment key={child.id}>{child}</Fragment>
      ))}
    </Fragment>
  );
};