import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthenticatedPage } from '../../../src/components/Authentication/AuthenticatedPage';

// Mock dependencies
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

jest.mock('../../../src/components/Authentication/LoginModal', () => ({
  LoginModal: ({ login }: any) => (
    <div data-testid="login-modal">
      <button onClick={login} data-testid="login-button">
        Login
      </button>
    </div>
  ),
}));

jest.mock('react-loader-spinner', () => ({
  Oval: ({ height, width, color, visible, ariaLabel }: any) => (
    <div 
      data-testid="loading-spinner"
      data-height={height}
      data-width={width}
      data-color={color}
      data-visible={visible}
      data-aria-label={ariaLabel}
    >
      Loading...
    </div>
  ),
}));

describe('AuthenticatedPage', () => {
  const mockUseAuth0 = require('@auth0/auth0-react').useAuth0;
  const mockLoginWithPopup = jest.fn();

  const renderAuthenticatedPage = (auth0Props = {}, children: React.ReactNode = <div>Test Content</div>) => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginWithPopup: mockLoginWithPopup,
      ...auth0Props,
    });

    return render(<AuthenticatedPage>{children}</AuthenticatedPage>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('loading state', () => {
    it('should show loading spinner when Auth0 is loading', () => {
      renderAuthenticatedPage({ isLoading: true });
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-height', '80');
      expect(spinner).toHaveAttribute('data-width', '80');
      expect(spinner).toHaveAttribute('data-color', '#4fa94d');
      expect(spinner).toHaveAttribute('data-visible', 'true');
      expect(spinner).toHaveAttribute('data-aria-label', 'oval-loading');
    });

    it('should not show loading spinner when user is logging in', () => {
      // Start with isLoading false so we can see the login modal
      renderAuthenticatedPage({ isLoading: false });
      
      // Should show login modal initially
      expect(screen.getByTestId('login-modal')).toBeInTheDocument();
      
      // Simulate login click to set isLoggingIn to true
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      // Fast-forward timers to trigger the login flow
      jest.advanceTimersByTime(100);
      
      // Should still show login modal during login process
      expect(screen.getByTestId('login-modal')).toBeInTheDocument();
    });
  });

  describe('unauthenticated state', () => {
    it('should show login modal when not authenticated', () => {
      renderAuthenticatedPage({ isAuthenticated: false });
      
      const loginModal = screen.getByTestId('login-modal');
      expect(loginModal).toBeInTheDocument();
    });

    it('should show children content when not authenticated', () => {
      renderAuthenticatedPage({ isAuthenticated: false }, <div>Protected Content</div>);
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show login modal when there is an error', () => {
      renderAuthenticatedPage({ error: new Error('Auth error') });
      
      const loginModal = screen.getByTestId('login-modal');
      expect(loginModal).toBeInTheDocument();
    });
  });

  describe('authenticated state', () => {
    it('should show children content when authenticated', () => {
      renderAuthenticatedPage({ isAuthenticated: true }, <div>Authenticated Content</div>);
      
      expect(screen.getByText('Authenticated Content')).toBeInTheDocument();
    });

    it('should not show login modal when authenticated', () => {
      renderAuthenticatedPage({ isAuthenticated: true });
      
      expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
    });
  });

  describe('login interaction', () => {
    it('should handle login button click', async () => {
      renderAuthenticatedPage();
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      // Fast-forward timers to trigger the login flow
      jest.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(mockLoginWithPopup).toHaveBeenCalled();
      });
    });

    it('should set isLoggingIn state during login process', async () => {
      renderAuthenticatedPage();
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      // Fast-forward timers to trigger the login flow
      jest.advanceTimersByTime(100);
      
      // Should still show login modal during login process
      expect(screen.getByTestId('login-modal')).toBeInTheDocument();
      
      // Fast-forward to complete the login process
      jest.advanceTimersByTime(500);
    });
  });

  describe('children rendering', () => {
    it('should render multiple children correctly', () => {
      const children = [
        <div key="1">Child 1</div>,
        <div key="2">Child 2</div>,
        <div key="3">Child 3</div>,
      ];
      
      renderAuthenticatedPage({ isAuthenticated: true }, children);
      
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should render children with keys', () => {
      const children = [
        <div key="child-1" id="child-1">Child with ID</div>,
      ];
      
      renderAuthenticatedPage({ isAuthenticated: true }, children);
      
      expect(screen.getByText('Child with ID')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should show login modal when Auth0 has an error', () => {
      renderAuthenticatedPage({ error: new Error('Authentication failed') });
      
      const loginModal = screen.getByTestId('login-modal');
      expect(loginModal).toBeInTheDocument();
    });

    it('should still render children when there is an error', () => {
      renderAuthenticatedPage(
        { error: new Error('Authentication failed') },
        <div>Content with Error</div>
      );
      
      expect(screen.getByText('Content with Error')).toBeInTheDocument();
    });
  });
}); 