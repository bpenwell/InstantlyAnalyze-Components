import React from 'react';
import { render, screen } from '@testing-library/react';
import { TermsOfUse } from '../../../src/components/Footer/TermsOfUse';

// Mock dependencies
jest.mock('@cloudscape-design/components', () => ({
  Box: ({ children }: any) => <div data-testid="box">{children}</div>,
  TextContent: ({ children }: any) => <div data-testid="text-content">{children}</div>,
}));

describe('TermsOfUse Component', () => {
  it('should render without crashing', () => {
    render(<TermsOfUse />);
    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(screen.getByTestId('text-content')).toBeInTheDocument();
  });

  it('should display terms content correctly', () => {
    render(<TermsOfUse />);
    const content = screen.getByTestId('text-content');
    expect(content).toHaveTextContent('The calculators provided by this tool are intended for informational and educational purposes only');
    expect(content.querySelector('small')).toBeInTheDocument();
  });

  it('should be wrapped in a small tag', () => {
    render(<TermsOfUse />);
    const smallTag = screen.getByText((content, element) => element?.tagName.toLowerCase() === 'small');
    expect(smallTag).toBeInTheDocument();
  });
}); 