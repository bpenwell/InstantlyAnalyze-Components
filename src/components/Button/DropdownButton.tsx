import React, { useRef } from 'react';
import './DropdownButton.css';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
import { IFlyoutDropdownProps } from '../FlyoutDropdown/FlyoutDropdown';

interface DropdownButtonProps {
  label: string;
  flyoutProps: IFlyoutDropdownProps;
  handleDropdownToggle?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  label,
  flyoutProps,
  handleDropdownToggle,
  isOpen,
  ...props
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const redirectAPI = new RedirectAPI();

  const shouldNotOpenDropdown = flyoutProps.items.length === 1;

  const handleOnClick = (): void => {
    if (shouldNotOpenDropdown) {
      redirectAPI.redirectToPage(flyoutProps.items[0].link as PAGE_PATH);
    } else {
      handleDropdownToggle?.(!isOpen);
    }
  };

  return (
    <div
      className="dropdown-button"
      ref={buttonRef}
      onClick={handleOnClick}
      onMouseEnter={() => handleDropdownToggle?.(true)}
    >
      <span className="dropdown-button-label">
        {label}
        {!shouldNotOpenDropdown && (
          <svg
            className={`dropdown-arrow ${isOpen ? "open" : ""}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 16l-6-6h12z" />
          </svg>
        )}
      </span>
    </div>
  );
};
