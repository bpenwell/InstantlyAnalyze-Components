import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginModal } from '../../../src/components/Authentication/LoginModal';

// Mock dependencies
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ isAuthenticated: false, user: null }),
}));

jest.mock('@cloudscape-design/components', () => ({
  Button: ({ onClick, children }: any) => <button onClick={onClick}>{children}</button>,
  SpaceBetween: ({ children }: any) => <div>{children}</div>,
  Box: ({ children }: any) => <div>{children}</div>,
  TextContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@cloudscape-design/global-styles', () => ({
  Mode: { Light: 'light', Dark: 'dark' },
}));

jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  LOCAL_STORAGE_KEYS: {},
  useLocalStorage: () => [null, jest.fn()],
}));

jest.mock('../../../src/utils/AppContextProvider.tsx', () => ({
  useAppContext: () => ({ getAppMode: () => 'light' }),
}));

describe('LoginModal Component', () => {
  it('should render without crashing', () => {
    render(<LoginModal login={jest.fn()} />);
    expect(screen.getByText('Automate Your On-Market Deal Finding.')).toBeInTheDocument();
    expect(screen.getByText('Login/Sign Up')).toBeInTheDocument();
  });

  it('should handle login functionality', async () => {
    const loginMock = jest.fn().mockResolvedValue(undefined);
    render(<LoginModal login={loginMock} />);
    fireEvent.click(screen.getByText('Login/Sign Up'));
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalled();
    });
  });

  it('should handle modal open/close', async () => {
    const loginMock = jest.fn();
    const useAuth0Mock = jest.spyOn(require('@auth0/auth0-react'), 'useAuth0');

    // Initial render (unauthenticated)
    useAuth0Mock.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loginWithRedirect: loginMock,
    });
    const { rerender } = render(<LoginModal login={loginMock} />);
    
    // Modal should be visible
    expect(screen.getByText('Automate Your On-Market Deal Finding.')).toBeInTheDocument();
    
    // Click login
    fireEvent.click(screen.getByText('Login/Sign Up'));
    expect(loginMock).toHaveBeenCalled();

    // Second render (authenticated)
    useAuth0Mock.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      loginWithRedirect: loginMock,
    });
    rerender(<LoginModal login={loginMock} />);
    
    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('Automate Your On-Market Deal Finding.')).not.toBeInTheDocument();
    });
  });
}); 