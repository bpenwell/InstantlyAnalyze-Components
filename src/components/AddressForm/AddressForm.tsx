import React, { useState } from 'react';
import { Input } from '../Input/Input';
import {
  BackendAPI,
  initialRentalCalculatorFormState,
  PropertyAddress,
  USState,
  IRentcastPropertyData,
} from '@bpenwell/rei-module';

export type ReturnPropertyData = (addressData: any) => void;

export const AddressForm = ({ returnResponseData }: { returnResponseData: ReturnPropertyData }) => {
  const [streetAddress, setStreetAddress] = useState(initialRentalCalculatorFormState.propertyInformation.streetAddress);
  const [city, setCity] = useState(initialRentalCalculatorFormState.propertyInformation.city);
  const [state, setState] = useState(initialRentalCalculatorFormState.propertyInformation.state);
  const [zipCode, setZipCode] = useState(initialRentalCalculatorFormState.propertyInformation.zipCode);

  const handleSubmit = async () => {
    // Construct the full address object
    const address: PropertyAddress = {
      streetAddress,
      city,
      state,
      zipCode,
    };

    try {
      const backendAPI: BackendAPI = new BackendAPI();
      const rentcastPropertyData: IRentcastPropertyData = await backendAPI.getPropertyInfoByAddress(address);
      // Pass the data back to the parent component to handle
      returnResponseData(rentcastPropertyData);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  return (
    <div>
      <h3>Enter Property Address</h3>
      <Input
        id="street"
        label="Street"
        value={streetAddress}
        onChange={(value: string) => setStreetAddress(value)}
      />
      <Input
        id="city"
        label="City"
        value={city}
        onChange={(value: string) => setCity(value)}
      />
      <Input
        id="state"
        label="State"
        value={state}
        options={Object.values(USState)}
        onChange={(value: USState) => setState(value)}
      />
      <Input
        id="zipCode"
        label="Zip Code"
        value={zipCode}
        onChange={(value: string) => setZipCode(value)}
      />
      <button onClick={handleSubmit}>Get Property Data</button>
    </div>
  );
};
