import React, { useState, useRef, useEffect } from 'react';
import './DropdownButton.css';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/rei-module';

interface DropdownButtonProps {
  label: string;
  items: { label: string; link: string }[];
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({ label, items }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const redirectAPI = new RedirectAPI();

  const shouldNotOpenDropdown = items.length === 1;

  const handleDropdownToggle = () => {
    if (shouldNotOpenDropdown) return;
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (shouldNotOpenDropdown) return;
    if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (shouldNotOpenDropdown) return;

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleOnClick = (event: any): void => {
    if (shouldNotOpenDropdown) {
      redirectAPI.redirectToPage(items[0].link as PAGE_PATH);
    }
  }

  return (
    <div className='dropdown-button' ref={buttonRef} onClick={handleOnClick} onMouseEnter={handleDropdownToggle} onMouseLeave={() => setDropdownOpen(false)}>
      <span className='dropdown-button-label'>{label}</span>
      {isDropdownOpen && (
        <div className='dropdown-button-wrapper'>
            <nav className='dropdown-menu'>
            <ul>
                {items.map((item, index) => (
                <li key={index}>
                    <a href={item.link}>{item.label}</a>
                </li>
                ))}
            </ul>
            </nav>
        </div>
      )}
    </div>
  );
};
