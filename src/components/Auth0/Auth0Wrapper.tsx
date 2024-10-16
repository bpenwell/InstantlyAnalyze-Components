// Auth0ProviderWrapper.tsx
import React, { PropsWithChildren } from 'react';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';

interface Auth0WrapperProps extends Auth0ProviderOptions {}

// Wrapper Component without explicitly passing children as props
export const Auth0ProviderWrapper: React.FC<PropsWithChildren<Auth0WrapperProps>> = ({
  domain,
  clientId,
  authorizationParams,
  children,
  ...rest
}) => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        ...authorizationParams,
        redirect_uri: window.location.origin,
      }}
      {...rest}
    >
      {children}
    </Auth0Provider>
  );
};