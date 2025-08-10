import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderV2 } from '../../../src/components/Header/HeaderV2';

// Mock dependencies
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  PAGE_PATH: {
    HOME: '/',
    RENTAL_CALCULATOR_HOME: '/rental-calculator',
    ZILLOW_SCRAPER: '/zillow-scraper',
  },
  RedirectAPI: jest.fn(() => ({
    createRedirectUrl: (path: string) => path,
  })),
}));
jest.mock('@cloudscape-design/components', () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe('HeaderV2 Component', () => {
  it('should render without crashing', () => {
    render(<HeaderV2 />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('TRVL')).toBeInTheDocument();
  });

  it('should display navigation links correctly', () => {
    render(<HeaderV2 />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Rental Report Calculator')).toBeInTheDocument();
    expect(screen.getByText('InstantlyScan')).toBeInTheDocument();
  });

  it('should handle mobile menu toggle', () => {
    const { container } = render(<HeaderV2 />);
    const menuIcon = container.querySelector('.menu-icon');
    const navMenu = screen.getByRole('list');

    expect(navMenu).toHaveClass('nav-menu');
    fireEvent.click(menuIcon!);
    expect(navMenu).toHaveClass('nav-menu active');
    fireEvent.click(menuIcon!);
    expect(navMenu).toHaveClass('nav-menu');
  });
}); 