import React, { useEffect, useState } from "react";
import "../../index.css";
import { Button, Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  BackendAPI,
  LOCAL_STORAGE_KEYS,
  PAGE_PATH,
  RedirectAPI,
  useLocalStorage,
} from "@bpenwell/instantlyanalyze-module";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppContext } from "../../utils/AppContextProvider";
import { Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { applyMode, Mode } from '@cloudscape-design/global-styles';


export default function Navbar() {
  const path = window.location.pathname;
  const redirectApi: RedirectAPI = new RedirectAPI();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [appMode, setAppMode] = useLocalStorage<Mode>(
    LOCAL_STORAGE_KEYS.APP_MODE,
    Mode.Light
  );

  const themeChange = () => {
    const newMode=appMode == Mode.Light ? Mode.Dark : Mode.Light
    setAppMode(newMode);
    applyMode(newMode);
    path===PAGE_PATH.HOME? window.location.reload():()=>{};
  };
  const logo = appMode === Mode.Light ? "logo_light.png" : "logo_dark.png";

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loginWithRedirect, isAuthenticated, isLoading, logout } =
    useAuth0();
  const { userExists, setUserConfig, isPaidMember, setIsUserLoading } =
    useAppContext();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const backendAPI: BackendAPI = new BackendAPI();

  // Pull user config on mount/auth
  useEffect(() => {
    const fetchUserConfigs = async () => {
      if (isAuthenticated && user && !userExists()) {
        const userId = user.sub;
        const configs = await backendAPI.getUserConfigs(userId);
        setIsUserLoading(true);

        if (configs.message === "User not found") {
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

  
  const bgImg=appMode===Mode.Light?'grid_bg.png':'grid_bg_dark.png';
  const bg=path==PAGE_PATH.HOME?{background:`url("/public/${bgImg}")`,backgroundSize:'cover',backgroundPositionY:'8%'}:{};
      

  // If Auth0 is still loading, show a placeholder
  if (isLoading) {
    return (
      <div className={appMode}>
      <header className={`flex justify-center dark:bg-[#161D26] py-4`} style={bg}>
      <nav
        aria-label="Global"
        style={{ backdropFilter: "blur(3px)" }}
        className="bg-white bg-opacity-10 rounded-3xl mx-auto flex max-w-5xl items-center justify-center py-4 lg:px-4 border border-gray-400 dark:border-none"
      >
        <div className="flex lg:flex px-2">
          <a href="#">
            <img alt="" src={`/public/${logo}`} className="h-8 w-auto" />
          </a>
        </div>
      </nav>
      </header>
      </div>
    );
  }

  return (
    <div className={appMode}>
      <header className={`flex justify-center dark:bg-[#161D26] py-4`} style={bg}>
      <nav
        aria-label="Global"
        style={{ backdropFilter: "blur(3px)" }}
        className="bg-white bg-opacity-10 rounded-3xl mx-auto flex max-w-5xl items-center justify-center py-4 lg:px-4 border border-gray-400 dark:border-none"
      >
        <div className="flex lg:flex px-2">
          <a href="#">
            <img alt="" src={`/public/${logo}`} className="h-8 w-auto" />
          </a>
        </div>
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
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 lg:px-10 text-gray-900 dark:text-white">
          <a
            href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)}
            className="text-base font-semibold"
          >
            Home
          </a>
          <a
            href={redirectApi.createRedirectUrl(PAGE_PATH.AI_REAL_ESTATE_AGENT)}
            className="text-base font-semibold"
          >
            Products
          </a>
          <a
            href={redirectApi.createRedirectUrl(PAGE_PATH.CONTACT_US)}
            className="text-base font-semibold"
          >
            Pricing
          </a>
          <ThemeSwitch checked={appMode == Mode.Dark} onClick={themeChange} />
        </PopoverGroup>
        {isAuthenticated && user && userExists() ? (
          <>
            <IconButton onClick={handleOpenUserMenu} className="mx-0 my-2 text-black">
              <AccountCircle
                sx={[appMode === Mode.Dark && { filter: "invert(1)" }]}
              />
            </IconButton>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: appMode==Mode.Light?"white": "rgb(38,38,38)", // Equivalent to `neutral-800`
                  color: appMode==Mode.Light?"black" :"white",
                },
              }}
            >
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
              className="w-36 text-base px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login
            </Button>
          </div>
        )}
      </nav>
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
              <img alt="" src="/public/logo.png" className="h-8 w-auto" />
              <ThemeSwitch
                checked={appMode == Mode.Dark}
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
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Products
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Pricing
                </a>
              </div>
              <div className="flex lg:flex py-2">
                <Button
                  onClick={() => {
                    loginWithRedirect();
                  }}
                  className="w-36 text-base px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
    </div>
  );
}

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
