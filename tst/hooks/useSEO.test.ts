import { renderHook } from '@testing-library/react';
import { useSEO } from '../../src/hooks/useSEO';
import { PropertyInformation } from '@bpenwell/instantlyanalyze-module';

// Mock window.location
const mockLocation = {
  pathname: '/analyze/properties/view/123',
  href: 'https://instantlyanalyze.com/analyze/properties/view/123'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('useSEO Hook', () => {
  beforeEach(() => {
    // Reset document title before each test
    document.title = '';
    
    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });
  });

  it('should return fallback title for property pages without property info', () => {
    const { result } = renderHook(() => useSEO());
    
    expect(result.current).toEqual({
      title: "Analyze Properties | InstantlyAnalyze",
      description: "Detailed property analysis and investment evaluation for this property. View comprehensive ROI, cash flow, and cap rate calculations.",
      keywords: "property analysis, real estate investment, rental property analysis, cash flow, ROI, cap rate, property evaluation, real estate calculator",
      canonicalUrl: "https://instantlyanalyze.com/analyze/properties/view/123"
    });
  });

  it('should return formatted title for property pages with property info', () => {
    const mockPropertyInfo: PropertyInformation = {
      streetAddress: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    };

    const { result } = renderHook(() => useSEO({ propertyInfo: mockPropertyInfo }));
    
    expect(result.current).toEqual({
      title: "123 Main St - Property Analysis | InstantlyAnalyze",
      description: "Detailed property analysis and investment evaluation for 123 Main St, Anytown, CA. View comprehensive ROI, cash flow, and cap rate calculations.",
      keywords: "property analysis, real estate investment, rental property analysis, cash flow, ROI, cap rate, property evaluation, real estate calculator",
      canonicalUrl: "https://instantlyanalyze.com/analyze/properties/view/123"
    });
  });

  it('should handle share pages correctly', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/analyze/properties/share/456',
        href: 'https://instantlyanalyze.com/analyze/properties/share/456'
      },
      writable: true
    });

    const mockPropertyInfo: PropertyInformation = {
      streetAddress: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    };

    const { result } = renderHook(() => useSEO({ propertyInfo: mockPropertyInfo }));
    
    expect(result.current).toEqual({
      title: "456 Oak Ave - Property Analysis | InstantlyAnalyze",
      description: "Detailed property analysis and investment evaluation for 456 Oak Ave, Springfield, IL. View comprehensive ROI, cash flow, and cap rate calculations.",
      keywords: "property analysis, real estate investment, rental property analysis, cash flow, ROI, cap rate, property evaluation, real estate calculator",
      canonicalUrl: "https://instantlyanalyze.com/analyze/properties/share/456"
    });
  });

  it('should return SEO config for non-property pages', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/dashboard',
        href: 'https://instantlyanalyze.com/dashboard'
      },
      writable: true
    });

    const { result } = renderHook(() => useSEO());
    
    expect(result.current).toEqual({
      title: "Dashboard - InstantlyAnalyze Property Analysis Reports",
      description: "View and manage your property analysis reports. Access your rental property calculations, cash flow analysis, and investment property evaluations in one convenient dashboard.",
      keywords: "property analysis dashboard, rental property reports, real estate analysis, investment property dashboard, cash flow reports, property calculator results"
    });
  });

  it('should return null for unknown pages', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/unknown-page',
        href: 'https://instantlyanalyze.com/unknown-page'
      },
      writable: true
    });

    const { result } = renderHook(() => useSEO());
    
    expect(result.current).toBeNull();
  });
});
