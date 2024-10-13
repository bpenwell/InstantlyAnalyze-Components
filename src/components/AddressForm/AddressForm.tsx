  import React, { useState } from 'react';
  import { Input } from '../Input/Input';
  import {
    BackendAPI,
    initialRentalCalculatorFormState,
    PropertyAddress,
    USState,
    IRentcastPropertyData,
  } from '@bpenwell/rei-module';
  import { Button } from '../Button/Button';
  import './AddressForm.css';

  export type ReturnPropertyData = (addressData: any) => void;

  export const AddressForm = ({ returnResponseData }: { returnResponseData: ReturnPropertyData }) => {
    const [streetAddress, setStreetAddress] = useState(initialRentalCalculatorFormState.propertyInformation.streetAddress);
    const [city, setCity] = useState(initialRentalCalculatorFormState.propertyInformation.city);
    const [state, setState] = useState(initialRentalCalculatorFormState.propertyInformation.state);
    const [zipCode, setZipCode] = useState(initialRentalCalculatorFormState.propertyInformation.zipCode);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
      // Construct the full address object
      setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };

    return (
      <div className='addressFormContainer'>
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
        <Button
          buttonType={"primary"}
          size="small"
          onClick={handleSubmit}
          style={{padding: "10px 20px", margin: "10px 0px 5px 10px"}}
          label="Get Property Data"
          loading={loading}
        />
      </div>
    );
  };
