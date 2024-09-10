import React from 'react';
import './FlyoutDropdown.css';

export interface IFlydownData {
  label: string;
  link: string;
  description: string;
  iconSrc: string; // Added icon field
}

export interface IFlyoutDropdownProps {
  items: IFlydownData[];
}

export const FlyoutDropdown: React.FC<IFlyoutDropdownProps> = ({ items }) => {
  return (
    <div className="flydown-menu">
      <ul className="flydown-grid">
        {items.map((item, index) => (
          <li key={index} className="flydown-item">
            <a href={item.link}>
              <div className="flydown-icon">
                <img
                  className="material-icons"
                  src={item.iconSrc}
                />
              </div>
              <div className="flydown-content">
                <div className="flydown-title">
                  {item.label}
                </div>
                <div className="flydown-description">
                  {item.description}
                </div>
              </div>
              <div className="flydown-arrow">
                <svg
                  className={`flydown-arrow-turn`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 16l-6-6h12z" />
                </svg>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};