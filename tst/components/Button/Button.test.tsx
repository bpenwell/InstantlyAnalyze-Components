import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../src/components/Button/Button';

describe('Button', () => {
  const defaultProps = {
    label: 'Click me',
  };

  const renderButton = (props = {}) => {
    return render(<Button {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render with default props', () => {
      renderButton();
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      renderButton({ label: 'Custom Button' });
      const button = screen.getByRole('button', { name: 'Custom Button' });
      expect(button).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = renderButton({ size: 'small' });
      let button = screen.getByRole('button');
      expect(button).toHaveClass('storybook-button--small');

      rerender(<Button {...defaultProps} size="large" />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('storybook-button--large');
    });

    it('should render with different button types', () => {
      const { rerender } = renderButton({ buttonType: 'primary' });
      let button = screen.getByRole('button');
      expect(button).toHaveClass('storybook-button--primary');

      rerender(<Button {...defaultProps} buttonType="secondary" />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('storybook-button--secondary');
    });

    it('should apply custom background color', () => {
      renderButton({ backgroundColor: '#ff0000' });
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ backgroundColor: '#ff0000' });
    });
  });

  describe('user interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      renderButton({ onClick: handleClick });
      const button = screen.getByRole('button');
      
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      renderButton({ onClick: handleClick, disabled: true });
      const button = screen.getByRole('button');
      
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      renderButton({ onClick: handleClick, loading: true });
      const button = screen.getByRole('button');
      
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading is true', () => {
      renderButton({ loading: true });
      
      const loadingSpinner = screen.getByTestId('loading-spinner');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should not show label when loading', () => {
      renderButton({ loading: true });
      
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      renderButton({ loading: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      renderButton({ disabled: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have button role', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should be accessible by label text', () => {
      renderButton({ label: 'Submit Form' });
      
      const button = screen.getByRole('button', { name: 'Submit Form' });
      expect(button).toBeInTheDocument();
    });

    it('should maintain accessibility when disabled', () => {
      renderButton({ disabled: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('props spreading', () => {
    it('should spread additional props to button element', () => {
      renderButton({ 'data-testid': 'custom-button', 'aria-label': 'Custom label' });
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });
  });
}); 