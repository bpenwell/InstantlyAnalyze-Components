import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComingSoonWrapper } from '../../../src/components/ComingSoonWrapper/ComingSoonWrapper';

describe('ComingSoonWrapper', () => {
  const defaultProps = {
    children: <div data-testid="child-content">Child Content</div>
  };

  const renderComingSoonWrapper = (props = {}) => {
    return render(<ComingSoonWrapper {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render children content', () => {
      renderComingSoonWrapper();
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render with default coming soon text', () => {
      renderComingSoonWrapper();
      
      expect(screen.getByText('Coming soon!')).toBeInTheDocument();
    });

    it('should render with custom coming soon text', () => {
      renderComingSoonWrapper({ text: 'Custom coming soon message' });
      
      expect(screen.getByText('Custom coming soon message')).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      renderComingSoonWrapper();
      
      const wrapper = screen.getByTestId('child-content').closest('.relative');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('rounded-lg', 'overflow-hidden');
    });

    it('should have overlay with correct styling', () => {
      renderComingSoonWrapper();
      
      const overlay = screen.getByText('Coming soon!').closest('.absolute');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        'inset-0',
        'bg-black',
        'bg-opacity-50',
        'flex',
        'justify-center',
        'items-center',
        'text-white',
        'text-2xl',
        'font-bold',
        'z-10',
        'rounded-lg'
      );
    });

    it('should render multiple children', () => {
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </>
      );
      
      renderComingSoonWrapper({ children: multipleChildren });
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('should render complex children components', () => {
      const complexChild = (
        <div data-testid="complex-child">
          <h1>Title</h1>
          <p>Description</p>
          <button>Click me</button>
        </div>
      );
      
      renderComingSoonWrapper({ children: complexChild });
      
      expect(screen.getByTestId('complex-child')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });
  });
}); 