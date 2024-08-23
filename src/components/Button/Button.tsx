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
  ...props
}: ButtonProps) => {
  let mode = 'storybook-button--secondary';
  if (buttonType !== '') { 
    mode = `storybook-button--${buttonType}`;
  }
  return (
    <button
      type='button'
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
