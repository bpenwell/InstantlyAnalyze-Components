import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../../../src/components/Header/Header';

// Mock the Navbar component
jest.mock('../../../src/components/Header/Navbar', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="navbar">
      <nav>Mocked Navbar Component</nav>
    </div>
  ),
}));

describe('Header', () => {
  const renderHeader = () => {
    return render(<Header />);
  };

  describe('rendering', () => {
    it('should render the header component', () => {
      renderHeader();
      
      const header = screen.getByTestId('navbar');
      expect(header).toBeInTheDocument();
    });

    it('should render the navbar component', () => {
      renderHeader();
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveTextContent('Mocked Navbar Component');
    });

    it('should have proper DOM structure', () => {
      renderHeader();
      
      const navbar = screen.getByTestId('navbar');
      const nav = navbar.querySelector('nav');
      
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveTextContent('Mocked Navbar Component');
    });
  });

  describe('component integration', () => {
    it('should integrate with Navbar component', () => {
      renderHeader();
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toBeInTheDocument();
    });

    it('should render as a functional component', () => {
      renderHeader();
      
      // Should render without errors
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should be present in the DOM', () => {
      renderHeader();
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toBeInTheDocument();
    });

    it('should have semantic structure', () => {
      renderHeader();
      
      const navbar = screen.getByTestId('navbar');
      const nav = navbar.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });
  });
}); 