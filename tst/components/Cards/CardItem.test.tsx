import React from 'react';
import { render, screen } from '@testing-library/react';
import { CardItem } from '../../../src/components/Cards/CardItem';

describe('CardItem', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    text: 'Test card text',
    label: 'Test Label',
    path: '/test-path'
  };

  const renderCardItem = (props = {}) => {
    return render(<CardItem {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render with default props', () => {
      renderCardItem();
      
      const link = screen.getByRole('link');
      const image = screen.getByRole('img');
      const heading = screen.getByRole('heading', { level: 5 });
      
      expect(link).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      const customProps = {
        src: 'custom-image.jpg',
        text: 'Custom card text',
        label: 'Custom Label',
        path: '/custom-path'
      };
      
      renderCardItem(customProps);
      
      const link = screen.getByRole('link');
      const image = screen.getByRole('img');
      const heading = screen.getByRole('heading', { level: 5 });
      
      expect(link).toHaveAttribute('href', '/custom-path');
      expect(image).toHaveAttribute('src', 'custom-image.jpg');
      expect(heading).toHaveTextContent('Custom card text');
    });

    it('should render image with correct alt text', () => {
      renderCardItem();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Travel Image');
    });

    it('should render figure with data-category attribute', () => {
      renderCardItem();
      
      const figure = screen.getByRole('figure');
      expect(figure).toHaveAttribute('data-category', 'Test Label');
    });
  });

  describe('structure', () => {
    it('should have proper DOM structure', () => {
      renderCardItem();
      
      const listItem = screen.getByRole('listitem');
      const link = screen.getByRole('link');
      const figure = screen.getByRole('figure');
      const image = screen.getByRole('img');
      const heading = screen.getByRole('heading', { level: 5 });
      
      expect(listItem).toContainElement(link);
      expect(link).toContainElement(figure);
      expect(link).toContainElement(heading);
      expect(figure).toContainElement(image);
    });

    it('should have correct CSS classes', () => {
      renderCardItem();
      
      const listItem = screen.getByRole('listitem');
      const link = screen.getByRole('link');
      const figure = screen.getByRole('figure');
      const image = screen.getByRole('img');
      const heading = screen.getByRole('heading', { level: 5 });
      
      expect(listItem).toHaveClass('cards__item');
      expect(link).toHaveClass('cards__item__link');
      expect(figure).toHaveClass('cards__item__pic-wrap');
      expect(image).toHaveClass('cards__item__img');
      expect(heading).toHaveClass('cards__item__text');
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderCardItem();
      
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test card text');
    });

    it('should have accessible link', () => {
      renderCardItem();
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-path');
    });

    it('should have semantic figure element', () => {
      renderCardItem();
      
      const figure = screen.getByRole('figure');
      expect(figure).toBeInTheDocument();
    });

    it('should have list item role', () => {
      renderCardItem();
      
      const listItem = screen.getByRole('listitem');
      expect(listItem).toBeInTheDocument();
    });
  });

  describe('content display', () => {
    it('should display the text content correctly', () => {
      renderCardItem({ text: 'Special adventure text' });
      
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toHaveTextContent('Special adventure text');
    });

    it('should display the label as data-category', () => {
      renderCardItem({ label: 'Adventure' });
      
      const figure = screen.getByRole('figure');
      expect(figure).toHaveAttribute('data-category', 'Adventure');
    });

    it('should set the correct image source', () => {
      renderCardItem({ src: 'adventure-image.jpg' });
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'adventure-image.jpg');
    });

    it('should set the correct link path', () => {
      renderCardItem({ path: '/adventure' });
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/adventure');
    });
  });
}); 