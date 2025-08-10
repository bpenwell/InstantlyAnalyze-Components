import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownButton } from '../../../src/components/Button/DropdownButton';
import { RedirectAPI, PAGE_PATH } from '@ben1000240/instantlyanalyze-module';

// Mock the RedirectAPI
const mockRedirectToPage = jest.fn();
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  RedirectAPI: jest.fn().mockImplementation(() => ({
    redirectToPage: mockRedirectToPage,
  })),
  PAGE_PATH: {
    HOME: '/',
  },
}));

describe('DropdownButton Component', () => {
  const defaultFlyoutProps = {
    label: 'Test',
    flyoutProps: {
      items: [
        { id: '1', label: 'Option 1', link: '/', description: 'd', iconSrc: 's' },
        { id: '2', label: 'Option 2', link: '/about', description: 'd', iconSrc: 's' },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<DropdownButton {...defaultFlyoutProps} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle dropdown toggle when multiple items', () => {
    const handleDropdownToggle = jest.fn();
    render(
      <DropdownButton
        label="Menu"
        flyoutProps={defaultFlyoutProps.flyoutProps}
        handleDropdownToggle={handleDropdownToggle}
        isOpen={false}
      />
    );
    fireEvent.click(screen.getByText('Menu'));
    expect(handleDropdownToggle).toHaveBeenCalledWith(true);
  });

  it('should call redirect when only one item', () => {
    const singleItemProps = {
      ...defaultFlyoutProps,
      flyoutProps: {
        ...defaultFlyoutProps.flyoutProps,
        items: [{
          id: '1',
          label: 'Single',
          link: '/',
          description: 'd',
          iconSrc: 's'
        }],
      },
    };
    render(<DropdownButton {...singleItemProps} />);
    fireEvent.click(screen.getByText('Test'));
    expect(mockRedirectToPage).toHaveBeenCalledWith('/');
  });

  it('should display dropdown arrow when multiple items', () => {
    render(<DropdownButton {...defaultFlyoutProps} />);
    expect(document.querySelector('.dropdown-arrow')).toBeInTheDocument();
  });

  it('should not display dropdown arrow when only one item', () => {
    const singleItemProps = {
        label: 'Single',
        flyoutProps: {
            items: [{
                id: '1',
                label: 'Single',
                link: '/',
                description: 'd',
                iconSrc: 's'
            }],
        },
    };
    render(<DropdownButton {...singleItemProps} />);
    expect(document.querySelector('.dropdown-arrow')).not.toBeInTheDocument();
  });
}); 