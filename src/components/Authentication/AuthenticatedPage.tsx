// AuthenticatedPage.jsx
import React, { Fragment, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Children } from 'react';
import { LoginModal } from './LoginModal';
import { Oval } from 'react-loader-spinner';

/**
 * Primary UI component for user interaction
 */
export const AuthenticatedPage = (props: any) => {
  const { children } = props;
  const { isAuthenticated, isLoading, error, loginWithPopup } = useAuth0();
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
    return (
      <div className="loading-spinner">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
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
          <Fragment>{child}</Fragment>
        ))}
        <LoginModal login={handleLoginClick} />
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