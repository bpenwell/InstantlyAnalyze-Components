import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlyoutDropdown, IFlydownData } from '../../../src/components/FlyoutDropdown/FlyoutDropdown';

describe('FlyoutDropdown', () => {
  const mockItems: IFlydownData[] = [
    {
      label: 'Calculator',
      link: '/calculator',
      description: 'Calculate rental returns',
      iconSrc: '/icons/calculator.png'
    },
    {
      label: 'Reports',
      link: '/reports',
      description: 'View property reports',
      iconSrc: '/icons/reports.png'
    }
  ];

  const renderFlyoutDropdown = (items = mockItems) => {
    return render(<FlyoutDropdown items={items} />);
  };

  describe('rendering', () => {
    it('should render all items', () => {
      renderFlyoutDropdown();
      
      expect(screen.getByText('Calculator')).toBeInTheDocument();
      expect(screen.getByText('Calculate rental returns')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('View property reports')).toBeInTheDocument();
    });

    it('should render correct number of items', () => {
      renderFlyoutDropdown();
      
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(2);
    });

    it('should render with correct CSS classes', () => {
      renderFlyoutDropdown();
      
      const menu = screen.getByRole('list');
      expect(menu).toHaveClass('flydown-grid');
      
      const container = menu.closest('.flydown-menu');
      expect(container).toBeInTheDocument();
    });

    it('should render items with correct structure', () => {
      renderFlyoutDropdown();
      
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toHaveClass('flydown-item');
      });
    });
  });

  describe('item content', () => {
    it('should render item icons', () => {
      renderFlyoutDropdown();
      
      const icons = screen.getAllByRole('img');
      expect(icons).toHaveLength(2);
      
      expect(icons[0]).toHaveAttribute('src', '/icons/calculator.png');
      expect(icons[1]).toHaveAttribute('src', '/icons/reports.png');
    });

    it('should render item links', () => {
      renderFlyoutDropdown();
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      
      expect(links[0]).toHaveAttribute('href', '/calculator');
      expect(links[1]).toHaveAttribute('href', '/reports');
    });

    it('should render item titles', () => {
      renderFlyoutDropdown();
      
      const titles = screen.getAllByText(/Calculator|Reports/);
      expect(titles).toHaveLength(2);
      
      titles.forEach(title => {
        expect(title).toHaveClass('flydown-title');
      });
    });

    it('should render item descriptions', () => {
      renderFlyoutDropdown();
      
      const descriptions = screen.getAllByText(/Calculate rental returns|View property reports/);
      expect(descriptions).toHaveLength(2);
      
      descriptions.forEach(description => {
        expect(description).toHaveClass('flydown-description');
      });
    });
  });

  describe('item structure', () => {
    it('should have correct icon container', () => {
      renderFlyoutDropdown();
      
      const iconContainers = document.querySelectorAll('.flydown-icon');
      expect(iconContainers).toHaveLength(2);
    });

    it('should have correct content container', () => {
      renderFlyoutDropdown();
      
      const contentContainers = document.querySelectorAll('.flydown-content');
      expect(contentContainers).toHaveLength(2);
    });

    it('should have arrow indicators', () => {
      renderFlyoutDropdown();
      
      const arrows = document.querySelectorAll('.flydown-arrow');
      expect(arrows).toHaveLength(2);
    });

    it('should have SVG arrows with correct attributes', () => {
      renderFlyoutDropdown();
      
      const svgs = document.querySelectorAll('.flydown-arrow svg');
      expect(svgs).toHaveLength(2);
      
      svgs.forEach(svg => {
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('fill', 'white');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      renderFlyoutDropdown([]);
      
      const items = screen.queryAllByRole('listitem');
      expect(items).toHaveLength(0);
    });

    it('should handle single item', () => {
      const singleItem = [mockItems[0]];
      renderFlyoutDropdown(singleItem);
      
      expect(screen.getByText('Calculator')).toBeInTheDocument();
      expect(screen.queryByText('Reports')).not.toBeInTheDocument();
      
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(1);
    });

    it('should handle items with special characters', () => {
      const specialItems: IFlydownData[] = [
        {
          label: 'Test & Demo',
          link: '/test-demo',
          description: 'Special chars: @#$%^&*()',
          iconSrc: '/icons/test.png'
        }
      ];
      
      renderFlyoutDropdown(specialItems);
      
      expect(screen.getByText('Test & Demo')).toBeInTheDocument();
      expect(screen.getByText('Special chars: @#$%^&*()')).toBeInTheDocument();
    });

    it('should handle long text content', () => {
      const longTextItems: IFlydownData[] = [
        {
          label: 'This is a very long label that might wrap to multiple lines',
          link: '/long-link',
          description: 'This is a very long description that contains a lot of text and might also wrap to multiple lines in the UI',
          iconSrc: '/icons/long.png'
        }
      ];
      
      renderFlyoutDropdown(longTextItems);
      
      expect(screen.getByText(/This is a very long label/)).toBeInTheDocument();
      expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
    });
  });
}); 