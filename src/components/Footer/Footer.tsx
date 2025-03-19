import React from 'react';
import './Footer.css';
import { useAppContext } from '../../utils/AppContextProvider';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
import { LOCAL_STORAGE_KEYS, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import { Mode } from '@cloudscape-design/global-styles';

export const Footer = () => {
  const redirectApi: RedirectAPI = new RedirectAPI();
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();
  const logo=appMode===Mode.Light?'logo_light.png':'logo_dark.png';

  return (
    <div className={appMode}>
      <footer className='bg-gray-100 text-black dark:text-white dark:bg-neutral-800 pb-20 px-16'>
        <div className="py-6 mx-auto flex flex-col md:flex-row justify-between items-start">
          <div className="flex items-center space-x-2">
            <img src={`/public/${logo}`} alt="logo" className='h-10' />
          </div>
          <div className="flex space-x-8 text-sm md:mt-0">
            <div>
              <h3 className="font-semibold">Site Pages</h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.HOME)} className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.CONTACT_US)} className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Follow Us</h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.FACEBOOK)} className="hover:underline">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.INSTAGRAM)} className="hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.TWITTER)} className="hover:underline">
                    X
                  </a>
                </li>
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.YOUTUBE)} className="hover:underline">
                    Youtube
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a href={redirectApi.createRedirectUrl(PAGE_PATH.PRIVACY_POLICY_AND_TERMS)} className="hover:underline">
                    Privacy Policy and Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-4 text-sm">
          &copy; 2025 InstantlyAnalyze™. All Rights Reserved
        </div>
      </footer>
    </div>
  );
};