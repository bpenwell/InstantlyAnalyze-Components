import React from 'react';
import './Footer.css';
import { LOCAL_STORAGE_KEYS, PAGE_PATH, RedirectAPI, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import { Mode } from '@cloudscape-design/global-styles';

export const Footer = () => {
 const [appMode, setAppMode] = useLocalStorage<Mode>(
    LOCAL_STORAGE_KEYS.APP_MODE,
    Mode.Light
  );
  const lightMode=appMode===Mode.Light;
  const bgColor=lightMode?'bg-white':'bg-neutral-800';
  return (
    <footer className={"bg-gray-100 pb-20 px-16 " + bgColor}>
      <div className="py-6 mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="flex items-center space-x-2">
          <img src="/public/logo.png" alt="logo" className='h-10' />
        </div>
        <div className="flex space-x-8 text-sm md:mt-0">
          <div>
            <h3 className="font-semibold">Site Pages</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Follow Us</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Github
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Discord
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Legal</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms and conditions
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
  );
};