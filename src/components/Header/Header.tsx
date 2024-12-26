import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  BackendAPI,
  IUserConfigs,
  LOCAL_STORAGE_KEYS,
  PAGE_PATH,
  RedirectAPI,
  useLocalStorage,
} from '@bpenwell/instantlyanalyze-module';
import {
  Button,
  TextContent,
} from '@cloudscape-design/components';

// Material UI components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
/*import Button from '@mui/material/Button';*/
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

// Material UI icons
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';

// (Optional) If still using Cloudscape’s theme/density methods
import { applyMode, applyDensity, Density, Mode } from '@cloudscape-design/global-styles';

// Our custom CSS
import './Header.css';
import { useAppContext } from '../../utils/AppContextProvider';

export const Header: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const [appMode, setAppMode] = useLocalStorage<Mode>(
    LOCAL_STORAGE_KEYS.APP_MODE,
    Mode.Light
  );
  const [appDensity, setAppDensity] = useLocalStorage<Density>(
    LOCAL_STORAGE_KEYS.APP_DENSITY,
    Density.Comfortable
  );
  const { userConfig, setUserConfig } = useAppContext();

  const redirectApi: RedirectAPI = new RedirectAPI();
  const backendAPI: BackendAPI = new BackendAPI();

  // Theme & density modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Profile menu anchor
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Handlers
  const openSettingsModal = () => setIsModalVisible(true);
  const closeSettingsModal = () => setIsModalVisible(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as Mode;
    applyMode(newMode);
    setAppMode(newMode);
  };

  const handleDensityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDensity = event.target.value as Density;
    applyDensity(newDensity);
    setAppDensity(newDensity);
  };

  useEffect(() => {
    /*
    FOR DEBUGGING THE HEADER INITIALIZATION ISSUE
    console.log(`isLoading: ${isLoading}`);
    console.log(`isAuthenticated: ${isAuthenticated}`);
    console.log(`user: `, user);*/

    const fetchUserConfigs = async () => {
      if (isAuthenticated && user) {
        const userId = user.sub;
        const configs = await backendAPI.getUserConfigs(userId);

        if (configs.message === 'User not found') {
          const newUserConfig = await backendAPI.createUserConfig(userId);
          setUserConfig(newUserConfig);
        } else {
          setUserConfig(configs);
        }
      }
    };

    fetchUserConfigs();
  }, [isAuthenticated, user]);

  // If Auth0 is still loading, show a placeholder
  if (isLoading) {
    return (
      <AppBar position="static" className="custom-app-bar" elevation={0}>
        <Toolbar className="custom-toolbar">
          <Box className="left-section">
            <img
              src="/public/logo69.png"
              alt="Instantly Analyze"
              className="app-logo"
            />
          </Box>
          <Typography variant="h6" className="toolbar-title">
            Instantly Analyze
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static" className="custom-app-bar" elevation={0}>
        <Toolbar className="custom-toolbar">
          {/* Left: Logo */}
          <Box
            className="left-section"
            onClick={() => redirectApi.redirectToPage(PAGE_PATH.HOME)}
          >
            <img
              src="/public/logo69.png"
              alt="Instantly Analyze"
              className="app-logo"
            />
          </Box>

          {/* Center: Nav buttons */}
          <Box className="center-section">
            <Button
              variant="inline-link"
              className="nav-button"
              onClick={() => redirectApi.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_HOME)}
            >
              Rental Reports
            </Button>
            <Button
              variant="inline-link"
              className="nav-button"
              onClick={() => redirectApi.redirectToPage(PAGE_PATH.MARKET_REPORTS)}
            >
              Market Reports
            </Button>
          </Box>

          {/* Right: Settings & User profile */}
          <Box className="right-section">
            {/* 
                If user is authenticated and status == 'free',
                display a special "Go Pro" button 
            */}
            {isAuthenticated && userConfig?.status === 'free' && (
              <Button
                className="go-pro-button"
                href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
              >
                Go Pro
              </Button>
            )}

            <IconButton onClick={openSettingsModal} className="settings-icon">
              <SettingsIcon
                // Invert icon color if dark mode
                sx={[ appMode === Mode.Dark && { filter: 'invert(1)' }]}
              />
            </IconButton>

            {isAuthenticated && user && userConfig ? (
              <>
                <IconButton onClick={handleOpenUserMenu} className="account-icon">
                  <AccountCircle
                    // Invert icon color if dark mode
                    sx={[ appMode === Mode.Dark && { filter: 'invert(1)' }]}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      window.location.href = redirectApi.createRedirectUrl(PAGE_PATH.PROFILE);
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      logout({ logoutParams: { returnTo: window.location.origin } });
                    }}
                  >
                    Log out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                className="nav-button"
                onClick={(e) => {
                  e.preventDefault();
                  loginWithRedirect();
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Theme & density dialog */}
      <Dialog open={isModalVisible} onClose={closeSettingsModal} maxWidth="xs" fullWidth>
        <DialogTitle>Select Theme</DialogTitle>
        <DialogContent dividers>
          <RadioGroup value={appMode} onChange={handleModeChange}>
            <FormControlLabel value={Mode.Light} control={<Radio />} label="Light" />
            <FormControlLabel value={Mode.Dark} control={<Radio />} label="Dark" />
          </RadioGroup>
          <Divider sx={{ my: 2 }} />
          <RadioGroup value={appDensity} onChange={handleDensityChange}>
            <FormControlLabel
              value={Density.Compact}
              control={<Radio />}
              label="Compact"
            />
            <FormControlLabel
              value={Density.Comfortable}
              control={<Radio />}
              label="Comfortable"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSettingsModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};