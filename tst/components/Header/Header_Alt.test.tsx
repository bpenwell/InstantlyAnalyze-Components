import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header_Alt } from '../../../src/components/Header/Header_Alt';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0
jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.Mock;

describe('Header_Alt Component', () => {
  it('should render login state correctly', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
    });
    render(<Header_Alt />);
    expect(screen.getByText('My App')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render logout state correctly', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', picture: 'test.jpg' },
      logout: jest.fn(),
    });
    render(<Header_Alt />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Test User' })).toBeInTheDocument();
  });

  it('should handle login and logout actions', () => {
    const loginWithRedirect = jest.fn();
    const logout = jest.fn();

    // Test login
    mockUseAuth0.mockReturnValue({ isAuthenticated: false, loginWithRedirect });
    const { rerender } = render(<Header_Alt />);
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(loginWithRedirect).toHaveBeenCalled();

    // Test logout
    mockUseAuth0.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' }, logout });
    rerender(<Header_Alt />);
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(logout).toHaveBeenCalled();
  });
}); 