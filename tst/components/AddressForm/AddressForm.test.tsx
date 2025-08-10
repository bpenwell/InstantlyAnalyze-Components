import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressForm } from '../../../src/components/AddressForm/AddressForm';
import { BackendAPI, USState } from '@ben1000240/instantlyanalyze-module';

// Mock dependencies
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  BackendAPI: jest.fn(),
  USState: {
    ALABAMA: 'AL',
    ALASKA: 'AK',
    ARIZONA: 'AZ',
  },
  initialRentalCalculatorFormState: {
    propertyInformation: {
      streetAddress: '',
      city: '',
      state: 'AL',
      zipCode: '',
    },
  },
}));

jest.mock('../../../src/components/Input/Input', () => ({
  Input: ({ id, label, value, onChange, options }: any) => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{label}</label>
      {options ? (
        <select 
          id={id} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          data-testid={`select-${id}`}
        >
          {options.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input 
          id={id} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          data-testid={`input-field-${id}`}
        />
      )}
    </div>
  ),
}));

jest.mock('../../../src/components/LoadingBar/LoadingBar', () => ({
  LoadingBar: ({ text }: any) => (
    <div data-testid="loading-bar">{text}</div>
  ),
}));

jest.mock('@cloudscape-design/components', () => ({
  ColumnLayout: ({ children, columns }: any) => (
    <div data-testid="column-layout" data-columns={columns}>
      {children}
    </div>
  ),
}));

describe('AddressForm', () => {
  const mockOnAddressSubmit = jest.fn();
  const mockBackendAPI = {
    getPropertyInfoByAddress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (BackendAPI as jest.Mock).mockImplementation(() => mockBackendAPI);
  });

  const renderAddressForm = (props = {}) => {
    return render(
      <AddressForm 
        onAddressSubmit={mockOnAddressSubmit} 
        {...props} 
      />
    );
  };

  describe('rendering', () => {
    it('should render all form fields', () => {
      renderAddressForm();
      
      expect(screen.getByTestId('input-street')).toBeInTheDocument();
      expect(screen.getByTestId('input-city')).toBeInTheDocument();
      expect(screen.getByTestId('input-state')).toBeInTheDocument();
      expect(screen.getByTestId('input-zipCode')).toBeInTheDocument();
    });

    it('should render with column layout', () => {
      renderAddressForm();
      
      const columnLayout = screen.getByTestId('column-layout');
      expect(columnLayout).toBeInTheDocument();
      expect(columnLayout).toHaveAttribute('data-columns', '4');
    });

    it('should render labels for all fields', () => {
      renderAddressForm();
      
      expect(screen.getByText('Street')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('Zip Code')).toBeInTheDocument();
    });
  });

  describe('form interactions', () => {
    it('should update street address when input changes', async () => {
      const user = userEvent.setup();
      renderAddressForm();
      
      const streetInput = screen.getByTestId('input-field-street');
      await act(async () => {
        await user.type(streetInput, '123 Main St');
      });
      
      expect(streetInput).toHaveValue('123 Main St');
    });

    it('should update city when input changes', async () => {
      const user = userEvent.setup();
      renderAddressForm();
      
      const cityInput = screen.getByTestId('input-field-city');
      await act(async () => {
        await user.type(cityInput, 'New York');
      });
      
      expect(cityInput).toHaveValue('New York');
    });

    it('should update state when select changes', async () => {
      const user = userEvent.setup();
      renderAddressForm();
      
      const stateSelect = screen.getByTestId('select-state');
      await act(async () => {
        await user.selectOptions(stateSelect, 'AK');
      });
      
      expect(stateSelect).toHaveValue('AK');
    });

    it('should update zip code when input changes', async () => {
      const user = userEvent.setup();
      renderAddressForm();
      
      const zipInput = screen.getByTestId('input-field-zipCode');
      await act(async () => {
        await user.type(zipInput, '12345');
      });
      
      expect(zipInput).toHaveValue('12345');
    });
  });

  describe('API integration', () => {
    it('should call onAddressSubmit with property data when API succeeds', async () => {
      const mockPropertyData = { id: '123', address: '123 Main St' };
      mockBackendAPI.getPropertyInfoByAddress.mockResolvedValue(mockPropertyData);
      
      renderAddressForm();
      
      // Trigger form submission by setting triggerAddressSubmit to true
      renderAddressForm({ triggerAddressSubmit: true });
      
      await waitFor(() => {
        expect(mockBackendAPI.getPropertyInfoByAddress).toHaveBeenCalledWith({
          streetAddress: '',
          city: '',
          state: 'AL',
          zipCode: '',
        });
      });
      
      await waitFor(() => {
        expect(mockOnAddressSubmit).toHaveBeenCalledWith(mockPropertyData);
      });
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockBackendAPI.getPropertyInfoByAddress.mockRejectedValue(new Error('API Error'));
      
      renderAddressForm({ triggerAddressSubmit: true });
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching property data:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('loading states', () => {
    it('should show loading bar during API call', async () => {
      mockBackendAPI.getPropertyInfoByAddress.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({}), 100))
      );
      
      renderAddressForm({ triggerAddressSubmit: true });
      
      await waitFor(() => {
        expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
        expect(screen.getByText('Fetching property info...')).toBeInTheDocument();
      });
    });
  });

  describe('props validation', () => {
    it('should work without triggerAddressSubmit prop', () => {
      renderAddressForm();
      
      expect(screen.getByTestId('column-layout')).toBeInTheDocument();
    });

    it('should handle triggerAddressSubmit prop correctly', async () => {
      mockBackendAPI.getPropertyInfoByAddress.mockResolvedValue({});
      
      renderAddressForm({ triggerAddressSubmit: true });
      
      await waitFor(() => {
        expect(mockBackendAPI.getPropertyInfoByAddress).toHaveBeenCalled();
      });
    });
  });
}); 