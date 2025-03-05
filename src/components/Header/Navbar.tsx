import React, { useState } from 'react'
import "../../index.css"
import {
  Button,
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { LOCAL_STORAGE_KEYS, PAGE_PATH, RedirectAPI, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import { useAuth0 } from '@auth0/auth0-react';
import { Mode } from '@cloudscape-design/global-styles';


  const redirectApi: RedirectAPI = new RedirectAPI();

export default function Navbar() {
  const [appMode, setAppMode] = useLocalStorage<Mode>(
    LOCAL_STORAGE_KEYS.APP_MODE,
    Mode.Light
  );
  const themeChange=()=>{setAppMode(appMode==Mode.Light?Mode.Dark:Mode.Light); window.location.reload();};
  const bgImg=appMode===Mode.Light?'url("/public/grid_bg.png")':'url("/public/grid_bg_dark.png")';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const {loginWithRedirect } = useAuth0();
  const path = window.location.pathname;
  const lightMode=appMode===Mode.Light;
  const bg={background:bgImg,backgroundSize:'cover',backgroundPositionY:'8%'};
  const textColor=lightMode?'text-gray-900':'text-white';
  const borderColor=lightMode?'border border-gray-400':'';
  return (
    <header className="flex justify-center py-4" style={path==PAGE_PATH.HOME?bg:{}}>
      <nav aria-label="Global" style={{backdropFilter: 'blur(3px)'}} className={"bg-white bg-opacity-10 rounded-3xl mx-auto flex max-w-5xl items-center justify-center py-4 lg:px-4 "+ borderColor}>
        <div className="flex lg:flex px-2">
          <a href="#">
            <img
              alt=""
              src="/public/logo.png"
              className="h-8 w-auto"
            />
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
        <PopoverGroup className={"hidden lg:flex lg:gap-x-12 lg:px-10 "+textColor}>

          <a href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)} className="text-base font-semibold">
            Home
          </a>
          <a href={redirectApi.createRedirectUrl(PAGE_PATH.AI_REAL_ESTATE_AGENT)} className="text-base font-semibold">
            Products
          </a>
          <a href={redirectApi.createRedirectUrl(PAGE_PATH.CONTACT_US)} className="text-base font-semibold">
            Pricing
          </a>
          <Button onClick={themeChange} className="text-base font-semibold hover:bg-transparent">
            {appMode==Mode.Light?"Light Theme":"Dark Theme"}
          </Button>
          
        </PopoverGroup>
        <div className="flex hidden lg:flex px-2">
          <Button onClick={()=>{loginWithRedirect()}} className="w-36 text-base px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Login
          </Button>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden m-10">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="/public/logo.png"
                className="h-8 w-auto"
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
          <Button onClick={()=>{loginWithRedirect()}} className="w-36 text-base px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Login
          </Button>
        </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
