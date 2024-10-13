// Polyfills must be imported before any other code
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import 'construct-style-sheets-polyfill';
import React, { useState } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';

export const AddressFormV2 = () => {
  const [address, setAddress] = useState('');

  const handleRetrieve = (event: any) => {
    const feature = event.features[0];
    console.log('Selected address:', feature);
    // Extract address components from feature.properties if needed
  };

  return (
    <AddressAutofill
      accessToken="YOUR_MAPBOX_ACCESS_TOKEN"
      onRetrieve={handleRetrieve}
    >
      <input
        placeholder="Enter your address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        autoComplete="shipping street-address"
      />
    </AddressAutofill>
  );
}