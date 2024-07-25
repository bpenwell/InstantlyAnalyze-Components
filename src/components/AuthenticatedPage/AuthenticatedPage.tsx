import React, { Dispatch, Fragment } from 'react';
import {
  RedirectAPI,
  PAGE_PATH,
  IUserData
} from '@bpenwell/rei-module';
import { Children } from 'react';

export interface IAuthenticatedPageProps {
  user?: IUserData,
  setUser?: (Dispatch<React.SetStateAction<IUserData | undefined>>),
};

/**
 * Primary UI component for user interaction
 */
export const AuthenticatedPage = (props: any) => {
  const { user, children } = props;
  if(!user) {
    const redirectApi: RedirectAPI = new RedirectAPI();
    redirectApi.redirectToPage(PAGE_PATH.LOGIN);
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
