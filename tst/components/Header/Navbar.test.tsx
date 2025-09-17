import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../../src/components/Header/Navbar';

// Mock dependencies
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { name: 'Test User', picture: 'test.jpg' },
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  }),
}));
jest.mock('../../../src/utils/AppContextProvider', () => ({
  useAppContext: () => ({
    userExists: () => true,
    getAppMode: () => 'light',
    setAppMode: jest.fn(),
    hasSeenWelcomePage: () => true,
    setHasSeenWelcomePage: jest.fn(),
  }),
}));
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  BackendAPI: jest.fn(),
  PAGE_PATH: { HOME: '/', SUBSCRIBE: '/subscribe', PROFILE: '/profile' },
  RedirectAPI: jest.fn(() => ({ createRedirectUrl: (path: string) => path })),
  FeedbackType: {
    Bug: 'Bug',
    Feature: 'Feature',
    General: 'General',
  },
}));
jest.mock('../../../src/components/FeedbackModal/FeedbackModal', () => ({
  FeedbackModal: () => <div data-testid="feedback-modal">Feedback</div>,
}));

// Mock window location
const mockLocation = (pathname: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { pathname },
  });
};

describe('Navbar Component', () => {
  beforeEach(() => {
    mockLocation('/');
  });

  it('should render without crashing', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display navigation items correctly', () => {
    render(<Navbar />);
    expect(screen.getByText('Analyze')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    // The feedback modal is only rendered when showFeedbackModal is true, so we'll check for the feedback link instead
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('should handle navigation interactions (user menu)', () => {
    render(<Navbar />);
    // The button is the img with alt text "User Avatar"
    const userMenuButton = screen.getByAltText('User Avatar');
    fireEvent.click(userMenuButton);
    // Check for the Profile menu item specifically (not the button text)
    expect(screen.getByRole('menuitem', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
}); 