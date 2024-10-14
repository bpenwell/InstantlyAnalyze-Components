import React, { Dispatch, Fragment } from 'react';
import {
  RedirectAPI,
  PAGE_PATH,
} from '@bpenwell/rei-module';
import { Children } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Primary UI component for user interaction
 */
export const AuthenticatedPage = (props: any) => {
  const { children } = props;
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if(!isAuthenticated) {
    loginWithRedirect();
    return <div/>;
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
