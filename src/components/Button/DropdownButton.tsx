import React, { useState, useRef, useEffect } from 'react';
import './DropdownButton.css';

interface DropdownButtonProps {
  label: string;
  items: { label: string; link: string }[];
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({ label, items }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
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
    <div className='dropdown-button' ref={buttonRef} onMouseEnter={handleDropdownToggle} onMouseLeave={() => setDropdownOpen(false)}>
      <span className='dropdown-button-label'>{label}</span>
      {isDropdownOpen && (
        <div className='dropdown-menu-wrapper'>
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
