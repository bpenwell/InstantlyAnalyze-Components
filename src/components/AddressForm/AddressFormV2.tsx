import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { v4 as uuidv4 } from 'uuid';
import { BackendAPI, IRentalCalculatorData, IRentcastPropertyData, MapboxFeatureCollection, PropertyAddress } from '@bpenwell/instantlyanalyze-module';
import { LoadingBar } from '../LoadingBar/LoadingBar';
import { Input } from '../Input/Input';
import { SpaceBetween, Container, Header, Button, Toggle, Alert } from '@cloudscape-design/components';
import { Mode } from '@cloudscape-design/global-styles';
import { useAppContext } from '../../utils/AppContextProvider';

export type ReturnPropertyData = (addressData: IRentcastPropertyData) => void;

interface AddressFormV2Props {
  onAddressSubmit: ReturnPropertyData;
  triggerAddressSubmit?: boolean;
  setRentalData: (data: IRentalCalculatorData) => void;
  rentalData: IRentalCalculatorData;
}

export interface AddressFormV2Ref {
  submitAddress: () => void;
  isFormValid: () => boolean;
}

export const MAPBOX_KEY =
  'pk.eyJ1IjoiYmVuMTAwMDI0MCIsImEiOiJjbHpxMGMzM2YxaHZoMmpuOHI0bXNsMnp4In0.7t4zu35byHmzPJBnqJ6Hgg';

export const AddressFormV2 = forwardRef<AddressFormV2Ref, AddressFormV2Props>(({
  onAddressSubmit,
  triggerAddressSubmit,
  setRentalData,
  rentalData,
}, ref) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    sqft: ''
  });
  const [error, setError] = useState<string | null>(null);
  const backendAPI: BackendAPI = new BackendAPI();
  const { getAppMode } = useAppContext();
  const appMode = getAppMode();

  const handleRetrieve = async (event: MapboxFeatureCollection | any) => {
    setLoading(true);
    setError(null);
    
    // Set a timeout for the entire lookup process
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Address lookup is taking too long. Please try manual entry instead.');
    }, 10000); // 10 second timeout
    
    const features = event.features;
    if (features && features.length > 0) {
      const property = features[0].properties;
      if (property) {
        const address: PropertyAddress = {
          streetAddress: property.address_line2 === '' ? property.address_line1 : `${property.address_line1} ${property.address_line2}`,
          city: property.place,
          state: property.region,
          zipCode: property.postcode,
        };
        
        try {
          const rentcastPropertyData: IRentcastPropertyData | any = await backendAPI.getPropertyInfoByAddress(address);
          clearTimeout(timeoutId);
          if (rentcastPropertyData.error) {
            //Set locally in case we come back
            setAddress(property.place_name);
            onAddressSubmit({
              address: property.place_name,
            });
            setRentalData({
              ...rentalData,
              propertyInformation: {
                city: address.city,
                state: address.state,
                streetAddress: address.streetAddress,
                zipCode: address.zipCode,
              },
            })
          }
          else {
            //Set locally in case we come back
            setAddress(property.place_name);
            //Push data up so it can update state
            onAddressSubmit(rentcastPropertyData);
          }

          //Remove loading bar
          setLoading(false);
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Error fetching property data:', error);
          setError('Failed to fetch property data from Mapbox. You can try manual entry instead.');
          setLoading(false);
          // Automatically suggest switching to manual input
          setTimeout(() => {
            if (!useManualInput) {
              setError('Mapbox lookup failed. Switching to manual entry mode...');
              setTimeout(() => {
                setUseManualInput(true);
                setError(null);
              }, 2000);
            }
          }, 3000);
        }
      }
    }
  };

  const handleManualSubmit = () => {
    if (!manualAddress.streetAddress || !manualAddress.city || !manualAddress.state) {
      setError('Please fill in at least street address, city, and state.');
      return;
    }

    // Validate that property details are provided
    if (!manualAddress.bedrooms || !manualAddress.bathrooms || !manualAddress.sqft) {
      setError('Property details (bedrooms, bathrooms, and square footage) are required to continue.');
      return;
    }

    const address: PropertyAddress = {
      streetAddress: manualAddress.streetAddress,
      city: manualAddress.city,
      state: manualAddress.state,
      zipCode: manualAddress.zipCode,
    };

    // Update rental data with manual input
    setRentalData({
      ...rentalData,
      propertyInformation: {
        ...rentalData.propertyInformation,
        streetAddress: manualAddress.streetAddress,
        city: manualAddress.city,
        state: manualAddress.state,
        zipCode: manualAddress.zipCode,
        bedrooms: Number(manualAddress.bedrooms),
        bathrooms: Number(manualAddress.bathrooms),
        sqft: Number(manualAddress.sqft),
      },
    });

    // Submit with basic address data
    onAddressSubmit({
      address: `${manualAddress.streetAddress}, ${manualAddress.city}, ${manualAddress.state}`,
    });

    setError(null);
  };

  const handleManualInputChange = (field: string, value: string) => {
    setManualAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle triggerAddressSubmit from parent
  useEffect(() => {
    if (triggerAddressSubmit) {
      // Clear any existing errors first
      setError(null);
      
      if (useManualInput) {
        handleManualSubmit();
      } else if (address.trim()) {
        // For automatic mode, trigger the address selection
        handleRetrieve({
          features: [{
            properties: {
              address_line1: address,
              place: address,
              region: '',
              postcode: '',
              place_name: address
            }
          }]
        });
      }
    }
  }, [triggerAddressSubmit]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    submitAddress: () => {
      // Clear any existing errors first
      setError(null);
      
      if (useManualInput) {
        handleManualSubmit();
      } else if (address.trim()) {
        // For automatic mode, trigger the address selection
        handleRetrieve({
          features: [{
            properties: {
              address_line1: address,
              place: address,
              region: '',
              postcode: '',
              place_name: address
            }
          }]
        });
      }
    },
    isFormValid: () => {
      if (useManualInput) {
        return !!(manualAddress.streetAddress && manualAddress.city && manualAddress.state && 
                 manualAddress.bedrooms && manualAddress.bathrooms && manualAddress.sqft);
      } else {
        return !!address.trim();
      }
    }
  }));

  return (
    <div className={appMode} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Container>
        <Header variant="h3">Property Info</Header>
        
        <SpaceBetween size="m">
          {/* Address Input Mode Selector */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              backgroundColor: appMode === Mode.Dark ? '#3a3a3a' : '#f0f0f0',
              borderRadius: '8px',
              padding: '4px',
              border: `1px solid ${appMode === Mode.Dark ? '#555' : '#d1d5db'}`
            }}>
              <button
                onClick={() => {
                  setUseManualInput(false);
                  setError(null);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: !useManualInput ? (appMode === Mode.Dark ? '#0073bb' : '#0073bb') : 'transparent',
                  color: !useManualInput ? '#ffffff' : (appMode === Mode.Dark ? '#aab7b8' : '#687078'),
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
              >
                🔍 Automatic Lookup
              </button>
              <button
                onClick={() => {
                  setUseManualInput(true);
                  setError(null);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: useManualInput ? (appMode === Mode.Dark ? '#0073bb' : '#0073bb') : 'transparent',
                  color: useManualInput ? '#ffffff' : (appMode === Mode.Dark ? '#aab7b8' : '#687078'),
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
              >
                ✏️ Manual Entry
              </button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <Alert type="error" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Automatic Address Lookup */}
          {!useManualInput && (
            <div>
              <label
                htmlFor="address-input"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: appMode === Mode.Dark ? '#ffffff' : '#16191f'
                }}
              >
                Enter Address:
              </label>
              
              <AddressAutofill
                accessToken={MAPBOX_KEY}
                onRetrieve={handleRetrieve}
              >
                <input
                  id="address-input"
                  placeholder="Start typing your address..."
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="shipping street-address"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '2px solid #e1e5e9',
                    backgroundColor: appMode === Mode.Dark ? '#2d2d2d' : '#ffffff',
                    color: appMode === Mode.Dark ? '#ffffff' : '#16191f',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0073bb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 115, 187, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e1e5e9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </AddressAutofill>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: appMode === Mode.Dark ? '#aab7b8' : '#687078'
                }}>
                  Powered by Mapbox. If this doesn't work, try manual entry.
                </div>
              </div>
            </div>
          )}

          {/* Manual Address Entry */}
          {useManualInput && (
            <div>
              <SpaceBetween size="s">
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: appMode === Mode.Dark ? '#ffffff' : '#16191f',
                  marginBottom: '8px'
                }}>
                  Enter Property Details:
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '12px',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <Input
                    id="manual-street-address"
                    label="Street Address"
                    value={manualAddress.streetAddress}
                    onChange={(value) => handleManualInputChange('streetAddress', value)}
                    placeholder="123 Main St"
                    required
                  />
                  <Input
                    id="manual-city"
                    label="City"
                    value={manualAddress.city}
                    onChange={(value) => handleManualInputChange('city', value)}
                    placeholder="Anytown"
                    required
                  />
                  <Input
                    id="manual-state"
                    label="State"
                    value={manualAddress.state}
                    onChange={(value) => handleManualInputChange('state', value)}
                    placeholder="CA"
                    required
                  />
                  <Input
                    id="manual-zip"
                    label="Zip Code"
                    value={manualAddress.zipCode}
                    onChange={(value) => handleManualInputChange('zipCode', value)}
                    placeholder="12345"
                  />
                </div>

                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: appMode === Mode.Dark ? '#ffffff' : '#16191f',
                  marginTop: '16px',
                  marginBottom: '8px'
                }}>
                  Property Details (Required):
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '12px',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <Input
                    id="manual-bedrooms"
                    label="Bedrooms"
                    type="number"
                    value={manualAddress.bedrooms}
                    onChange={(value) => handleManualInputChange('bedrooms', value)}
                    placeholder="3"
                    required
                  />
                  <Input
                    id="manual-bathrooms"
                    label="Bathrooms"
                    type="number"
                    value={manualAddress.bathrooms}
                    onChange={(value) => handleManualInputChange('bathrooms', value)}
                    placeholder="2"
                    required
                  />
                  <Input
                    id="manual-sqft"
                    label="Square Feet"
                    type="number"
                    value={manualAddress.sqft}
                    onChange={(value) => handleManualInputChange('sqft', value)}
                    placeholder="1500"
                    required
                  />
                </div>

                <div style={{ 
                  fontSize: '12px', 
                  color: appMode === Mode.Dark ? '#aab7b8' : '#687078',
                  marginTop: '16px'
                }}>
                  Fill in all required fields including property details to continue.
                </div>
              </SpaceBetween>
            </div>
          )}

          {/* Loading indicator */}
          {loading && <LoadingBar text='Fetching property info...'/>}
        </SpaceBetween>
      </Container>
    </div>
  );
});