import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import {
  TOOL_IDS,
  RedirectAPI,
  IUserData,
  TOOL_ID_TO_TOOL_NAME_MAP,
  PAGE_PATH,
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
          <DropdownButton label='AI Real Estate Agent' items={[{
            label: TOOL_ID_TO_TOOL_NAME_MAP[TOOL_IDS.AI_REAL_ESTATE_AGENT],
            link: PAGE_PATH.AI_REAL_ESTATE_AGENT,
          }]} />
        </div>
        <div className='header-right'>
          {user ? (
            <Button size='small' onClick={() => { redirectApi.redirectToPage(PAGE_PATH.LOGOUT) } } label='Log out' />
          ) : (
            <>
              <Button buttonType={'primary'} size='small' onClick={() => { redirectApi.redirectToPage(PAGE_PATH.LOGIN) }} label='Log in' />
              <Button buttonType={'third'} size='small' onClick={() => { redirectApi.redirectToPage(PAGE_PATH.SIGNUP) }} label='Sign up' />
            </>
          )}
        </div>
      </div>
    </header>
  );
};
