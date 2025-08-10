import React from 'react';
import { render, screen } from '@testing-library/react';
import { Asterisk } from '../../../src/components/Asterisk/Asterisk';

describe('Asterisk', () => {
  it('should render asterisk character', () => {
    render(<Asterisk>*</Asterisk>);
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
  });

  it('should render with custom content', () => {
    render(<Asterisk>Required</Asterisk>);
    
    const asterisk = screen.getByText('Required');
    expect(asterisk).toBeInTheDocument();
  });

  it('should have red color styling', () => {
    render(<Asterisk>*</Asterisk>);
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveStyle({ color: 'red' });
  });

  it('should have left margin styling', () => {
    render(<Asterisk>*</Asterisk>);
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveStyle({ marginLeft: '4px' });
  });

  it('should render as a span element', () => {
    render(<Asterisk>*</Asterisk>);
    
    const asterisk = screen.getByText('*');
    expect(asterisk.tagName).toBe('SPAN');
  });

  it('should be accessible', () => {
    render(<Asterisk aria-label="Required field">*</Asterisk>);
    
    const asterisk = screen.getByLabelText('Required field');
    expect(asterisk).toBeInTheDocument();
  });
}); 