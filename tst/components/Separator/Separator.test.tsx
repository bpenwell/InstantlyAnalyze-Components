import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '../../../src/components/Separator/Separator';

describe('Separator', () => {
  const renderSeparator = (props = {}) => {
    return render(<Separator {...props} />);
  };

  describe('rendering', () => {
    it('should render separator container', () => {
      renderSeparator();
      
      const container = screen.getByTestId('separator-container');
      expect(container).toBeInTheDocument();
    });

    it('should render separator line', () => {
      renderSeparator();
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toBeInTheDocument();
    });

    it('should render with default width', () => {
      renderSeparator();
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '60%' });
    });

    it('should render with custom width', () => {
      renderSeparator({ width: 80 });
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '80%' });
    });
  });

  describe('styling', () => {
    it('should have correct CSS classes', () => {
      renderSeparator();
      
      const container = screen.getByTestId('separator-container');
      expect(container).toHaveClass('separator-container');
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveClass('separator');
    });

    it('should apply custom width percentage', () => {
      renderSeparator({ width: 100 });
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '100%' });
    });

    it('should handle zero width', () => {
      renderSeparator({ width: 0 });
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '0%' });
    });
  });

  describe('edge cases', () => {
    it('should handle negative width gracefully', () => {
      renderSeparator({ width: -10 });
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '-10%' });
    });

    it('should handle width over 100', () => {
      renderSeparator({ width: 150 });
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '150%' });
    });

    it('should handle undefined width', () => {
      renderSeparator({ width: undefined });
      
      const separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '60%' }); // Default value
    });
  });

  describe('structure', () => {
    it('should have proper DOM structure', () => {
      renderSeparator();
      
      const container = screen.getByTestId('separator-container');
      const separatorLine = screen.getByTestId('separator-line');
      
      expect(container).toContainElement(separatorLine);
    });

    it('should render multiple separators independently', () => {
      const { rerender } = renderSeparator({ width: 50 });
      
      let separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '50%' });
      
      rerender(<Separator width={75} />);
      
      separatorLine = screen.getByTestId('separator-line');
      expect(separatorLine).toHaveStyle({ width: '75%' });
    });
  });
});