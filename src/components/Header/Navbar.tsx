import React, { useEffect, useState } from "react";
import "../../index.css";
import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  BackendAPI,
  PAGE_PATH,
  RedirectAPI,
  FeedbackType,
} from "@bpenwell/instantlyanalyze-module";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppContext } from "../../utils/AppContextProvider";
import { Avatar, Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { FeedbackModal } from "../FeedbackModal/FeedbackModal";
import { CachedAvatar } from "../Common/CachedAvatar";

/**
 * Main Navbar component. Shows:
 * - A "full" navbar at the top (on certain pages)
 * - A "thin" sticky navbar once scrolled
 */
export default function Navbar() {
  const isFullHeaderApplicable =
    window.location.pathname === PAGE_PATH.HOME ||
    window.location.pathname === PAGE_PATH.SUBSCRIBE;

  // Track scroll position to decide whether to show big or thin navbar
  const [scrollY, setScrollY] = useState(0);
  const [displayThin, setDisplayThin] = useState(
    isFullHeaderApplicable ? false : true
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Only use full header on home and subscribe pages
      const shouldDisplayFullHeader =
        isFullHeaderApplicable ? window.scrollY > 102 : true;
      const shouldDisplayThinHeader =
        isFullHeaderApplicable ? window.scrollY < 100 : false;

      if (shouldDisplayFullHeader && !displayThin) {
        setDisplayThin(true);
      } else if (shouldDisplayThinHeader && displayThin) {
        setDisplayThin(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  // Auth & user config logic
  const { user, loginWithPopup, isAuthenticated, isLoading } = useAuth0();
  const { userExists, setUserConfig, setIsUserLoading, hasSeenWelcomePage } = useAppContext();
  const backendAPI: BackendAPI = new BackendAPI();
  const redirectApi: RedirectAPI = new RedirectAPI();

  useEffect(() => {
    const fetchUserConfigs = async () => {
      if (isAuthenticated && user && !userExists()) {
        const userId = user.sub;
        const configs = await backendAPI.getUserConfigs(userId);
        setIsUserLoading(true);

        if (configs.message === "User not found") {
          const newUserConfig = await backendAPI.createUserConfig(userId);
          setUserConfig(newUserConfig);
          
          // Redirect new users to welcome page only if not already there
          if (window.location.pathname !== PAGE_PATH.WELCOME) {
            redirectApi.redirectToPage(PAGE_PATH.WELCOME);
          }
        } else {
          setUserConfig(configs);
          // Check if user hasn't seen welcome page and redirect them (using configs directly)
          if (!configs.hasSeenWelcomePage && window.location.pathname !== PAGE_PATH.WELCOME) {
            redirectApi.redirectToPage(PAGE_PATH.WELCOME);
          }
        }
        setIsUserLoading(false);
      }
    };
    fetchUserConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Always show sticky navbar as requested
  if (isLoading) {
    return <LoadingPlaceholder />;
  } else {
    return <StickyNavbar />;
  }
}

/**
 * The large "home" navbar at the top of certain pages.
 */
function HomeNavbar() {
  const path = window.location.pathname;
  const redirectApi: RedirectAPI = new RedirectAPI();

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for product menu anchor & user menu anchor
  const [anchorElProducts, setAnchorElProducts] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.Bug);

  const { getAppMode, setAppMode, userExists } = useAppContext();
  const { user, loginWithPopup, isAuthenticated, logout } = useAuth0();
  const appMode = getAppMode();

  // Toggle theme
  const themeChange = () => {
    const newMode = appMode === Mode.Light ? Mode.Dark : Mode.Light;
    setAppMode(newMode);
    applyMode(newMode);
  };
  const logo = appMode === Mode.Light ? "logo_light.png" : "logo_dark.png";

  // Handle "Products" menu
  const handleOpenProductsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProducts(event.currentTarget);
  };
  const handleCloseProductsMenu = () => {
    setAnchorElProducts(null);
  };

  // Handle user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Background logic for the home page
  const bgImg = appMode === Mode.Light ? "grid_bg.png" : "grid_bg_dark.png";
  const bg =
    path === PAGE_PATH.HOME || path === PAGE_PATH.SUBSCRIBE
      ? {
          backgroundImage: `url("/public/${bgImg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }
      : {};

  // Navbar classes
  const navbarClasses = `
    rounded-3xl
    mx-auto
    border border-gray-400
    dark:border-none
    transition-all
    duration-300
    h-20
  `;

  return (
    <div className={appMode}>
      <header 
        className="flex justify-center py-4" 
        style={{
          ...bg,
          backgroundColor: (path === PAGE_PATH.HOME && window.scrollY < 100) 
            ? 'transparent' 
            : appMode === Mode.Dark 
              ? 'var(--color-background-layout-main-5ilwcb, #ffffff)' 
              : '#ffffff'
        }}
      >
        <nav
          aria-label="Global"
          style={{ 
            backdropFilter: "blur(12px)", 
            backgroundColor: appMode === Mode.Dark 
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${appMode === Mode.Dark 
              ? 'rgba(2, 151, 251, 0.45)'
              : 'rgba(2, 151, 251, 0.35)'}`,
            boxShadow: appMode === Mode.Dark
              ? '0 8px 32px rgba(2, 151, 251, 0.1)'
              : '0 8px 32px rgba(2, 151, 251, 0.03)'
          }}
          className={`${navbarClasses}`}
        >
          {/* Top row: logo, desktop nav items, profile, mobile menu */}
          <div className="flex items-center justify-between px-4 h-full">
            {/* Left side: logo + desktop nav */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div
                className="flex mx-2 my-2 items-center"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <a href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)}>
                  <img
                    alt=""
                    src={`/public/${logo}`}
                    style={{ maxHeight: "50px", width: "auto" }}
                  />
                </a>
              </div>
              {/* Desktop nav items */}
              <div className="hidden lg:flex items-center space-x-8 text-gray-900 dark:text-white">
                {/* Analyze */}
                <span
                  className="text-base font-semibold cursor-pointer"
                  onClick={handleOpenProductsMenu}
                >
                  Analyze
                </span>
                <Menu
                  anchorEl={anchorElProducts}
                  open={Boolean(anchorElProducts)}
                  onClose={handleCloseProductsMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor:
                        appMode === Mode.Light ? "white" : "rgb(38,38,38)",
                      color: appMode === Mode.Light ? "black" : "white",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseProductsMenu();
                      window.location.href = redirectApi.createRedirectUrl(
                        PAGE_PATH.RENTAL_CALCULATOR_HOME
                      );
                    }}
                  >
                    Properties
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseProductsMenu();
                      window.location.href = redirectApi.createRedirectUrl(
                        PAGE_PATH.ZILLOW_SCRAPER
                      );
                    }}
                  >
                    Markets
                  </MenuItem>
                </Menu>

                <a
                  href={redirectApi.createRedirectUrl(PAGE_PATH.BLOG)}
                  className="text-base font-semibold"
                >
                  Blog
                </a>
                <a
                  href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
                  className="text-base font-semibold"
                >
                  Pricing
                </a>
                <a
                  className="text-base font-semibold cursor-pointer"
                  onClick={() => {
                    setFeedbackType(FeedbackType.Bug);
                    setShowFeedbackModal(true);
                  }}
                >
                  Feedback
                </a>
              </div>
            </div>

            {/* Right side: Auth/profile + mobile menu */}
            <div className="flex items-center space-x-2">
              {/* Mobile menu button (hamburger) - only show on mobile */}
              <div className="flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Theme Switch */}
              <ThemeSwitch checked={appMode === Mode.Dark} onClick={themeChange} />

              {/* Auth & Profile menu */}
              {isAuthenticated && user && userExists() ? (
                <>
                  <div className="relative">
                    <span
                      className="text-base dark:text-white font-semibold cursor-pointer hover:text-blue-500 transition-colors duration-200 flex items-center"
                      onClick={handleOpenUserMenu}
                    >
                      {user?.picture ? (
                        <CachedAvatar
                          src={user?.picture}
                          alt="User Avatar"
                          sx={{
                            width: 32,
                            height: 32,
                            marginRight: "8px",
                          }}
                        />
                      ) : (
                        <AccountCircle
                          sx={[
                            { 
                              width: 32, 
                              height: 32, 
                              marginRight: "8px" 
                            },
                            appMode === Mode.Dark && { filter: "invert(1)" }
                          ]}
                        />
                      )}
                      Profile
                      <svg 
                        className={`ml-1 w-4 h-4 transition-transform duration-200 ${Boolean(anchorElUser) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    sx={{
                      "& .MuiPaper-root": {
                        backgroundColor: appMode === Mode.Light ? "white" : "rgb(15, 23, 42)",
                        color: appMode === Mode.Light ? "black" : "white",
                        borderRadius: "12px",
                        boxShadow: appMode === Mode.Light 
                          ? "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)"
                          : "0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)",
                        border: `1px solid ${appMode === Mode.Light ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}`,
                        minWidth: "200px",
                        padding: "8px 0",
                      },
                      "& .MuiMenuItem-root": {
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: appMode === Mode.Light ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.2)",
                          color: "#3b82f6",
                        },
                      },
                    }}
                  >
                    <MenuItem disabled>
                      {`Welcome back${user?.name ? ` ${user.name}` : ""}!`}
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        handleCloseUserMenu();
                        const url = redirectApi.createRedirectUrl(PAGE_PATH.PROFILE);
                        if (e.ctrlKey || e.metaKey) {
                          window.open(url, '_blank');
                        } else {
                          window.location.href = url;
                        }
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        handleCloseUserMenu();
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        });
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </MenuItem>
                  </Menu>
                  </div>
                </>
              ) : (
                <div className="flex px-2">
                  <Button
                    onClick={() => {
                      loginWithPopup();
                    }}
                    className="w-30 h-25 text-base px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu (Dialog) */}
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden m-10"
          >
            <div className="fixed inset-0 z-10" />
            <DialogPanel 
              className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1"
              style={{
                backgroundColor: appMode === Mode.Dark 
                  ? 'rgba(15, 23, 42, 0.98)'
                  : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(12px)',
                borderLeft: `1px solid ${appMode === Mode.Dark 
                  ? 'rgba(2, 151, 251, 0.45)'
                  : 'rgba(2, 151, 251, 0.35)'}`,
                boxShadow: appMode === Mode.Dark
                  ? '-8px 0 32px rgba(2, 151, 251, 0.1)'
                  : '-8px 0 32px rgba(2, 151, 251, 0.03)'
              }}
            >
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src={`/public/${logo}`}
                    style={{ maxHeight: "40px", width: "auto" }}
                  />
                  <ThemeSwitch
                    checked={appMode === Mode.Dark}
                    onClick={themeChange}
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a
                      href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Home
                    </a>
                    <a
                      href={redirectApi.createRedirectUrl(
                        PAGE_PATH.RENTAL_CALCULATOR_HOME
                      )}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Products
                    </a>
                    <a
                      href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Pricing
                    </a>
                  </div>
                  <div className="flex py-2">
                    <Button
                      onClick={() => {
                        loginWithPopup();
                      }}
                      className="mw-30 mh-25 text-base px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </nav>
      </header>
    </div>
  );
}

/**
 * The sticky navbar that appears on all pages.
 */
const StickyNavbar = () => {
  const { user, loginWithPopup, isAuthenticated, logout } = useAuth0();
  const { getAppMode, setAppMode, userExists } = useAppContext();
  const redirectApi = new RedirectAPI();
  const appMode = getAppMode();
  const logo = appMode === Mode.Light ? "logo_light.png" : "logo_dark.png";

  // Track scroll for transitional offset
  const [scrollY, setScrollY] = useState(0);

  // States for product menu anchor & user menu anchor
  const [anchorElProducts, setAnchorElProducts] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.Bug);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle theme
  const themeChange = () => {
    const newMode = appMode === Mode.Light ? Mode.Dark : Mode.Light;
    setAppMode(newMode);
    applyMode(newMode);
  };

  // Only use full header on home and subscribe pages
  const isFullHeaderApplicable =
    window.location.pathname === PAGE_PATH.HOME ||
    window.location.pathname === PAGE_PATH.SUBSCRIBE;
  const translateY = isFullHeaderApplicable ? Math.min(0, -102 + scrollY) : 0;

  // Handle "Products" menu
  const handleOpenProductsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProducts(event.currentTarget);
  };
  const handleCloseProductsMenu = () => {
    setAnchorElProducts(null);
  };

  // Handle user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <header
      className={`
        ${appMode}
        sticky
        top-0
        z-50
        backdrop-blur-md
        py-2
        transition-transform
        duration-300
        transform
        translate-y-[${translateY}px]
        text-gray-900 dark:text-white
      `}
      style={{ 
        backgroundColor: appMode === Mode.Dark 
          ? 'var(--color-background-layout-main-5ilwcb, #ffffff)' 
          : '#ffffff',
        borderBottom: `1px solid ${appMode === Mode.Dark 
          ? 'rgba(2, 151, 251, 0.25)'
          : 'rgba(2, 151, 251, 0.15)'}`,
        boxShadow: appMode === Mode.Dark
          ? '0 4px 16px rgba(2, 151, 251, 0.1)'
          : '0 4px 16px rgba(2, 151, 251, 0.03)'
      }}
    >
      <nav
        aria-label="Global"
        className="max-w-5xl mx-auto flex items-center justify-between px-4"
      >
        {/* Logo */}
        <div
          className="flex mx-2 my-2 items-center"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <a href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)}>
            <img
              alt=""
              src={`/public/${logo}`}
              style={{ maxHeight: "30px", width: "auto" }}
            />
          </a>
        </div>

        {/* Thin navbar links */}
        <div className="flex items-center gap-x-6 text-gray-900 dark:text-white text-sm font-semibold">
          {/* Analyze menu */}
          <div className="relative">
            <span
              className="text-base dark:text-white font-semibold cursor-pointer hover:text-blue-500 transition-colors duration-200 flex items-center"
              onClick={handleOpenProductsMenu}
            >
              Analyze
              <svg 
                className={`ml-1 w-4 h-4 transition-transform duration-200 ${Boolean(anchorElProducts) ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <Menu
              anchorEl={anchorElProducts}
              open={Boolean(anchorElProducts)}
              onClose={handleCloseProductsMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: appMode === Mode.Light ? "white" : "rgb(15, 23, 42)",
                  color: appMode === Mode.Light ? "black" : "white",
                  borderRadius: "12px",
                  boxShadow: appMode === Mode.Light 
                    ? "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)"
                    : "0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${appMode === Mode.Light ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}`,
                  minWidth: "200px",
                  padding: "8px 0",
                },
                "& .MuiMenuItem-root": {
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: appMode === Mode.Light ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.2)",
                    color: "#3b82f6",
                  },
                },
              }}
            >
              <MenuItem
                onClick={(e) => {
                  handleCloseProductsMenu();
                  const url = redirectApi.createRedirectUrl(PAGE_PATH.RENTAL_CALCULATOR_HOME);
                  if (e.ctrlKey || e.metaKey) {
                    window.open(url, '_blank');
                  } else {
                    window.location.href = url;
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Properties
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleCloseProductsMenu();
                  const url = redirectApi.createRedirectUrl(PAGE_PATH.ZILLOW_SCRAPER);
                  if (e.ctrlKey || e.metaKey) {
                    window.open(url, '_blank');
                  } else {
                    window.location.href = url;
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Markets
              </MenuItem>
            </Menu>
          </div>

          <a
            className="text-base dark:text-white font-semibold"
            href={redirectApi.createRedirectUrl(PAGE_PATH.BLOG)}
          >
            Blog
          </a>
          <a
            className="text-base dark:text-white font-semibold"
            href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
          >
            Pricing
          </a>

          <a
            className="text-base dark:text-white font-semibold cursor-pointer"
            onClick={() => {
              setFeedbackType(FeedbackType.Bug);
              setShowFeedbackModal(true);
            }}
          >
            Feedback
          </a>
          <ThemeSwitch checked={appMode === Mode.Dark} onClick={themeChange} />

          {/* Auth & Profile menu */}
          {isAuthenticated && user && userExists() ? (
            <>
              <div className="relative">
                <span
                  className="text-base dark:text-white font-semibold cursor-pointer hover:text-blue-500 transition-colors duration-200 flex items-center"
                  onClick={handleOpenUserMenu}
                >
                  {user?.picture ? (
                    <CachedAvatar
                      src={user?.picture}
                      alt="User Avatar"
                      sx={{
                        width: 32,
                        height: 32,
                        marginRight: "8px",
                      }}
                    />
                  ) : (
                    <AccountCircle
                      sx={[
                        { 
                          width: 32, 
                          height: 32, 
                          marginRight: "8px" 
                        },
                        appMode === Mode.Dark && { filter: "invert(1)" }
                      ]}
                    />
                  )}
                  Profile
                  <svg 
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${Boolean(anchorElUser) ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: appMode === Mode.Light ? "white" : "rgb(15, 23, 42)",
                      color: appMode === Mode.Light ? "black" : "white",
                      borderRadius: "12px",
                      boxShadow: appMode === Mode.Light 
                        ? "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)"
                        : "0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)",
                      border: `1px solid ${appMode === Mode.Light ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}`,
                      minWidth: "200px",
                      padding: "8px 0",
                    },
                    "& .MuiMenuItem-root": {
                      padding: "12px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: appMode === Mode.Light ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.2)",
                        color: "#3b82f6",
                      },
                    },
                  }}
                >
                  <MenuItem disabled>
                    {`Welcome back${user?.name ? ` ${user.name}` : ""}!`}
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleCloseUserMenu();
                      const url = redirectApi.createRedirectUrl(PAGE_PATH.PROFILE);
                      if (e.ctrlKey || e.metaKey) {
                        window.open(url, '_blank');
                      } else {
                        window.location.href = url;
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleCloseUserMenu();
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      });
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <div className="flex lg:flex px-2">
              <Button
                onClick={() => {
                  loginWithPopup();
                }}
                className="w-30 h-25 text-base px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

/**
 * Shown while Auth0 is still loading user info
 */
function LoadingPlaceholder() {
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();
  const redirectApi: RedirectAPI = new RedirectAPI();
  const logo = appMode === Mode.Light ? "logo_light.png" : "logo_dark.png";

  return (
    <div className={appMode}>
      <header className="flex justify-center bg-[#ffffff] dark:bg-[#161D26] py-4">
        <nav
          aria-label="Global"
          style={{ backdropFilter: "blur(3px)" }}
          className="
            bg-white bg-opacity-10
            rounded-3xl
            mx-auto
            flex
            max-w-5xl
            items-center
            justify-center
            py-4
            lg:px-4
            border
            border-gray-400
            dark:border-none
          "
        >
          {/* Logo */}
          <div
            className="flex mx-2 my-2 items-center"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <a href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)}>
              <img
                alt=""
                src={`/public/${logo}`}
                style={{ maxHeight: "40px", width: "auto" }}
              />
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}

/**
 * Simple theme switch button
 */
const ThemeSwitch: React.FC<{ checked: boolean; onClick: () => void }> = ({
  checked,
  onClick,
}) => {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        className={`relative w-[40px] h-[18px] rounded-full transition-colors duration-300
        ${
          checked
            ? "bg-neutral-700 hover:bg-neutral-700"
            : "bg-neutral-200 hover:bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-[-3px] w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center 
          ${
            checked
              ? "translate-x-[16px] bg-neutral-800"
              : "translate-x-[0px] bg-white"
          }`}
        >
          <span
            className="w-5 h-5 bg-no-repeat bg-center"
            style={{
              backgroundImage: checked
                ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="white" d="M10 2a8 8 0 108 8 6 6 0 11-8-8z"/></svg>')`
                : `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="black" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
            }}
          ></span>
        </span>
      </button>
    </div>
  );
};
