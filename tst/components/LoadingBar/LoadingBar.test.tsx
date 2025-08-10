import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingBar } from '../../../src/components/LoadingBar/LoadingBar';

// Mock the cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  Box: ({ children, textAlign, margin, color }: any) => (
    <div 
      data-testid="box"
      data-text-align={textAlign}
      data-margin={JSON.stringify(margin)}
      data-color={color}
    >
      {children}
    </div>
  ),
}));

// Mock the chat components loading bar - fix the namespace import structure
jest.mock('@cloudscape-design/chat-components/loading-bar', () => ({
  __esModule: true,
  default: ({ variant }: any) => (
    <div data-testid="loading-bar" data-variant={variant}>
      Loading Bar Component
    </div>
  ),
  LoadingBarProps: {
    Variant: {
      'GEN_AI_MASKED': 'gen-ai-masked',
      'GEN_AI_UNMASKED': 'gen-ai-unmasked',
    },
  },
}));

// Mock the Box component
jest.mock('@cloudscape-design/components/box', () => ({
  __esModule: true,
  default: ({ children, textAlign, margin, color }: any) => (
    <div 
      data-testid="box"
      data-text-align={textAlign}
      data-margin={JSON.stringify(margin)}
      data-color={color}
    >
      {children}
    </div>
  ),
}));

describe('LoadingBar', () => {
  const renderLoadingBar = (props = {}) => {
    return render(<LoadingBar {...props} />);
  };

  describe('rendering', () => {
    it('should render with default props', () => {
      renderLoadingBar();
      
      const loadingBar = screen.getByTestId('loading-bar');
      const box = screen.getByTestId('box');
      
      expect(loadingBar).toBeInTheDocument();
      expect(box).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      renderLoadingBar({ text: 'Loading data...' });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent('Loading data...');
    });

    it('should render with custom variant', () => {
      renderLoadingBar({ variant: 'gen-ai-unmasked' });
      
      const loadingBar = screen.getByTestId('loading-bar');
      expect(loadingBar).toHaveAttribute('data-variant', 'gen-ai-unmasked');
    });

    it('should render with undefined text', () => {
      renderLoadingBar({ text: undefined });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent('');
    });

    it('should render with empty text', () => {
      renderLoadingBar({ text: '' });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent('');
    });
  });

  describe('props validation', () => {
    it('should use default variant when not provided', () => {
      renderLoadingBar();
      
      const loadingBar = screen.getByTestId('loading-bar');
      expect(loadingBar).toHaveAttribute('data-variant', 'gen-ai-masked');
    });

    it('should handle different variant types', () => {
      const variants = ['gen-ai-masked', 'gen-ai-unmasked'];
      
      variants.forEach(variant => {
        const { unmount } = renderLoadingBar({ variant });
        
        const loadingBar = screen.getByTestId('loading-bar');
        expect(loadingBar).toHaveAttribute('data-variant', variant);
        
        unmount();
      });
    });

    it('should handle long text content', () => {
      const longText = 'This is a very long loading message that should be displayed properly in the loading bar component';
      renderLoadingBar({ text: longText });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent(longText);
    });

    it('should handle special characters in text', () => {
      const specialText = 'Loading... 50% complete! 🚀';
      renderLoadingBar({ text: specialText });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent(specialText);
    });
  });

  describe('accessibility', () => {
    it('should have aria-live attribute', () => {
      renderLoadingBar();
      
      const container = screen.getByTestId('loading-bar').parentElement;
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('should be accessible to screen readers', () => {
      renderLoadingBar({ text: 'Loading data...' });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent('Loading data...');
    });

    it('should maintain accessibility with empty text', () => {
      renderLoadingBar({ text: '' });
      
      const container = screen.getByTestId('loading-bar').parentElement;
      expect(container).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('styling and layout', () => {
    it('should have correct box styling', () => {
      renderLoadingBar();
      
      const box = screen.getByTestId('box');
      expect(box).toHaveAttribute('data-text-align', 'center');
      expect(box).toHaveAttribute('data-color', 'text-body-secondary');
      expect(box).toHaveAttribute('data-margin', '{"bottom":"xs","left":"l"}');
    });

    it('should maintain consistent styling with different props', () => {
      renderLoadingBar({ text: 'Custom text', variant: 'gen-ai-unmasked' });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveAttribute('data-text-align', 'center');
      expect(box).toHaveAttribute('data-color', 'text-body-secondary');
      expect(box).toHaveAttribute('data-margin', '{"bottom":"xs","left":"l"}');
    });
  });

  describe('component structure', () => {
    it('should have proper DOM structure', () => {
      renderLoadingBar({ text: 'Loading...' });
      
      const container = screen.getByTestId('loading-bar').parentElement;
      const box = screen.getByTestId('box');
      const loadingBar = screen.getByTestId('loading-bar');
      
      expect(container).toContainElement(box);
      expect(container).toContainElement(loadingBar);
    });

    it('should render loading bar component', () => {
      renderLoadingBar();
      
      const loadingBar = screen.getByTestId('loading-bar');
      expect(loadingBar).toHaveTextContent('Loading Bar Component');
    });
  });

  describe('edge cases', () => {
    it('should handle null text prop', () => {
      renderLoadingBar({ text: null as any });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent('');
    });

    it('should handle numeric text prop', () => {
      renderLoadingBar({ text: 123 as any });
      
      const box = screen.getByTestId('box');
      expect(box).toHaveTextContent('123');
    });

    it('should handle boolean text prop', () => {
      renderLoadingBar({ text: true as any });
      
      const box = screen.getByTestId('box');
      // Boolean true renders as empty string in JSX
      expect(box).toHaveTextContent('');
    });
  });
}); 