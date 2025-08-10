import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppLayoutPreview } from '../../../src/components/AppLayout/AppLayout';

// Mock dependencies
jest.mock('@cloudscape-design/components', () => ({
  AppLayout: ({ content, breadcrumbs, disableContentPaddings, toolsHide, navigationHide }: any) => (
    <div 
      data-testid="app-layout"
      data-disable-paddings={disableContentPaddings}
      data-tools-hide={toolsHide}
      data-navigation-hide={navigationHide}
    >
      {breadcrumbs && <div data-testid="breadcrumbs">{breadcrumbs}</div>}
      <div data-testid="content">{content}</div>
    </div>
  ),
  BreadcrumbGroup: ({ items }: any) => (
    <nav data-testid="breadcrumb-group">
      {items.map((item: any, index: number) => (
        <a key={index} href={item.href} data-testid={`breadcrumb-${index}`}>
          {item.text}
        </a>
      ))}
    </nav>
  ),
}));

jest.mock('@cloudscape-design/components/i18n', () => ({
  I18nProvider: ({ children, locale, messages }: any) => (
    <div data-testid="i18n-provider" data-locale={locale}>
      {children}
    </div>
  ),
}));

jest.mock('@cloudscape-design/components/i18n/messages/all.en', () => ({}));

jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  getBreadcrumbsUUIDPageName: jest.fn((uuid) => `Mapped ${uuid}`),
  PAGE_PATH: {
    HOME: '/',
    SUBSCRIBE: '/subscribe',
  },
  toUpperCamelCase: jest.fn((text) => text.charAt(0).toUpperCase() + text.slice(1)),
}));

// Mock window.location
const mockLocation = {
  pathname: '/test/path',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('AppLayoutPreview', () => {
  const renderAppLayout = (children = <div>Test Content</div>) => {
    return render(<AppLayoutPreview>{children}</AppLayoutPreview>);
  };

  beforeEach(() => {
    // Reset window.location before each test
    Object.defineProperty(window, 'location', {
      value: { pathname: '/test/path' },
      writable: true,
    });
  });

  describe('rendering', () => {
    it('should render with children content', () => {
      renderAppLayout(<div>Custom Content</div>);
      
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Custom Content');
    });

    it('should render with I18nProvider', () => {
      renderAppLayout();
      
      const i18nProvider = screen.getByTestId('i18n-provider');
      expect(i18nProvider).toBeInTheDocument();
      expect(i18nProvider).toHaveAttribute('data-locale', 'en');
    });

    it('should render AppLayout with correct props', () => {
      renderAppLayout();
      
      const appLayout = screen.getByTestId('app-layout');
      expect(appLayout).toBeInTheDocument();
      expect(appLayout).toHaveAttribute('data-tools-hide', 'true');
      expect(appLayout).toHaveAttribute('data-navigation-hide', 'true');
    });
  });

  describe('breadcrumb generation', () => {
    it('should generate breadcrumbs for simple path', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/test' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.getByTestId('breadcrumb-group');
      expect(breadcrumbGroup).toBeInTheDocument();
      
      // Get breadcrumb links within the group
      const breadcrumbLinks = breadcrumbGroup.querySelectorAll('[data-testid^="breadcrumb-"]');
      expect(breadcrumbLinks).toHaveLength(2);
      expect(breadcrumbLinks[0]).toHaveTextContent('Home');
      expect(breadcrumbLinks[1]).toHaveTextContent('Test');
    });

    it('should handle UUID segments in path', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/123e4567-e89b-12d3-a456-426614174000' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.getByTestId('breadcrumb-group');
      const breadcrumbLinks = breadcrumbGroup.querySelectorAll('[data-testid^="breadcrumb-"]');
      expect(breadcrumbLinks).toHaveLength(2);
      expect(breadcrumbLinks[0]).toHaveTextContent('Home');
      expect(breadcrumbLinks[1]).toHaveTextContent('Mapped 123e4567-e89b-12d3-a456-426614174000');
    });

    it('should handle paths with hash segments', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/test#section' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.getByTestId('breadcrumb-group');
      expect(breadcrumbGroup).toBeInTheDocument();
    });

    it('should handle paths with profile segments', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/profile/test' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.getByTestId('breadcrumb-group');
      expect(breadcrumbGroup).toBeInTheDocument();
    });

    it('should handle paths with subscribe segments', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/subscribe/test' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.getByTestId('breadcrumb-group');
      expect(breadcrumbGroup).toBeInTheDocument();
    });

    it('should not show breadcrumbs for empty path', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.queryByTestId('breadcrumb-group');
      expect(breadcrumbGroup).not.toBeInTheDocument();
    });
  });

  describe('content padding', () => {
    it('should disable content padding for home page', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true,
      });
      
      renderAppLayout();
      
      const appLayout = screen.getByTestId('app-layout');
      expect(appLayout).toHaveAttribute('data-disable-paddings', 'true');
    });

    it('should disable content padding for subscribe page', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/subscribe' },
        writable: true,
      });
      
      renderAppLayout();
      
      const appLayout = screen.getByTestId('app-layout');
      expect(appLayout).toHaveAttribute('data-disable-paddings', 'true');
    });

    it('should enable content padding for other pages', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/test' },
        writable: true,
      });
      
      renderAppLayout();
      
      const appLayout = screen.getByTestId('app-layout');
      expect(appLayout).toHaveAttribute('data-disable-paddings', 'false');
    });
  });

  describe('breadcrumb URLs', () => {
    it('should generate correct URLs for breadcrumbs', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/product/test/page' },
        writable: true,
      });
      
      renderAppLayout();
      
      const breadcrumbGroup = screen.getByTestId('breadcrumb-group');
      const breadcrumbLinks = breadcrumbGroup.querySelectorAll('[data-testid^="breadcrumb-"]');
      expect(breadcrumbLinks[0]).toHaveAttribute('href', '#');
      expect(breadcrumbLinks[1]).toHaveAttribute('href', '/product/test');
      expect(breadcrumbLinks[2]).toHaveAttribute('href', '/product/test/page');
    });
  });
}); 