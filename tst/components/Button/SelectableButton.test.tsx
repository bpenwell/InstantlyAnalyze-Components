import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectableButton } from '../../../src/components/Button/SelectableButton';

describe('SelectableButton Component', () => {
  it('should render without crashing', () => {
    render(<SelectableButton label="Test" isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
  });

  it('should handle selection state', () => {
    const { rerender } = render(<SelectableButton label="Selected" isSelected={true} onClick={jest.fn()} />);
    const button = screen.getByRole('button', { name: 'Selected' });
    expect(button.className).toMatch(/storybook-button--primary/);
    rerender(<SelectableButton label="Not Selected" isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Not Selected' }).className).toMatch(/storybook-button--secondary/);
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<SelectableButton label="Click Me" isSelected={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('should be disabled when isDisabled is true', () => {
    render(<SelectableButton label="Disabled" isSelected={false} onClick={jest.fn()} isDisabled={true} />);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.5' });
  });
}); 