import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  BackendAPI,
  LOCAL_STORAGE_KEYS,
  PAGE_PATH,
  RedirectAPI,
  useLocalStorage,
} from '@bpenwell/instantlyanalyze-module';
import {
  Button,
  SpaceBetween,
  TextContent,
} from '@cloudscape-design/components';

// Material UI components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

// MUI for theme/density (optional)
import { applyMode, applyDensity, Density, Mode } from '@cloudscape-design/global-styles';

// MUI icons
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';

// Extra MUI components for theme selection
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import './Header.css';
import { useAppContext } from '../../utils/AppContextProvider';
import { Menu, MenuItem } from '@mui/material';
import { FeedbackModal } from '../FeedbackModal/FeedbackModal';

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

  const {
    userExists,
    setUserConfig,
    isPaidMember,
    setIsUserLoading,
  } = useAppContext();
  const redirectApi: RedirectAPI = new RedirectAPI();
  const backendAPI: BackendAPI = new BackendAPI();

  // Theme & density modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // User menu
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  /* ================== Handlers ================== */
  const openSettingsModal = () => setIsModalVisible(true);
  const closeSettingsModal = () => setIsModalVisible(false);

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

  // User menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Pull user config on mount/auth
  React.useEffect(() => {
    const fetchUserConfigs = async () => {
      if (isAuthenticated && user && !userExists()) {
        const userId = user.sub;
        const configs = await backendAPI.getUserConfigs(userId);
        setIsUserLoading(true);

        if (configs.message === 'User not found') {
          const newUserConfig = await backendAPI.createUserConfig(userId);
          setUserConfig(newUserConfig);
          setIsUserLoading(false);
        } else {
          setUserConfig(configs);
          setIsUserLoading(false);
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
            <TextContent>
              <h2
                className="logo-text"
                onClick={() => redirectApi.redirectToPage(PAGE_PATH.HOME)}
              >
                InstantlyAnalyze
              </h2>
            </TextContent>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      {/* MAIN HEADER */}
      <AppBar position="static" className="custom-app-bar" elevation={0}>
        <Toolbar className="custom-toolbar">
          {/* Left: Logo */}
          <Box className="left-section">
            <TextContent>
              <h2
                className="logo-text"
                onClick={() => redirectApi.redirectToPage(PAGE_PATH.HOME)}
              >
                InstantlyAnalyze
              </h2>
            </TextContent>
          </Box>

          {/* Center: Nav */}
          <Box className="center-section">
            <Button
              variant="inline-link"
              className="nav-button"
              href={redirectApi.createRedirectUrl(PAGE_PATH.RENTAL_CALCULATOR_VIEW)}
            >
              Rental Reports
            </Button>
            <Button
              variant="inline-link"
              className="nav-button"
              href={redirectApi.createRedirectUrl(PAGE_PATH.ZILLOW_SCRAPER)}
            >
              Zillow Scraper
            </Button>
          </Box>

          {/* Right: Feedback, Settings, User */}
          <Box className="right-section">
            <SpaceBetween size='s' direction='horizontal'>
              {isAuthenticated && user && (
                <FeedbackModal />
              )}

              {isAuthenticated && !isPaidMember() && (
                <Button
                  className="go-pro-button"
                  href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
                >
                  Go Pro
                </Button>
              )}
            </SpaceBetween>

            <IconButton onClick={openSettingsModal} className="settings-icon">
              <SettingsIcon
                sx={[appMode === Mode.Dark && { filter: 'invert(1)' }]}
              />
            </IconButton>

            {isAuthenticated && user && userExists() ? (
              <>
                <IconButton onClick={handleOpenUserMenu} className="account-icon">
                  <AccountCircle
                    sx={[appMode === Mode.Dark && { filter: 'invert(1)' }]}
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
                Login/Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* THEME SETTINGS DIALOG */}
      <Dialog
        open={isModalVisible}
        onClose={closeSettingsModal}
        maxWidth="xs"
        fullWidth
      >
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
