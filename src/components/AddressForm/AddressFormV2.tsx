// src/AddressFormV2.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAddressAutofillCore } from '@mapbox/search-js-react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique session tokens
import { debounce } from '@mui/material';
import { LoadingBar } from '../LoadingBar/LoadingBar';

export const AddressFormV2: React.FC = () => {
  // State to manage the input value
  const [address, setAddress] = useState<string>('');

  // State to manage suggestions
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // State to manage selected address details
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // State to manage loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize a unique session token
  const sessionTokenRef = useRef<string>(uuidv4());

  // Initialize the useAddressAutofillCore hook
  const { defaults, retrieve, suggest } = useAddressAutofillCore({
    accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '', // Use environment variable
  });

  // Reference to the input element to attach event listeners
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler for retrieve events
  const handleRetrieve = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ features: any[] }>;
    const features = customEvent.detail.features;
    if (features && features.length > 0) {
      const feature = features[0];
      console.log('Selected address:', feature);
      setSelectedAddress(feature);
      setAddress(feature.place_name);
      setSuggestions([]); // Clear suggestions after selection
    } else {
      console.warn('No features retrieved.');
      setError('No address found. Please try again.');
    }
  }, []);

  // Attach the retrieve event listener to the input element
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener('retrieve', handleRetrieve as EventListener);
    }

    // Cleanup the event listener on unmount
    return () => {
      if (input) {
        input.removeEventListener('retrieve', handleRetrieve as EventListener);
      }
    };
  }, [handleRetrieve]);

  // Debounced version of the suggest function to optimize API calls
  const debouncedSuggest = useCallback(
    debounce(async (value: string) => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await suggest(value, { sessionToken: sessionTokenRef.current });
        setSuggestions(results.suggestions); // Correctly set suggestions array
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch address suggestions.');
      } finally {
        setLoading(false);
      }
    }, 300), // 300ms debounce delay
    [suggest]
  );

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    debouncedSuggest(value);
  };

  // Handler for selecting a suggestion
  const handleSelect = async (suggestion: any) => {
    setLoading(true);
    setError(null);
    try {
      await retrieve(suggestion, { sessionToken: sessionTokenRef.current });
      // The retrieve function should trigger the handleRetrieve event
    } catch (err) {
      console.error('Error retrieving address:', err);
      setError('Failed to retrieve address details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <label htmlFor="address-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Address:
      </label>
      <input
        {...defaults}
        ref={inputRef}
        id="address-input"
        placeholder="Enter your address"
        type="text"
        value={address}
        onChange={handleChange}
        autoComplete="shipping street-address"
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      {/* Loading Indicator */}
      {loading && <LoadingBar text='Fetching property data'/>}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyleType: 'none',
            padding: '0',
            margin: '8px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
          role="listbox"
          aria-labelledby="address-input"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
              role="option"
              aria-selected={selectedAddress?.id === suggestion.id}
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}

      {/* Display Selected Address Details */}
      {selectedAddress && (
        <div style={{ marginTop: '16px' }}>
          <h3>Selected Address:</h3>
          <p>{selectedAddress.place_name}</p>
          {/* Optionally, display more details from selectedAddress.properties */}
        </div>
      )}
    </div>
  );
};
