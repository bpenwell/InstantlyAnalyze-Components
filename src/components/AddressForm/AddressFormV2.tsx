import React, { useState, useRef } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { v4 as uuidv4 } from 'uuid';
import { BackendAPI, IRentcastPropertyData, MapboxFeatureCollection, PropertyAddress } from '@bpenwell/instantlyanalyze-module';
import { LoadingBar } from '../LoadingBar/LoadingBar';
import { SpaceBetween } from '@cloudscape-design/components';

export type ReturnPropertyData = (addressData: IRentcastPropertyData) => void;

interface AddressFormV2Props {
  onAddressSubmit: ReturnPropertyData;
  triggerAddressSubmit?: boolean;
}

export const MAPBOX_KEY =
  'pk.eyJ1IjoiYmVuMTAwMDI0MCIsImEiOiJjbHpxMGMzM2YxaHZoMmpuOHI0bXNsMnp4In0.7t4zu35byHmzPJBnqJ6Hgg';

export const AddressFormV2: React.FC<AddressFormV2Props> = ({
  onAddressSubmit,
  triggerAddressSubmit,
}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const backendAPI: BackendAPI = new BackendAPI();

  const handleRetrieve = async (event: MapboxFeatureCollection | any) => {
    setLoading(true);
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
          const rentcastPropertyData: IRentcastPropertyData = await backendAPI.getPropertyInfoByAddress(address);
          //Set locally in case we come back
          setAddress(property.place_name);
          //Push data up so it can update state
          onAddressSubmit(rentcastPropertyData);
          //Remove loading bar
          setLoading(false);
        } catch (error) {
          console.error('Error fetching property data:', error);
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <label
        htmlFor="address-input"
        style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
      >
        Address:
      </label>
      
      <SpaceBetween size='m'>
        <AddressAutofill
          accessToken={MAPBOX_KEY}
          onRetrieve={handleRetrieve}
        >
          <input
            id="address-input"
            placeholder="Enter your address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="shipping street-address"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </AddressAutofill>
        { loading ? <LoadingBar text='Fetching property info...'/> : <></>}
      </SpaceBetween>
    </div>
  );
};