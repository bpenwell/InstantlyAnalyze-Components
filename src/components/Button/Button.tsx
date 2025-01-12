import React from 'react';
import './button.css';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean; // Default is not disabled
  [key: string]: any;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  buttonType = '',
  size = 'medium',
  backgroundColor,
  label,
  loading = false, // Default is not loading
  disabled = false,
  ...props
}: ButtonProps) => {
  let mode = 'storybook-button--secondary';
  if (buttonType !== '') { 
    mode = `storybook-button--${buttonType}`;
  }
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
      disabled={loading || disabled} // Disable button when loading
    >
      <div className="button-content">
        {loading ? (
          <div className="loading-spinner"></div> // Render loading spinner if loading
        ) : (
          label
        )}
      </div>
    </button>
  );
};
