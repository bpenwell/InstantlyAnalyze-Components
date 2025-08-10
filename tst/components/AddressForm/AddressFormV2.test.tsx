import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressFormV2 } from '../../../src/components/AddressForm/AddressFormV2';

// Mock dependencies
jest.mock('@mapbox/search-js-react', () => ({
  AddressAutofill: ({ children, onRetrieve }: any) => (
    <div data-testid="address-autofill" onClick={() => onRetrieve({ features: [{ properties: { address_line1: '123 Main St', address_line2: '', place: 'New York', region: 'NY', postcode: '10001', place_name: '123 Main St, New York, NY 10001' } }] })}>
      {children}
    </div>
  ),
}));

jest.mock('../../../src/components/LoadingBar/LoadingBar', () => ({
  LoadingBar: ({ text }: any) => <div data-testid="loading-bar">{text}</div>,
}));

jest.mock('@cloudscape-design/components', () => ({
  SpaceBetween: ({ children }: any) => <div data-testid="space-between">{children}</div>,
}));

const mockOnAddressSubmit = jest.fn();
const mockSetRentalData = jest.fn();
const mockBackendAPI = {
  getPropertyInfoByAddress: jest.fn().mockResolvedValue({ id: '1', address: '123 Main St, New York, NY 10001' }),
};

jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  BackendAPI: function () { return mockBackendAPI; },
}));

describe('AddressFormV2 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <AddressFormV2
        onAddressSubmit={mockOnAddressSubmit}
        setRentalData={mockSetRentalData}
        rentalData={{} as any}
      />
    );
    expect(screen.getByLabelText('Address:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your address')).toBeInTheDocument();
    expect(screen.getByTestId('address-autofill')).toBeInTheDocument();
  });

  it('should handle form submission via address selection', async () => {
    render(
      <AddressFormV2
        onAddressSubmit={mockOnAddressSubmit}
        setRentalData={mockSetRentalData}
        rentalData={{} as any}
      />
    );
    // Simulate address selection by clicking the autofill div
    fireEvent.click(screen.getByTestId('address-autofill'));
    await waitFor(() => {
      expect(mockOnAddressSubmit).toHaveBeenCalledWith({ id: '1', address: '123 Main St, New York, NY 10001' });
    });
  });

  it('should update input value on change', () => {
    render(
      <AddressFormV2
        onAddressSubmit={mockOnAddressSubmit}
        setRentalData={mockSetRentalData}
        rentalData={{} as any}
      />
    );
    const input = screen.getByPlaceholderText('Enter your address') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '456 Broadway' } });
    expect(input.value).toBe('456 Broadway');
  });

  it('should show loading bar when loading', async () => {
    // Make the API call take time to resolve
    mockBackendAPI.getPropertyInfoByAddress.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ id: '1', address: '123 Main St, New York, NY 10001' }), 100)));
    render(
      <AddressFormV2
        onAddressSubmit={mockOnAddressSubmit}
        setRentalData={mockSetRentalData}
        rentalData={{} as any}
      />
    );
    fireEvent.click(screen.getByTestId('address-autofill'));
    expect(await screen.findByTestId('loading-bar')).toBeInTheDocument();
    expect(screen.getByText('Fetching property info...')).toBeInTheDocument();
  });
}); 