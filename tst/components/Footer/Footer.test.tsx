import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../../src/components/Footer/Footer';

// Mock dependencies
jest.mock('../../../src/utils/AppContextProvider', () => ({
  useAppContext: () => ({
    getAppMode: jest.fn(() => 'light'),
  }),
}));

jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  PAGE_PATH: {
    HOME: '/',
    CONTACT_US: '/contact',
    FACEBOOK: '/facebook',
    INSTAGRAM: '/instagram',
    TWITTER: '/twitter',
    YOUTUBE: '/youtube',
    PRIVACY_POLICY_AND_TERMS: '/privacy',
  },
  RedirectAPI: jest.fn().mockImplementation(() => ({
    createRedirectUrl: jest.fn((path) => path),
  })),
  LOCAL_STORAGE_KEYS: {},
  useLocalStorage: jest.fn(),
}));

jest.mock('@cloudscape-design/global-styles', () => ({
  Mode: {
    Light: 'light',
    Dark: 'dark',
  },
}));

describe('Footer', () => {
  const renderFooter = () => {
    return render(<Footer />);
  };

  describe('rendering', () => {
    it('should render the footer component', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should render the logo', () => {
      renderFooter();
      
      const logo = screen.getByAltText('InstantlyAnalyze');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/public/logo_light.png');
    });

    it('should render all section headings', () => {
      renderFooter();
      
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Legal & Support')).toBeInTheDocument();
    });

    it('should render copyright text', () => {
      renderFooter();
      
      expect(screen.getByText(/© 2025/)).toBeInTheDocument();
      expect(screen.getByText(/InstantlyAnalyze™/)).toBeInTheDocument();
      expect(screen.getByText(/All Rights Reserved/)).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('should render all site page links', () => {
      renderFooter();
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('should render all social media links', () => {
      renderFooter();
      
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('X (Twitter)')).toBeInTheDocument();
      expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    });

    it('should render legal links', () => {
      renderFooter();
      
      expect(screen.getByText('Privacy Policy & Terms')).toBeInTheDocument();
    });

    it('should have correct href attributes for site pages', () => {
      renderFooter();
      
      const homeLink = screen.getByText('Home');
      const contactLink = screen.getByText('Contact Us');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should have correct href attributes for social media', () => {
      renderFooter();
      
      const facebookLink = screen.getByLabelText('Facebook');
      const instagramLink = screen.getByLabelText('Instagram');
      const twitterLink = screen.getByLabelText('X (Twitter)');
      const youtubeLink = screen.getByLabelText('YouTube');
      
      expect(facebookLink).toHaveAttribute('href', '/facebook');
      expect(instagramLink).toHaveAttribute('href', '/instagram');
      expect(twitterLink).toHaveAttribute('href', '/twitter');
      expect(youtubeLink).toHaveAttribute('href', '/youtube');
    });

    it('should have correct href attributes for legal pages', () => {
      renderFooter();
      
      const privacyLink = screen.getByText('Privacy Policy & Terms');
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });
  });

  describe('styling and layout', () => {
    it('should have proper CSS classes', () => {
      renderFooter();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('text-gray-700', 'dark:text-gray-300');
    });

    it('should have proper structure with sections', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      const sections = footer.querySelectorAll('div');
      
      // Should have multiple sections for layout
      expect(sections.length).toBeGreaterThan(1);
    });

    it('should have proper list structure', () => {
      renderFooter();
      
      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('should have proper list items', () => {
      renderFooter();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      renderFooter();
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      headings.forEach(heading => {
        expect(heading.tagName).toBe('H3');
      });
    });

    it('should have accessible links', () => {
      renderFooter();
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper alt text for logo', () => {
      renderFooter();
      
      const logo = screen.getByAltText('InstantlyAnalyze');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('theme integration', () => {
    it('should apply light theme classes by default', () => {
      renderFooter();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('text-gray-700', 'dark:text-gray-300');
    });

    it('should include dark theme classes', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('dark:text-gray-300');
    });
  });

  describe('responsive design', () => {
    it('should have responsive classes', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      const mainContainer = footer.querySelector('.flex.flex-col.md\\:flex-row');
      
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have responsive text sizing', () => {
      renderFooter();
      
      const textElements = screen.getAllByText(/./);
      const hasResponsiveClasses = textElements.some(element => 
        element.className.includes('text-sm') || element.className.includes('md:')
      );
      
      expect(hasResponsiveClasses).toBe(true);
    });
  });

  describe('content validation', () => {
    it('should contain all required sections', () => {
      renderFooter();
      
      const sections = ['Navigation', 'Legal & Support'];
      sections.forEach(section => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });

    it('should contain all required links', () => {
      renderFooter();
      
      const requiredLinks = [
        'Home', 'Contact Us', 'Privacy Policy & Terms'
      ];
      
      requiredLinks.forEach(link => {
        expect(screen.getByText(link)).toBeInTheDocument();
      });
    });

    it('should have proper copyright year', () => {
      renderFooter();
      
      const copyrightText = screen.getByText(/© 2025/);
      expect(copyrightText).toBeInTheDocument();
    });
  });
}); 