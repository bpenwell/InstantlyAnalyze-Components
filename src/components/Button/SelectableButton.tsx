import React from 'react';
import './button.css';

interface SelectableButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
}

export const SelectableButton: React.FC<SelectableButtonProps> = ({
  label,
  isSelected,
  onClick,
  isDisabled = false,
  className = '',
}) => {
  const mode = isSelected ? 'storybook-button--primary' : 'storybook-button--secondary';

  return (
    <button
      type="button"
      className={['storybook-button', 'storybook-button--medium', mode, className].join(' ')}
      onClick={onClick}
      disabled={isDisabled}
      style={{ opacity: isDisabled ? 0.5 : 1 }}
    >
      {label}
    </button>
  );
};
