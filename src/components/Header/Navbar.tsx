import React, { useEffect, useState } from "react";
import "../../index.css";
import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  BackendAPI,
  PAGE_PATH,
  RedirectAPI,
} from "@bpenwell/instantlyanalyze-module";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppContext } from "../../utils/AppContextProvider";
import { Avatar, Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { FeedbackModal } from "../FeedbackModal/FeedbackModal";

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
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { userExists, setUserConfig, setIsUserLoading } = useAppContext();
  const backendAPI: BackendAPI = new BackendAPI();

  useEffect(() => {
    const fetchUserConfigs = async () => {
      if (isAuthenticated && user && !userExists()) {
        const userId = user.sub;
        const configs = await backendAPI.getUserConfigs(userId);
        setIsUserLoading(true);

        if (configs.message === "User not found") {
          const newUserConfig = await backendAPI.createUserConfig(userId);
          setUserConfig(newUserConfig);
        } else {
          setUserConfig(configs);
        }
        setIsUserLoading(false);
      }
    };
    fetchUserConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // If Auth0 is still loading, show a placeholder
  if (isLoading) {
    if (isFullHeaderApplicable) {
      return <LoadingPlaceholder />;
    } else {
      return <ThinNavbar />;
    }
  } else if (!isFullHeaderApplicable) {
    return <ThinNavbar />;
  } else {
    return (
      <>
        <FullNavbar />
        {displayThin && <ThinNavbar />}
      </>
    );
  }
}

/**
 * The large "full" navbar at the top of certain pages.
 */
function FullNavbar() {
  const path = window.location.pathname;
  const redirectApi: RedirectAPI = new RedirectAPI();

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for product menu anchor & user menu anchor
  const [anchorElProducts, setAnchorElProducts] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { getAppMode, setAppMode, userExists } = useAppContext();
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
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
          backgroundPositionY: "7%",
        }
      : {};

  // Navbar classes
  const navbarClasses = `
    bg-white bg-opacity-10
    dark:bg-blue-500 dark:bg-opacity-50
    rounded-3xl
    mx-auto
    border border-gray-400
    dark:border-none
    transition-all
    duration-300
    h-16
  `;

  return (
    <div className={appMode}>
      <header className="flex justify-center bg-[#ffffff] dark:bg-[#161D26] py-4" style={bg}>
        <nav
          aria-label="Global"
          style={{ backdropFilter: "blur(3px)" }}
          className={navbarClasses}
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
                    style={{ maxHeight: "30px", width: "auto" }}
                  />
                </a>
              </div>
              {/* Desktop nav items */}
              <div className="hidden lg:flex items-center space-x-8 text-gray-900 dark:text-white">
                {/* Products */}
                <span
                  className="text-base font-semibold cursor-pointer"
                  onClick={handleOpenProductsMenu}
                >
                  Products
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
                    InstantlyReport
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseProductsMenu();
                      window.location.href = redirectApi.createRedirectUrl(
                        PAGE_PATH.ZILLOW_SCRAPER
                      );
                    }}
                  >
                    InstantlyScan
                  </MenuItem>
                </Menu>

                <a
                  href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
                  className="text-base font-semibold"
                >
                  Pricing
                </a>
                <FeedbackModal />
              </div>
            </div>

            {/* Right side: Auth/profile + mobile menu */}
            <div className="flex items-center space-x-2">
              {/* Mobile menu button (hamburger) */}
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
                  <IconButton
                    onClick={handleOpenUserMenu}
                    className="mx-0 my-2 text-black"
                  >
                    {user?.picture ? (
                      <Avatar
                        src={user?.picture}
                        alt="User Avatar"
                        sx={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    ) : (
                      <AccountCircle
                        sx={[appMode === Mode.Dark && { filter: "invert(1)" }]}
                      />
                    )}
                  </IconButton>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    sx={{
                      "& .MuiPaper-root": {
                        backgroundColor:
                          appMode === Mode.Light ? "white" : "rgb(38,38,38)",
                        color: appMode === Mode.Light ? "black" : "white",
                      },
                    }}
                  >
                    <MenuItem disabled>
                      {`Welcome back${user?.name ? ` ${user.name}` : ""}!`}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        window.location.href = redirectApi.createRedirectUrl(
                          PAGE_PATH.PROFILE
                        );
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        });
                      }}
                    >
                      Log out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <div className="flex px-2">
                  <Button
                    onClick={() => {
                      loginWithRedirect();
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
            <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
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
                        loginWithRedirect();
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
 * The thinner, sticky navbar that appears after scrolling.
 */
const ThinNavbar = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const { getAppMode, setAppMode, userExists } = useAppContext();
  const redirectApi = new RedirectAPI();
  const appMode = getAppMode();
  const logo = appMode === Mode.Light ? "logo_light.png" : "logo_dark.png";

  // Track scroll for transitional offset
  const [scrollY, setScrollY] = useState(0);

  // States for product menu anchor & user menu anchor
  const [anchorElProducts, setAnchorElProducts] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
        bg-white
        bg-opacity-10
        backdrop-blur-md
        dark:bg-blue-500
        dark:bg-opacity-50
        py-2
        transition-transform
        duration-300
        transform
        translate-y-[${translateY}px]
        text-gray-900 dark:text-white
      `}
      style={{ backgroundColor: appMode === Mode.Dark ? "rgb(59 130 246 / 0.5)" : "#ffffff" }}
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
          {/* Products menu */}
          <span
            className="text-base dark:text-white font-semibold cursor-pointer"
            onClick={handleOpenProductsMenu}
          >
            Products
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
              InstantlyReport
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseProductsMenu();
                window.location.href = redirectApi.createRedirectUrl(
                  PAGE_PATH.ZILLOW_SCRAPER
                );
              }}
            >
              InstantlyScan
            </MenuItem>
          </Menu>

          <a
            className="text-base dark:text-white font-semibold"
            href={redirectApi.createRedirectUrl(PAGE_PATH.SUBSCRIBE)}
          >
            Pricing
          </a>

          <FeedbackModal />
          <ThemeSwitch checked={appMode === Mode.Dark} onClick={themeChange} />

          {/* Auth & Profile menu */}
          {isAuthenticated && user && userExists() ? (
            <>
              <IconButton
                onClick={handleOpenUserMenu}
                className="mx-0 my-2 text-black"
              >
                {user?.picture ? (
                  <Avatar
                    src={user?.picture}
                    alt="User Avatar"
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  />
                ) : (
                  <AccountCircle
                    sx={[appMode === Mode.Dark && { filter: "invert(1)" }]}
                  />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor:
                      appMode === Mode.Light ? "white" : "rgb(38,38,38)",
                    color: appMode === Mode.Light ? "black" : "white",
                  },
                }}
              >
                <MenuItem disabled>
                  {`Welcome back${user?.name ? ` ${user.name}` : ""}!`}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    window.location.href = redirectApi.createRedirectUrl(
                      PAGE_PATH.PROFILE
                    );
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                  }}
                >
                  Log out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className="flex lg:flex px-2">
              <Button
                onClick={() => {
                  loginWithRedirect();
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
