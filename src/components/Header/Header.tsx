import React, { useState, useEffect } from 'react';
import { Button } from '../Button/Button';
import {
  TOOL_IDS,
  TOOL_ID_TO_TOOL_NAME_MAP,
  TOOL_ID_TO_TOOL_DESCRIPTION_MAP,
  TOOL_ID_TO_TOOL_LOGO_MAP,
  PAGE_PATH,
} from '@bpenwell/rei-module';
import './header.css';
import { DropdownButton } from '../Button/DropdownButton';
import { IFlyoutDropdownProps, FlyoutDropdown, IFlydownData } from '../FlyoutDropdown/FlyoutDropdown';
import { useAuth0 } from "@auth0/auth0-react";

export interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const toolItems: IFlydownData[] = Object.values(TOOL_IDS).map((toolId) => ({
    label: TOOL_ID_TO_TOOL_NAME_MAP[toolId],
    link: `/product/${toolId}`,
    description: TOOL_ID_TO_TOOL_DESCRIPTION_MAP[toolId],
    iconSrc: TOOL_ID_TO_TOOL_LOGO_MAP[toolId],
  }));

  const productFlyoutProps: IFlyoutDropdownProps = {
    items: toolItems,
  };

  const aiFlyoutProps: IFlyoutDropdownProps = {
    items: [{
        label: TOOL_ID_TO_TOOL_NAME_MAP[TOOL_IDS.AI_REAL_ESTATE_AGENT],
        link: PAGE_PATH.AI_REAL_ESTATE_AGENT,
        description: TOOL_ID_TO_TOOL_DESCRIPTION_MAP[TOOL_IDS.AI_REAL_ESTATE_AGENT],
        iconSrc: TOOL_ID_TO_TOOL_LOGO_MAP[TOOL_IDS.AI_REAL_ESTATE_AGENT],
    }],
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <header id='header-background' className={`header-background ${isScrolled ? 'header-shadow' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <a href="/">
            <img
              src="/public/logo69.png"
              alt="Instantly Analyze"
              className="header-logo"
            />
          </a>
          <h1>Instantly Analyze</h1>
          <DropdownButton
            label="Product"
            flyoutProps={productFlyoutProps}
            isOpen={isDropdownOpen}
            handleDropdownToggle={handleDropdownToggle}
          />
          <DropdownButton
            label="AI Real Estate Agent"
            flyoutProps={aiFlyoutProps}
          />
        </div>
        <div className="header-right">
          {user && isAuthenticated ? (
            <div>
              <img src={user.picture} alt={user.name} />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          
            /*<Button
              size="small"
              onClick={() => {
                logout({ logoutParams: { returnTo: window.location.origin } })
              }}
              label="Log out"
            />*/
          ) : (
            <>
              <Button
                buttonType={"primary"}
                size="small"
                onClick={() => {
                  loginWithRedirect()
                }}
                label="Log in"
              />
              <Button
                buttonType={"third"}
                size="small"
                onClick={() => {
                  loginWithRedirect()
                }}
                label="Sign up"
              />
            </>
          )}
        </div>
      </div>
      {isDropdownOpen && (
        <div
          className="flyout-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <FlyoutDropdown {...productFlyoutProps} />
        </div>
      )}
    </header>
  );
};
