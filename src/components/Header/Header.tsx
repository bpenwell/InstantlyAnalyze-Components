import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import {
  TOOL_IDS,
  RedirectAPI,
  IUserData,
  TOOL_ID_TO_TOOL_NAME_MAP,
} from '@bpenwell/rei-module';
import './header.css';
import { DropdownButton } from '../Button/DropdownButton';

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

  // Prepare items for DropdownButton
  const toolItems = Object.values(TOOL_IDS).map(toolId => ({
    label: TOOL_ID_TO_TOOL_NAME_MAP[toolId],
    link: `/tools/${toolId}`,
  }));

  return (
    <header>
      <div className='header-container'>
        <div className='header-left'>
          <a href='/'>
            <img src='/public/logo103.png' alt='REI Automated' className='header-logo' />
          </a>
          <h1>REI Automated</h1>
          <DropdownButton label='Tools' items={toolItems} />
        </div>
        <div className='header-right'>
          {user ? (
            <Button size='small' onClick={handleLogoutOnClick} label='Log out' />
          ) : (
            <>
              <Button primary size='small' onClick={handleLogInOnClick} label='Log in' />
              <Button size='small' onClick={handleSignUpOnClick} label='Sign up' />
            </>
          )}
        </div>
      </div>
    </header>
  );
};
