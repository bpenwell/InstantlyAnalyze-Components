import React, { Fragment } from 'react';
import './button.css';
import {
  RedirectAPI,
  PAGE_PATH
} from '@bpenwell/rei-module';
import { Children } from 'react';

export interface IAuthenticatedPageProps {
  token: String,
  setToken: (React.SetStateAction<String | undefined>) => void,
};

/**
 * Primary UI component for user interaction
 */
export const AuthenticatedPage = (props: IAuthenticatedPageProps) => {
  const { token, children } = props;
  if(!token) {
    const redirectApi: RedirectAPI = new RedirectAPI();
    redirectApi.redirectToPage(PAGE_PATH.LOGIN);
    return undefined;
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
