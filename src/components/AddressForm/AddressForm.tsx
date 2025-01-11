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

export type ReturnPropertyData = (addressData: any) => void;

export const AddressForm = ({ returnResponseData, triggerNavigate }: { returnResponseData: ReturnPropertyData, triggerNavigate?: boolean }) => {
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
      console.log('rentcastPropertyData');
      console.log(rentcastPropertyData);
      returnResponseData(rentcastPropertyData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    if (!triggerNavigate) { return; }
    handleSubmit();
  }, [triggerNavigate]);

  return (
    <div className='addressFormContainer'>
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
      { loading ? <LoadingBar text='Fetching property info...'/> : <></>}
      {/* triggerSubmit is currently optional to ensure V2 still works */}
      { triggerNavigate !== undefined ? (<></>) : (
          <Button
            buttonType={"primary"}
            size="small"
            onClick={handleSubmit}
            style={{padding: "10px 20px", margin: "10px 0px 5px 10px"}}
            label="Get Property Data"
            loading={loading}
          />
        )
      }
    </div>
  );
};