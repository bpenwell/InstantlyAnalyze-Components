import React, { useState, useEffect } from 'react';
import { Input } from '../Input/Input';
import {
  BackendAPI,
  initialRentalCalculatorFormState,
  PropertyAddress,
  USState,
  IRentcastPropertyData,
} from '@bpenwell/instantlyanalyze-module';
import { Button } from '../Button/Button';
import './AddressForm.css';
import { LoadingBar } from '../LoadingBar/LoadingBar';
import { ColumnLayout } from '@cloudscape-design/components';

export type ReturnPropertyData = (addressData: any) => void;

export const AddressForm = ({ onAddressSubmit, triggerAddressSubmit }: { onAddressSubmit: ReturnPropertyData, triggerAddressSubmit?: boolean }) => {
  const [streetAddress, setStreetAddress] = useState(initialRentalCalculatorFormState.propertyInformation.streetAddress);
  const [city, setCity] = useState(initialRentalCalculatorFormState.propertyInformation.city);
  const [state, setState] = useState(initialRentalCalculatorFormState.propertyInformation.state);
  const [zipCode, setZipCode] = useState(initialRentalCalculatorFormState.propertyInformation.zipCode);
  const [loading, setLoading] = useState(false);
  const backendAPI = new BackendAPI();

  const handleSubmit = async () => {
    setLoading(true);
    const address: PropertyAddress = {
      streetAddress,
      city,
      state,
      zipCode,
    };

    try {
      const rentcastPropertyData: IRentcastPropertyData = await backendAPI.getPropertyInfoByAddress(address);
      onAddressSubmit(rentcastPropertyData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    if (!triggerAddressSubmit) { return; }
    handleSubmit();
  }, [triggerAddressSubmit]);

  return (
    <div>
      <ColumnLayout columns={4}>
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
      </ColumnLayout>
      { loading ? <LoadingBar text='Fetching property info...'/> : <></>}
    </div>
  );
};