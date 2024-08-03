import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import {
  TOOL_IDS,
  PAGE_PATH,
  RedirectAPI,
  IUserData,
  TOOL_ID_TO_TOOL_NAME_MAP,
} from '@bpenwell/rei-module';
import './header.css';

export interface HeaderProps {
  user?: IUserData;
}

export const Header = (props: HeaderProps) => {
  const { user } = props;
  const redirectApi: RedirectAPI = new RedirectAPI();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignUpOnClick = () => {
    redirectApi.redirectToSignUp();
  };
  const handleLogInOnClick = () => {
    redirectApi.redirectToLogin();
  };
  const handleLogoutOnClick = () => {
    redirectApi.redirectToLogout();
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header>
      <div className="wrapper">
        <div>
          <a href="/">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path
                  d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
                  fill="#FFF"
                />
                <path
                  d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
                  fill="#555AB9"
                />
                <path
                  d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
                  fill="#91BAF8"
                />
              </g>
            </svg>
            <h1>Acme</h1>
          </a>
        </div>
        <div ref={dropdownRef}>
          <Button size="small" onClick={handleDropdownToggle} label="Tools" />
          <nav className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            <ul>
              {Object.values(TOOL_IDS).map((toolId) => (
                <li key={toolId}>
                  <a href={`/tools/${toolId}`}>
                    {TOOL_ID_TO_TOOL_NAME_MAP[toolId]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          {user ? (
            <Button size="small" onClick={handleLogoutOnClick} label="Log out" />
          ) : (
            <>
              <Button size="small" onClick={handleLogInOnClick} label="Log in" />
              <Button primary size="small" onClick={handleSignUpOnClick} label="Sign up" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};
