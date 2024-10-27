// AuthenticatedPage.jsx
import React, { Fragment, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Children } from 'react';
import { LoginModal } from './LoginModal';

/**
 * Primary UI component for user interaction
 */
export const AuthenticatedPage = (props: any) => {
  const { children } = props;
  const { user, isAuthenticated, isLoading, error, loginWithPopup } = useAuth0();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    // While Auth0 is loading, show a loading indicator
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!isAuthenticated || isLoggingIn || error) {
    return (
      <Fragment>
        {Children.map(children, (child) => (
          <Fragment>{child}</Fragment>
        ))}
        <LoginModal loginWithPopup={handleLoginClick} />
      </Fragment>
    );
  }
    
  return (
    <Fragment>
      {Children.map(children, (child) => (
        <Fragment>{child}</Fragment>
      ))}
    </Fragment>
  );
};