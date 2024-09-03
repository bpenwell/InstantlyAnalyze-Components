import React, { useState } from 'react';
import { Button } from '../Button/Button';
import {
  TOOL_IDS,
  RedirectAPI,
  IUserData,
  TOOL_ID_TO_TOOL_NAME_MAP,
  TOOL_ID_TO_TOOL_DESCRIPTION_MAP,
  TOOL_ID_TO_TOOL_LOGO_MAP,
  PAGE_PATH,
} from '@bpenwell/rei-module';
import './header.css';
import { DropdownButton } from '../Button/DropdownButton';
import { IFlyoutDropdownProps, FlyoutDropdown, IFlydownData } from '../FlyoutDropdown/FlyoutDropdown';

export interface HeaderProps {
  user?: IUserData;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { user } = props;
  const redirectApi: RedirectAPI = new RedirectAPI();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  console.log(`isDropdownOpen=${isDropdownOpen}`);

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

  return (
    <header>
      <div className="header-container">
        <div className="header-left">
          <a href="/">
            <img
              src="/public/logo103.png"
              alt="REI Automated"
              className="header-logo"
            />
          </a>
          <h1>REI Automated</h1>
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
          {user ? (
            <Button
              size="small"
              onClick={() => {
                redirectApi.redirectToPage(PAGE_PATH.LOGOUT);
              }}
              label="Log out"
            />
          ) : (
            <>
              <Button
                buttonType={"primary"}
                size="small"
                onClick={() => {
                  redirectApi.redirectToPage(PAGE_PATH.LOGIN);
                }}
                label="Log in"
              />
              <Button
                buttonType={"third"}
                size="small"
                onClick={() => {
                  redirectApi.redirectToPage(PAGE_PATH.SIGNUP);
                }}
                label="Sign up"
              />
            </>
          )}
        </div>
      </div>
      {isDropdownOpen ? (
        <div
          className="flyout-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <FlyoutDropdown {...productFlyoutProps} />
        </div>
      ) : <></>}
    </header>
  );
};