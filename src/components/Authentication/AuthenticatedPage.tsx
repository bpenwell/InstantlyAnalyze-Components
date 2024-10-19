import React, { Dispatch, Fragment } from 'react';
import {
  RedirectAPI,
  PAGE_PATH,
  auth0Props,
} from '@bpenwell/rei-module';
import { Children } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Primary UI component for user interaction
 */
export const AuthenticatedPage = (props: any) => {
  const { children } = props;
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  console.log('AuthenticatedPage', { user, isAuthenticated, isLoading });

  if (isLoading) {
    // While Auth0 is loading, you can show a loading indicator
    return <div className="loading-spinner"></div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, initiate login
    loginWithRedirect();
    return <></>;
  }

  return (
    <Fragment>
      {Children.map(children, child =>
        <Fragment>
          {child}
        </Fragment>
      )}
    </Fragment>
  );
};
