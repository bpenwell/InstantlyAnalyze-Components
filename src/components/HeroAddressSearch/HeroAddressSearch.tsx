import React, { useState } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { PropertyAddress, MapboxFeatureCollection, LOCAL_STORAGE_KEYS, save, PAGE_PATH, RedirectAPI, BackendAPI } from '@bpenwell/instantlyanalyze-module';
import { Input, Button, SpaceBetween, Toggle, Alert, Box } from '@cloudscape-design/components';
import { Mode } from '@cloudscape-design/global-styles';
import { useAppContext } from '../../utils/AppContextProvider';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingBar } from '../LoadingBar/LoadingBar';

export const MAPBOX_KEY = 'pk.eyJ1IjoiYmVuMTAwMDI0MCIsImEiOiJjbHpxMGMzM2YxaHZoMmpuOHI0bXNsMnp4In0.7t4zu35byHmzPJBnqJ6Hgg';

interface HeroAddressSearchProps {
  onAddressEntered?: (address: PropertyAddress) => void;
}

export const HeroAddressSearch: React.FC<HeroAddressSearchProps> = ({ onAddressEntered }) => {
  const [useManualInput, setUseManualInput] = useState(false);
  const [autocompleteAddress, setAutocompleteAddress] = useState('');
  const [manualAddress, setManualAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getAppMode } = useAppContext();
  const { isAuthenticated } = useAuth0();
  const appMode = getAppMode();
  const redirectApi = new RedirectAPI();
  const backendAPI = new BackendAPI();

  const handleMapboxRetrieve = async (event: MapboxFeatureCollection | any) => {
    setLoading(true);
    setError(null);

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
          // Fetch full property data from backend (beds, baths, sqft, etc.)
          const propertyData = await backendAPI.getPropertyInfoByAddress(address);

          // Store the complete property data response
          save(LOCAL_STORAGE_KEYS.ENTERED_ADDRESS_DATA, propertyData);

          setLoading(false);

          // Call optional callback
          if (onAddressEntered) {
            onAddressEntered(address);
          }

          // Redirect based on authentication
          redirectToReportCreation();
        } catch (error) {
          console.error('Error fetching property data:', error);
          setLoading(false);
          setError('Failed to fetch property details. Please try again or use manual entry.');
        }
      }
    }
  };

  const handleManualSubmit = () => {
    if (!manualAddress.streetAddress || !manualAddress.city || !manualAddress.state) {
      setError('Please fill in at least street address, city, and state.');
      return;
    }

    // Create a minimal property data object for manual entry
    const manualPropertyData = {
      address: `${manualAddress.streetAddress}, ${manualAddress.city}, ${manualAddress.state}${manualAddress.zipCode ? ' ' + manualAddress.zipCode : ''}`,
      propertyData: [{
        address: manualAddress.streetAddress,
        city: manualAddress.city,
        state: manualAddress.state,
        zipCode: manualAddress.zipCode || '',
        // These will be empty for manual entry - user will fill in wizard
        bedrooms: 0,
        bathrooms: 0,
        squareFootage: 0,
      }]
    };

    // Save the property data object to localStorage
    save(LOCAL_STORAGE_KEYS.ENTERED_ADDRESS_DATA, manualPropertyData);

    // Call optional callback
    if (onAddressEntered) {
      onAddressEntered({
        streetAddress: manualAddress.streetAddress,
        city: manualAddress.city,
        state: manualAddress.state,
        zipCode: manualAddress.zipCode,
      });
    }

    // Redirect based on authentication
    redirectToReportCreation();
  };

  const redirectToReportCreation = () => {
    // Check if authenticated
    if (isAuthenticated) {
      // Go directly to step 1 (Property Type & Strategy) of report creation
      window.location.href = `${PAGE_PATH.RENTAL_CALCULATOR_CREATE}?step=1`;
    } else {
      // Save redirect destination and go to login
      save(LOCAL_STORAGE_KEYS.REDIRECT_AFTER_LOGIN, `${PAGE_PATH.RENTAL_CALCULATOR_CREATE}?step=1`);
      redirectApi.redirectToPage(PAGE_PATH.LOGIN);
    }
  };

  return (
    <div className="w-full">
      {loading && <LoadingBar />}

      <SpaceBetween size="m">
        {error && (
          <Alert type="error" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box>
          <Toggle
            checked={useManualInput}
            onChange={({ detail }) => setUseManualInput(detail.checked)}
          >
            Manual entry
          </Toggle>
        </Box>

        {!useManualInput ? (
          <div className="relative">
            <form>
              <AddressAutofill accessToken={MAPBOX_KEY} onRetrieve={handleMapboxRetrieve}>
                <Input
                  value={autocompleteAddress}
                  onChange={({ detail }) => setAutocompleteAddress(detail.value)}
                  placeholder="Enter property address"
                  name="address"
                  autoComplete="address-line1"
                  ariaLabel="Property address"
                  type="text"
                  inputMode="text"
                />
              </AddressAutofill>
            </form>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Start typing an address and select from suggestions
            </p>
          </div>
        ) : (
          <div>
            <SpaceBetween size="s">
              <Input
                value={manualAddress.streetAddress}
                onChange={({ detail }) => setManualAddress({ ...manualAddress, streetAddress: detail.value })}
                placeholder="Street Address"
                ariaLabel="Street Address"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={manualAddress.city}
                  onChange={({ detail }) => setManualAddress({ ...manualAddress, city: detail.value })}
                  placeholder="City"
                  ariaLabel="City"
                />
                <Input
                  value={manualAddress.state}
                  onChange={({ detail }) => setManualAddress({ ...manualAddress, state: detail.value })}
                  placeholder="State"
                  ariaLabel="State"
                />
              </div>
              <Input
                value={manualAddress.zipCode}
                onChange={({ detail }) => setManualAddress({ ...manualAddress, zipCode: detail.value })}
                placeholder="Zip Code (optional)"
                ariaLabel="Zip Code"
              />
              <Button variant="primary" onClick={handleManualSubmit} fullWidth>
                Analyze Property
              </Button>
            </SpaceBetween>
          </div>
        )}
      </SpaceBetween>
    </div>
  );
};
