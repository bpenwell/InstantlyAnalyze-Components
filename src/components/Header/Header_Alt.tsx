import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useAuth0 } from '@auth0/auth0-react';

export const Header_Alt: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Dynamically display logo or user info based on authentication status */}
        {isAuthenticated ? (
          <>
            <Avatar
              src={user?.picture}
              alt={user?.name}
              sx={{ marginRight: 2 }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {user?.name}
            </Typography>
            <Button color="inherit" onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};